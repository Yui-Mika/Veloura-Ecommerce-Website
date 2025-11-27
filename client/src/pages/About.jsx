import React from 'react'
import { FaGem, FaPalette, FaLeaf, FaHeart } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Dương Ngọc Linh Đan",
      position: "Founder & Developer",
      avatar: "https://ui-avatars.com/api/?name=Duong+Ngoc+Linh+Dan&background=4F46E5&color=fff&size=200"
    },
    {
      id: 2,
      name: "Dương Chí Thiện",
      position: "CEO & Co-Founder",
      avatar: "https://ui-avatars.com/api/?name=Duong+Chi+Thien&background=7C3AED&color=fff&size=200"
    },
    {
      id: 3,
      name: "Võ Ngọc Phú",
      position: "VIP Full-stack Developer",
      avatar: "https://ui-avatars.com/api/?name=Vo+Ngoc+Phu&background=2563EB&color=fff&size=200"
    },
    {
      id: 4,
      name: "Lê Tấn Nguyện",
      position: "Developer & Designer",
      avatar: "https://ui-avatars.com/api/?name=Le+Tan+Nguyen&background=DB2777&color=fff&size=200"
    },
    {
      id: 5,
      name: "Nguyễn Thanh Sơn",
      position: "Intern Developer",
      avatar: "https://ui-avatars.com/api/?name=Nguyen+Thanh+Son&background=059669&color=fff&size=200"
    }
  ]

  const brandValues = [
    {
      icon: <FaGem className="text-3xl" />,
      title: "Chất lượng vượt trội",
      description: "Cam kết mang đến sản phẩm chất lượng cao với chất liệu tốt nhất",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <FaPalette className="text-3xl" />,
      title: "Thiết kế độc đáo",
      description: "Sáng tạo phong cách riêng biệt, nổi bật giữa đám đông",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: <FaLeaf className="text-3xl" />,
      title: "Bền vững",
      description: "Sản xuất thân thiện môi trường, hướng tới tương lai xanh",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <FaHeart className="text-3xl" />,
      title: "Dịch vụ tận tâm",
      description: "Đặt trải nghiệm khách hàng lên hàng đầu trong mọi hoạt động",
      gradient: "from-pink-500 to-rose-600"
    }
  ]

  const stats = [
    { number: "2025", label: "Năm thành lập" },
    { number: "24/7", label: "Hỗ trợ" },
    { number: "100%", label: "Chất lượng" },
    { number: "98%", label: "Hài lòng" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-32 pt-40">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="max-padd-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-2">
                Veloura
              </h1>
              <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            <p className="text-2xl md:text-3xl text-gray-300 font-light mb-8 italic">
              "Elevating Your Style, Defining Your Elegance"
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Thương hiệu thời trang cao cấp, tập trung vào chất lượng và phong cách
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-padd-container py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-padd-container py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Câu chuyện của chúng tôi</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Hành trình <span className="text-gray-400 font-light">tạo nên phong cách</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Veloura được thành lập vào năm 2025 với sứ mệnh mang đến những sản phẩm thời trang cao cấp, 
            kết hợp hoàn hảo giữa chất lượng vượt trội và thiết kế tinh tế. Chúng tôi tin rằng mỗi người 
            đều xứng đáng có một phong cách riêng biệt, thể hiện cá tính và đẳng cấp của bản thân.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Với đội ngũ thiết kế tài năng và quy trình sản xuất nghiêm ngặt, Veloura không ngừng sáng tạo 
            để mang đến những bộ sưu tập độc đáo, phù hợp với xu hướng hiện đại nhưng vẫn giữ được nét 
            thanh lịch vượt thời gian.
          </p>
        </div>
      </div>

      {/* Brand Values */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-padd-container">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Giá trị cốt lõi</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Điều chúng tôi <span className="text-gray-400 font-light">tin tưởng</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandValues.map((value, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-padd-container py-20">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Đội ngũ của chúng tôi</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gặp gỡ <span className="text-gray-400 font-light">những người sáng tạo</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đội ngũ tài năng và nhiệt huyết, luôn nỗ lực mang đến trải nghiệm tốt nhất cho bạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Avatar */}
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-gray-100 group-hover:ring-8 group-hover:ring-indigo-100 transition-all">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600 font-medium">{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-padd-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Khám phá <span className="text-gray-400 font-light">phong cách của bạn</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Trải nghiệm bộ sưu tập thời trang cao cấp được thiết kế dành riêng cho bạn
          </p>
          <Link
            to="/collection"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-block px-10 py-4 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
          >
            Xem bộ sưu tập
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
