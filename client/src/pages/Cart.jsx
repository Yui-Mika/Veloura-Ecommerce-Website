import React, { useContext, useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import { useLocation, Link } from "react-router-dom";

const Cart = () => {
  const {
    navigate,
    products,
    currency,
    formatCurrency,
    cartItems,
    updateQuantity,
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]); // lưu trữ dữ liệu sản phẩm trong giỏ hàng

  const location = useLocation();
  const isOrderPage = location.pathname.includes("place-order");

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempData.push({
              _id: itemId,
              size: size,
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [products, cartItems]);

  const increment = (id, size) => {
    const currentQuantity = cartItems[id][size];
    updateQuantity(id, size, currentQuantity + 1);
  };

  const decrement = (id, size) => {
    const currentQuantity = cartItems[id][size];
    if (currentQuantity > 1) {
      updateQuantity(id, size, currentQuantity - 1);
    }
  };

  return products.length > 0 && cartItems ? (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 pt-32">
        <div className="max-padd-container">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaShoppingCart className="text-2xl" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Giỏ hàng <span className="text-gray-400 font-light">của bạn</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Khám phá bộ sưu tập quần áo và giày dép thời trang của chúng tôi, mang lại sự thoải mái, chất lượng và sự tự tin mỗi ngày.
            </p>
          </div>
        </div>
      </div>

      <div className="max-padd-container py-16">
        {cartData.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h3>
            <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
            <Link
              to="/collection"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left Side - Cart Items */}
            <div className="flex-[2]">
              <div className="space-y-4">
                {cartData.map((item, i) => {
                  const product = products.find((product) => product._id === item._id);
                  const quantity = cartItems[item._id][item.size];

                  return (
                    <div
                      key={i}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-32 h-32 bg-gray-50 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 capitalize">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm text-gray-600">Kích cỡ:</span>
                                <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-lg font-semibold text-sm border border-gray-300">
                                  {item.size}
                                </span>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => updateQuantity(item._id, item.size, 0)}
                              className="w-10 h-10 rounded-lg bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 text-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                              title="Xóa sản phẩm"
                            >
                              <IoCloseCircleOutline className="text-2xl" />
                            </button>
                          </div>

                          {/* Quantity Controls & Price */}
                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => decrement(item._id, item.size)}
                                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 hover:text-white text-gray-700 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                <FaMinus className="text-sm" />
                              </button>
                              <span className="w-12 text-center font-bold text-gray-900 text-lg">
                                {quantity}
                              </span>
                              <button
                                onClick={() => increment(item._id, item.size)}
                                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 hover:text-white text-gray-700 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                <FaPlus className="text-sm" />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                              <p className="text-sm text-gray-600 mb-1">Tạm tính</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(product.offerPrice * quantity)}{currency}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Summary */}
            <div className="xl:flex-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gray-900 rounded-full"></span>
                  Tóm tắt đơn hàng
                </h2>

                <CartTotal />

                {!isOrderPage ? (
                  <button
                    onClick={() => navigate("/place-order")}
                    className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white rounded-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    Tiến hành giao hàng
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white rounded-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    Đặt hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default Cart;
