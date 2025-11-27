from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from app.models.order import OrderCreate, OrderStatusUpdate, OrderUpdate
from app.config.database import get_collection
from app.middleware.auth_user import auth_user
from app.middleware.auth_admin import auth_staff
from app.config.settings import settings
from app.utils.vnpay_helper import create_payment_url, verify_payment_signature, get_client_ip
from bson import ObjectId
from datetime import datetime
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

# Helper function to update product quantity
async def update_product_quantity(product_id: str, quantity_change: int):
    """
    Update product quantity in database.
    
    Args:
        product_id: Product ID to update
        quantity_change: Amount to change (negative for decrease, positive for increase)
    
    Returns:
        Updated product document or None if not found
    """
    products_collection = await get_collection("products")
    
    # Use atomic $inc operation to safely update quantity
    result = await products_collection.find_one_and_update(
        {"_id": ObjectId(product_id)},
        {
            "$inc": {"quantity": quantity_change},
            "$set": {"updatedAt": datetime.utcnow()}
        },
        return_document=True
    )
    
    return result

@router.post("/cod", response_model=dict)
async def place_cod_order(order_data: OrderCreate, request: Request, user: dict = Depends(auth_user)):
    """Place order with Cash on Delivery"""
    # Validate items không rỗng
    if not order_data.items or len(order_data.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Giỏ hàng trống! Không thể đặt hàng."
        )
    
    products_collection = await get_collection("products")
    orders_collection = await get_collection("orders")
    users_collection = await get_collection("users")
    
    # Get product details and calculate total
    order_items = []
    total_amount = 0
    
    for item in order_data.items:
        product = await products_collection.find_one({"_id": ObjectId(item.product), "isActive": True})
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sản phẩm {item.product} không tồn tại"
            )
        
        # Kiểm tra số lượng tồn kho
        if product.get("quantity", 0) < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sản phẩm '{product['name']}' chỉ còn {product.get('quantity', 0)} sản phẩm trong kho"
            )
        
        item_total = product["offerPrice"] * item.quantity
        total_amount += item_total
        
        order_items.append({
            "product": {
                "_id": str(product["_id"]),
                "name": product["name"],
                "image": product["image"],
                "offerPrice": product["offerPrice"]
            },
            "quantity": item.quantity,
            "size": item.size
        })
    
    # Add delivery charges
    total_amount += settings.DELIVERY_CHARGES
    
    # Create order
    order_doc = {
        "userId": str(user["_id"]),
        "items": order_items,
        "amount": total_amount,
        "address": order_data.address.model_dump(),
        "status": "Order Placed",
        "paymentMethod": "COD",
        "isPaid": False,
        "paidAt": None,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = await orders_collection.insert_one(order_doc)
    
    # Trừ số lượng sản phẩm trong kho
    for item in order_data.items:
        await update_product_quantity(item.product, -item.quantity)
    
    # Clear user's cart
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"cartData": {}, "updatedAt": datetime.utcnow()}}
    )
    
    return {
        "success": True,
        "message": "Đặt hàng thành công",
        "orderId": str(result.inserted_id)
    }

@router.post("/stripe", response_model=dict)
async def place_stripe_order(order_data: OrderCreate, request: Request, user: dict = Depends(auth_user)):
    """Place order with Stripe payment"""
    # Validate items không rỗng
    if not order_data.items or len(order_data.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Giỏ hàng trống! Không thể đặt hàng."
        )
    
    products_collection = await get_collection("products")
    orders_collection = await get_collection("orders")
    
    # Get product details and calculate total
    order_items = []
    total_amount = 0
    line_items = []
    
    for item in order_data.items:
        product = await products_collection.find_one({"_id": ObjectId(item.product), "isActive": True})
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item.product} not found"
            )
        
        # Kiểm tra số lượng tồn kho
        if product.get("quantity", 0) < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sản phẩm '{product['name']}' chỉ còn {product.get('quantity', 0)} sản phẩm trong kho"
            )
        
        item_total = product["offerPrice"] * item.quantity
        total_amount += item_total
        
        order_items.append({
            "product": {
                "_id": str(product["_id"]),
                "name": product["name"],
                "image": product["image"],
                "offerPrice": product["offerPrice"]
            },
            "quantity": item.quantity,
            "size": item.size
        })
        
        # Add to Stripe line items
        line_items.append({
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": product["name"],
                },
                "unit_amount": int(product["offerPrice"] * 100),  # Convert to cents
            },
            "quantity": item.quantity,
        })
    
    # Add delivery charges
    total_amount += settings.DELIVERY_CHARGES
    line_items.append({
        "price_data": {
            "currency": "usd",
            "product_data": {
                "name": "Delivery Charges",
            },
            "unit_amount": int(settings.DELIVERY_CHARGES * 100),
        },
        "quantity": 1,
    })
    
    # Create order (pending payment)
    order_doc = {
        "userId": str(user["_id"]),
        "items": order_items,
        "amount": total_amount,
        "address": order_data.address.model_dump(),
        "status": "Pending Payment",
        "paymentMethod": "Stripe",
        "isPaid": False,
        "paidAt": None,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = await orders_collection.insert_one(order_doc)
    order_id = str(result.inserted_id)
    
    # Create Stripe checkout session
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{settings.FRONTEND_URL}/my-orders?success=true&orderId={order_id}",
            cancel_url=f"{settings.FRONTEND_URL}/cart?cancelled=true",
            metadata={
                "orderId": order_id,
                "userId": str(user["_id"])
            }
        )
        
        # Update order with session ID
        await orders_collection.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"stripeSessionId": session.id}}
        )
        
        return {
            "success": True,
            "url": session.url,
            "sessionId": session.id
        }
    except Exception as e:
        # Delete order if Stripe session creation fails
        await orders_collection.delete_one({"_id": ObjectId(order_id)})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment processing failed: {str(e)}"
        )

@router.post("/vnpay", response_model=dict)
async def place_vnpay_order(order_data: OrderCreate, request: Request, user: dict = Depends(auth_user)):
    """Place order with VNPay payment"""
    print("=" * 60)
    print("🔍 VNPAY ORDER ENDPOINT CALLED")
    print(f"   User: {user.get('email')}")
    print(f"   Items count: {len(order_data.items)}")
    print("=" * 60)
    
    # Validate items không rỗng
    if not order_data.items or len(order_data.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Giỏ hàng trống! Không thể đặt hàng."
        )
    
    products_collection = await get_collection("products")
    orders_collection = await get_collection("orders")
    
    try:
        # Get product details and calculate total
        order_items = []
        total_amount = 0
        
        for item in order_data.items:
            product = await products_collection.find_one({"_id": ObjectId(item.product), "isActive": True})
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product {item.product} not found"
                )
            
            # Kiểm tra số lượng tồn kho
            if product.get("quantity", 0) < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Sản phẩm '{product['name']}' chỉ còn {product.get('quantity', 0)} sản phẩm trong kho"
                )
            
            item_total = product["offerPrice"] * item.quantity
            total_amount += item_total
            
            order_items.append({
                "product": {
                    "_id": str(product["_id"]),
                    "name": product["name"],
                    "image": product["image"],
                    "offerPrice": product["offerPrice"]
                },
                "quantity": item.quantity,
                "size": item.size
            })
        
        # Add fees from snapshot
        total_amount += order_data.fees.shippingFee
        total_amount += total_amount * order_data.fees.taxRate
        
        # Giá đã là VND, không cần convert
        # VNPay yêu cầu số tiền >= 5,000 VND
        total_amount_vnd = int(total_amount)
        
        print(f"💰 Total amount: {total_amount} VND")
        print(f"💰 Total amount VND for VNPay: {total_amount_vnd} VND")
        
        if total_amount_vnd < 5000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Số tiền giao dịch phải từ 5,000 VND trở lên (hiện tại: {total_amount_vnd} VND)"
            )
        
        # Create order (pending payment)
        order_doc = {
            "userId": str(user["_id"]),
            "items": order_items,
            "amount": total_amount,
            "address": order_data.address.model_dump(),
            "fees": order_data.fees.model_dump(),
            "status": "Pending Payment",
            "paymentMethod": "VNPay",
            "isPaid": False,
            "paidAt": None,
            "vnpayTransactionNo": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await orders_collection.insert_one(order_doc)
        order_id = str(result.inserted_id)
        
        # Get client IP
        ip_addr = get_client_ip(request)
        
        # Create VNPay payment URL
        order_info = f"Thanh toan don hang #{order_id}"
        payment_url = create_payment_url(
            order_id=order_id,
            amount=total_amount_vnd,
            order_info=order_info,
            ip_addr=ip_addr
        )
        
        return {
            "success": True,
            "url": payment_url,
            "orderId": order_id
        }
        
    except HTTPException as he:
        print(f"❌ HTTPException in VNPay: {he.status_code} - {he.detail}")
        raise he
    except Exception as e:
        print(f"❌ Exception in VNPay: {type(e).__name__} - {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment processing failed: {str(e)}"
        )

@router.post("/userorders", response_model=dict)
async def get_user_orders(request: Request, user: dict = Depends(auth_user)):
    """Get all orders for logged-in user"""
    orders_collection = await get_collection("orders")
    
    orders = await orders_collection.find({"userId": str(user["_id"])}).sort("createdAt", -1).to_list(length=None)
    
    for order in orders:
        order["_id"] = str(order["_id"])
    
    return {
        "success": True,
        "orders": orders
    }

@router.post("/list", response_model=dict)
async def get_all_orders(staff: dict = Depends(auth_staff)):
    """Get all orders (Staff/Admin only)"""
    orders_collection = await get_collection("orders")
    
    orders = await orders_collection.find({}).sort("createdAt", -1).to_list(length=None)
    
    for order in orders:
        order["_id"] = str(order["_id"])
    
    return {
        "success": True,
        "orders": orders
    }

@router.post("/status", response_model=dict)
async def update_order_status(status_update: OrderStatusUpdate, staff: dict = Depends(auth_staff)):
    """Update order status (Staff/Admin only)"""
    orders_collection = await get_collection("orders")
    
    # Validate status
    valid_statuses = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"]
    if status_update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trạng thái không hợp lệ"
        )
    
    result = await orders_collection.update_one(
        {"_id": ObjectId(status_update.orderId)},
        {"$set": {"status": status_update.status, "updatedAt": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng"
        )
    
    return {
        "success": True,
        "message": "Cập nhật trạng thái đơn hàng thành công"
    }

@router.post("/update", response_model=dict)
async def update_order(order_update: OrderUpdate, staff: dict = Depends(auth_staff)):
    """Update order details (Staff/Admin only)"""
    orders_collection = await get_collection("orders")
    
    # Lấy order hiện tại để kiểm tra trạng thái cũ
    current_order = await orders_collection.find_one({"_id": ObjectId(order_update.orderId)})
    if not current_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng"
        )
    
    # Build update dict
    update_data = {"updatedAt": datetime.utcnow()}
    
    if order_update.status:
        # Validate status
        valid_statuses = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"]
        if order_update.status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Trạng thái không hợp lệ"
            )
        
        # Hoàn lại quantity nếu đổi sang Cancelled từ trạng thái khác
        old_status = current_order.get("status")
        if order_update.status == "Cancelled" and old_status != "Cancelled":
            # Hoàn lại số lượng sản phẩm vào kho
            for item in current_order["items"]:
                product_id = item["product"]["_id"]
                await update_product_quantity(product_id, item["quantity"])
        
        update_data["status"] = order_update.status
    
    if order_update.address:
        update_data["address"] = order_update.address.model_dump()
    
    result = await orders_collection.update_one(
        {"_id": ObjectId(order_update.orderId)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng"
        )
    
    return {
        "success": True,
        "message": "Cập nhật đơn hàng thành công"
    }

@router.post("/delete", response_model=dict)
async def delete_order(request: dict, staff: dict = Depends(auth_staff)):
    """Delete order - Admin/Staff only"""
    orders_collection = await get_collection("orders")
    products_collection = await get_collection("products")
    
    order_id = request.get("orderId")
    if not order_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Thiếu orderId"
        )
    
    # Kiểm tra order tồn tại
    order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Đơn hàng không tồn tại"
        )
    
    # Nếu đơn hàng chưa bị hủy và chưa giao, hoàn lại số lượng sản phẩm
    if order.get("status") not in ["Cancelled", "Delivered"]:
        for item in order.get("items", []):
            product_id = item["product"]["_id"]
            quantity = item["quantity"]
            # Hoàn lại số lượng vào kho
            await update_product_quantity(product_id, quantity)
    
    # Xóa đơn hàng
    result = await orders_collection.delete_one({"_id": ObjectId(order_id)})
    
    if result.deleted_count > 0:
        return {
            "success": True,
            "message": "Đã xóa đơn hàng thành công"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể xóa đơn hàng"
        )

@router.post("/verify-stripe", response_model=dict)
async def verify_stripe_payment(session_id: str, request: Request, user: dict = Depends(auth_user)):
    """Verify Stripe payment and update order"""
    orders_collection = await get_collection("orders")
    users_collection = await get_collection("users")
    
    try:
        # Retrieve session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == "paid":
            # Get order to retrieve items
            order = await orders_collection.find_one({"stripeSessionId": session_id})
            
            if order:
                # Trừ số lượng sản phẩm trong kho
                for item in order["items"]:
                    product_id = item["product"]["_id"]
                    await update_product_quantity(product_id, -item["quantity"])
            
            # Update order
            result = await orders_collection.update_one(
                {"stripeSessionId": session_id},
                {
                    "$set": {
                        "isPaid": True,
                        "paidAt": datetime.utcnow(),
                        "status": "Order Placed",
                        "updatedAt": datetime.utcnow()
                    }
                }
            )
            
            # Clear cart
            await users_collection.update_one(
                {"_id": user["_id"]},
                {"$set": {"cartData": {}, "updatedAt": datetime.utcnow()}}
            )
            
            return {
                "success": True,
                "message": "Xác minh thanh toán thành công"
            }
        else:
            return {
                "success": False,
                "message": "Thanh toán chưa hoàn tất"
            }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment verification failed: {str(e)}"
        )

@router.get("/vnpay-return")
async def vnpay_return(request: Request):
    """Handle VNPay payment callback"""
    orders_collection = await get_collection("orders")
    users_collection = await get_collection("users")
    
    try:
        # Lấy tất cả query params từ VNPay
        params = dict(request.query_params)
        
        # Verify signature từ VNPay
        if not verify_payment_signature(params):
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/cart?error=invalid_signature",
                status_code=status.HTTP_303_SEE_OTHER
            )
        
        # Lấy thông tin từ params
        vnp_response_code = params.get('vnp_ResponseCode')
        order_id = params.get('vnp_TxnRef')
        vnp_transaction_no = params.get('vnp_TransactionNo')
        vnp_amount = params.get('vnp_Amount')
        
        # Kiểm tra order tồn tại
        order = await orders_collection.find_one({"_id": ObjectId(order_id)})
        if not order:
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/cart?error=order_not_found",
                status_code=status.HTTP_303_SEE_OTHER
            )
        
        # Kiểm tra ResponseCode
        if vnp_response_code == '00':
            # Thanh toán thành công
            
            # Kiểm tra duplicate callback (idempotency)
            if order.get("isPaid"):
                # Order đã được thanh toán rồi, chỉ redirect
                return RedirectResponse(
                    url=f"{settings.FRONTEND_URL}/my-orders?success=true&orderId={order_id}",
                    status_code=status.HTTP_303_SEE_OTHER
                )
            
            # Trừ số lượng sản phẩm trong kho
            for item in order["items"]:
                product_id = item["product"]["_id"]
                await update_product_quantity(product_id, -item["quantity"])
            
            # Update order status
            await orders_collection.update_one(
                {"_id": ObjectId(order_id)},
                {
                    "$set": {
                        "status": "Order Placed",
                        "isPaid": True,
                        "paidAt": datetime.utcnow(),
                        "vnpayTransactionNo": vnp_transaction_no,
                        "updatedAt": datetime.utcnow()
                    }
                }
            )
            
            # Clear user's cart
            user_id = order.get("userId")
            if user_id:
                await users_collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": {"cartData": {}, "updatedAt": datetime.utcnow()}}
                )
            
            # Redirect về My Orders với success message
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/my-orders?success=true&orderId={order_id}",
                status_code=status.HTTP_303_SEE_OTHER
            )
        else:
            # Thanh toán thất bại
            # Xóa order hoặc update status = Cancelled
            await orders_collection.update_one(
                {"_id": ObjectId(order_id)},
                {
                    "$set": {
                        "status": "Cancelled",
                        "updatedAt": datetime.utcnow()
                    }
                }
            )
            
            # Redirect về Cart với error message
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/cart?cancelled=true&code={vnp_response_code}",
                status_code=status.HTTP_303_SEE_OTHER
            )
            
    except Exception as e:
        print(f"VNPay callback error: {str(e)}")
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/cart?error=processing_failed",
            status_code=status.HTTP_303_SEE_OTHER
        )
