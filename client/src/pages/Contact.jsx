import React from 'react'
import { FaEnvelope, FaHeadphones, FaLocationDot, FaPhone, FaTruckFast, FaShieldHalved, FaArrowsRotate, FaClock } from 'react-icons/fa6'
import { RiSecurePaymentLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 pt-32">
      <div className="max-padd-container">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Liên hệ với chúng tôi</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Chúng tôi luôn <span className="text-gray-400 font-light">sẵn sàng</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
            Hãy liên hệ với chúng tôi qua bất kỳ kênh nào dưới đây. Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn.
          </p>
          <Link
            to="/collection"
            className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Khám phá bộ sưu tập
          </Link>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Address */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <FaLocationDot className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Địa chỉ</h3>
            <p className="text-gray-600 leading-relaxed">123 Đường Veloura, Thành phố Hoa Anh Đào, FC 12345</p>
          </div>

          {/* Email */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <FaEnvelope className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Email</h3>
            <a href="mailto:info@veloura.com" className="text-gray-600 hover:text-green-600 transition-colors">
              info@veloura.com
            </a>
          </div>

          {/* Phone */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <FaPhone className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Điện thoại</h3>
            <a href="tel:+18001234567" className="text-gray-600 hover:text-purple-600 transition-colors">
              +1 (800) 123-4567
            </a>
          </div>

          {/* Support */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <FaHeadphones className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Hỗ trợ</h3>
            <p className="text-gray-600">Hỗ trợ 24/7</p>
          </div>
        </div>

        {/* Customer Support Features */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-10 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn <span className="text-gray-400 font-light">chúng tôi?</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với các dịch vụ hỗ trợ toàn diện
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free Shipping */}
            <div className="group flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <FaTruckFast className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Giao hàng nhanh</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Miễn phí vận chuyển cho đơn hàng trên 2.400.000₫</p>
            </div>

            {/* 24/7 Support */}
            <div className="group flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <FaHeadphones className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Hỗ trợ 24/7</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Đội ngũ hỗ trợ luôn sẵn sàng phục vụ bạn</p>
            </div>

            {/* Easy Returns */}
            <div className="group flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-300 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <FaArrowsRotate className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Đổi trả dễ dàng</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Đổi trả miễn phí trong vòng 7 ngày</p>
            </div>

            {/* Secure Payment */}
            <div className="group flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-300 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <RiSecurePaymentLine className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Thanh toán an toàn</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Giao dịch được mã hóa đảm bảo an toàn 100%</p>
            </div>
          </div>
        </div>

        {/* Business Hours & Social */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Hours */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-10 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <FaClock className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">Giờ làm việc</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Thứ 2 - Thứ 6</span>
                <span className="font-semibold">9:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Thứ 7</span>
                <span className="font-semibold">10:00 - 16:00</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-300">Chủ nhật</span>
                <span className="font-semibold text-red-400">Nghỉ</span>
              </div>
            </div>
          </div>

          {/* Quick Links & Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gray-900 rounded-full"></span>
              Liên kết nhanh
            </h3>
            <div className="space-y-4">
              <Link to="/collection" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-gray-700 font-medium">Bộ sưu tập</span>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/blogs" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-gray-700 font-medium">Blog</span>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/testimonial" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-gray-700 font-medium">Đánh giá</span>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="text-gray-700 font-medium">Về chúng tôi</span>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
