import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaStar, FaBox, FaTruck, FaCheckCircle, FaClock, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";
import OrderTrackingModal from "../components/OrderTrackingModal";

const MyOrders = () => {
  const { currency, formatCurrency, user, axios, navigate, translateStatus } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState(new Set()); // Track reviewed products
  const [showTracking, setShowTracking] = useState(false); // State for tracking modal
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for tracking

  const loadOrderData = async () => {
    if (!user) return;
    try {
      const { data } = await axios.post("/api/order/userorders");
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  // Check if user already reviewed a product
  const checkIfReviewed = async (productId) => {
    try {
      const { data } = await axios.get(`/api/review/user/my-reviews`);
      if (data.success) {
        const reviewed = data.reviews.some(review => review.productId === productId);
        return reviewed;
      }
      return false;
    } catch (error) {
      console.log("Error checking review:", error);
      return false;
    }
  };

  // Load user's reviewed products
  const loadReviewedProducts = async () => {
    try {
      const { data } = await axios.get(`/api/review/user/my-reviews`);
      if (data.success) {
        const productIds = new Set(data.reviews.map(review => review.productId));
        setReviewedProducts(productIds);
      }
    } catch (error) {
      console.log("Error loading reviewed products:", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrderData();
      loadReviewedProducts();
    }
  }, [user]);

  // Get status badge style
  const getStatusBadge = (status) => {
    const badges = {
      "Pending Payment": {
        gradient: "from-gray-500 to-gray-600",
        icon: <FaClock className="text-lg" />,
        text: "Chờ thanh toán"
      },
      "Processing": {
        gradient: "from-blue-500 to-indigo-600",
        icon: <FaBox className="text-lg" />,
        text: "Đang xử lý"
      },
      "Shipped": {
        gradient: "from-purple-500 to-violet-600",
        icon: <FaTruck className="text-lg" />,
        text: "Đang giao"
      },
      "Delivered": {
        gradient: "from-green-500 to-emerald-600",
        icon: <FaCheckCircle className="text-lg" />,
        text: "Đã giao"
      }
    };
    return badges[status] || badges["Processing"];
  };

  // Get timeline progress
  const getTimelineProgress = (status) => {
    const steps = ["Pending Payment", "Processing", "Shipped", "Delivered"];
    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? currentIndex + 1 : 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 pt-32">
        <div className="max-padd-container">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaShoppingBag className="text-2xl" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Đơn hàng <span className="text-gray-400 font-light">của bạn</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Theo dõi và quản lý tất cả đơn hàng của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="max-padd-container py-16">
        {orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có đơn hàng nào</h3>
            <p className="text-gray-600 mb-8">Bạn chưa đặt đơn hàng nào. Khám phá sản phẩm ngay!</p>
            <Link
              to="/collection"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const progress = getTimelineProgress(order.status);

              return (
                <div 
                  key={order._id} 
                  className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${statusBadge.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          {statusBadge.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">Đơn hàng</h3>
                            <span className="text-xs text-gray-500">#{order._id.slice(-8)}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>

                      <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${statusBadge.gradient} text-white rounded-lg font-semibold shadow-md`}>
                        {statusBadge.icon}
                        <span>{statusBadge.text}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  <div className="px-6 py-4 bg-gray-50/50">
                    <div className="flex items-center justify-between relative">
                      {/* Progress Bar Background */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                      {/* Progress Bar Fill */}
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ width: `${((progress - 1) / 3) * 100}%` }}
                      ></div>

                      {/* Steps */}
                      {[
                        { icon: <FaClock />, label: "Chờ" },
                        { icon: <FaBox />, label: "Xử lý" },
                        { icon: <FaTruck />, label: "Giao" },
                        { icon: <FaCheckCircle />, label: "Hoàn thành" }
                      ].map((step, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 z-10 relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            index < progress 
                              ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-lg scale-110' 
                              : 'bg-white text-gray-400 border-2 border-gray-200'
                          }`}>
                            {step.icon}
                          </div>
                          <span className={`text-xs font-medium hidden sm:block ${
                            index < progress ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Products List */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex gap-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                            <img 
                              src={item.product.image[0]} 
                              alt={item.product.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-1 capitalize">
                              {item.product.name}
                            </h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Giá:</span>
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(item.product.offerPrice)}{currency}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">SL:</span>
                                <span className="font-semibold text-gray-900">{item.quantity}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Size:</span>
                                <span className="font-semibold text-gray-900">{item.size}</span>
                              </div>
                            </div>

                            {/* Review Button */}
                            {order.status === "Delivered" && !reviewedProducts.has(item.product._id) && (
                              <button
                                onClick={() => navigate(`/product/${item.product._id}?review=true`)}
                                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm"
                              >
                                <FaStar />
                                <span>Viết đánh giá</span>
                              </button>
                            )}

                            {/* Already Reviewed Badge */}
                            {order.status === "Delivered" && reviewedProducts.has(item.product._id) && (
                              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium text-sm shadow-md">
                                <FaStar />
                                <span>Đã đánh giá</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Thanh toán:</span>
                          <span className={`ml-2 font-semibold ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                            {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phương thức:</span>
                          <span className="ml-2 font-semibold text-gray-900">{order.paymentMethod}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Tổng tiền:</span>
                          <span className="ml-2 font-bold text-lg text-gray-900">
                            {formatCurrency(order.amount)}{currency}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowTracking(true);
                        }}
                        className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        Theo dõi đơn hàng
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Tracking Modal */}
      <OrderTrackingModal 
        isOpen={showTracking}
        onClose={() => setShowTracking(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default MyOrders;
