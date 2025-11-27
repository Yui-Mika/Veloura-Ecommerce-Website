# 🛍️ Veloura - E-commerce Fashion Platform

> Hệ thống thương mại điện tử thời trang hiện đại với AI Chatbot & RAG

## 👥 Thành Viên Nhóm

| Họ và Tên | MSSV |
|-----------|------|
| **Dương Ngọc Linh Đan** | 2374802010091 |
| **Võ Ngọc Phú** | 2374802010390 |
| **Lê Tấn Nguyên** | 2374802010354 |
| **Dương Chí Thiện** | 2374802010468 |
| **Nguyễn Thanh Sơn** | 2374802010436 |

---

## 📋 Tổng Quan Dự Án

**Veloura** là một nền tảng thương mại điện tử thời trang full-stack, được xây dựng với công nghệ hiện đại và tích hợp AI Chatbot thông minh sử dụng RAG (Retrieval-Augmented Generation) để tư vấn sản phẩm cho khách hàng.

### 🎯 Mục Tiêu
- Xây dựng hệ thống e-commerce hoàn chỉnh với trải nghiệm mua sắm mượt mà
- Tích hợp AI Chatbot thông minh hỗ trợ tìm kiếm và tư vấn sản phẩm
- Quản lý đa vai trò: Admin, Staff, Customer với phân quyền rõ ràng
- Thanh toán đa dạng: COD, Stripe, VNPay
- Hệ thống blog và đánh giá sản phẩm

---

## 🏗️ Kiến Trúc Hệ Thống

### **Frontend** (React + Vite)
```
client/
├── src/
│   ├── components/          # UI Components
│   │   ├── Header.jsx
│   │   ├── Navbar.jsx
│   │   ├── ChatWidget.jsx   # AI Chatbot Widget
│   │   └── admin/           # Admin Components
│   ├── pages/               # Page Components
│   │   ├── Home.jsx
│   │   ├── Collection.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── PlaceOrder.jsx
│   │   ├── Blogs.jsx
│   │   ├── Testimonial.jsx
│   │   └── admin/           # Admin Pages
│   ├── context/             # React Context
│   │   ├── ShopContext.jsx
│   │   └── ChatContext.jsx
│   └── assets/              # Images & Data
```

### **Backend** (FastAPI + MongoDB)
```
fastapi-backend/
├── app/
│   ├── config/              # Configuration
│   │   ├── database.py      # MongoDB connection
│   │   ├── cloudinary.py    # Image upload
│   │   └── settings.py      # Environment variables
│   ├── models/              # Pydantic Models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── blog.py
│   │   └── chat.py
│   ├── routes/              # API Endpoints
│   │   ├── user_routes.py
│   │   ├── admin_routes.py
│   │   ├── product_routes.py
│   │   ├── order_routes.py
│   │   ├── chat_routes.py   # AI Chatbot API
│   │   └── ...
│   ├── middleware/          # Authentication
│   │   ├── auth_user.py
│   │   └── auth_admin.py
│   ├── services/            # Business Logic
│   │   ├── rag_service.py   # RAG Vector Search
│   │   └── embeddings.py    # Gemini Embeddings
│   └── utils/               # Helper Functions
│       ├── auth.py          # JWT & Password
│       ├── vnpay_helper.py  # VNPay Payment
│       └── email.py         # Email Service
├── mongodb_collections/     # Sample Data
├── scripts/                 # Utility Scripts
└── main.py                  # FastAPI App
```

---

## 🚀 Công Nghệ Sử Dụng

### **Frontend Technologies**
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **React** | 19.1.0 | UI Library |
| **Vite** | 6.3.5 | Build Tool |
| **React Router** | 7.6.1 | Routing |
| **Axios** | 1.10.0 | HTTP Client |
| **Tailwind CSS** | 3.4.17 | Styling |
| **React Icons** | 5.5.0 | Icon Library |
| **Swiper** | 11.2.8 | Image Slider |
| **Recharts** | 3.4.1 | Charts (Admin) |
| **React Hot Toast** | 2.5.2 | Notifications |
| **Lucide React** | 0.554.0 | Modern Icons |

### **Backend Technologies**
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **FastAPI** | 0.115.0 | Web Framework |
| **Motor** | 3.6.0 | Async MongoDB Driver |
| **PyMongo** | 4.9.1 | MongoDB ODM |
| **Pydantic** | 2.9.2 | Data Validation |
| **Python-Jose** | 3.3.0 | JWT Authentication |
| **Passlib** | 1.7.4 | Password Hashing |
| **Cloudinary** | 1.41.0 | Image Upload |
| **Stripe** | 11.1.0 | Payment Gateway |
| **FastAPI-Mail** | 1.4.1 | Email Service |
| **Google Generative AI** | 0.8.3 | Gemini API (AI) |

### **Database & AI**
- **MongoDB Atlas** - NoSQL Database với Vector Search
- **Google Gemini** - AI Model (text-embedding-004, gemini-1.5-flash)
- **RAG (Retrieval-Augmented Generation)** - AI Chatbot thông minh

---

## ✨ Tính Năng Chính

### 🛒 **E-commerce Core**
- ✅ Xem danh sách sản phẩm với filter, sort, search
- ✅ Chi tiết sản phẩm với hình ảnh, mô tả, đánh giá
- ✅ Giỏ hàng realtime với cập nhật số lượng
- ✅ Wishlist (Danh sách yêu thích)
- ✅ Đặt hàng với COD, Stripe, VNPay
- ✅ Theo dõi đơn hàng realtime
- ✅ Quản lý profile người dùng

### 🤖 **AI Chatbot (RAG)**
- ✅ Chatbot thông minh tư vấn sản phẩm
- ✅ Tìm kiếm sản phẩm bằng ngôn ngữ tự nhiên
- ✅ Vector Search với MongoDB Atlas
- ✅ Embeddings từ Google Gemini (768 dimensions)
- ✅ Response từ Gemini 1.5 Flash
- ✅ Context từ Products, Blogs, Categories

### 👔 **Quản Lý Admin/Staff**
- ✅ Dashboard với thống kê, biểu đồ
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng, cập nhật trạng thái
- ✅ Quản lý categories
- ✅ Quản lý blog (thêm, sửa, xóa, publish)
- ✅ Quản lý testimonials (duyệt đánh giá)
- ✅ Quản lý khách hàng
- ✅ Báo cáo doanh thu chi tiết
- ✅ Phân quyền Admin vs Staff

### 🔐 **Authentication & Security**
- ✅ JWT Authentication (httponly cookies)
- ✅ Password hashing với bcrypt
- ✅ Email verification
- ✅ Role-based access control (Admin/Staff/Customer)
- ✅ Secure payment integration

### 💳 **Payment Integration**
- ✅ Cash on Delivery (COD)
- ✅ Stripe Payment Gateway
- ✅ VNPay (Vietnamese Payment)
- ✅ Payment verification & webhooks

### 📧 **Email Service**
- ✅ Welcome email sau khi đăng ký
- ✅ Email verification
- ✅ Order confirmation emails
- ✅ SMTP integration (Gmail)

### 📝 **Blog System**
- ✅ Tạo và quản lý blog posts
- ✅ Categories cho blogs
- ✅ Publish/Draft status
- ✅ Featured images
- ✅ Tìm kiếm và filter blogs

### ⭐ **Reviews & Testimonials**
- ✅ Đánh giá sản phẩm (1-5 sao)
- ✅ Testimonials từ khách hàng
- ✅ Admin duyệt testimonials

---

## 🔧 Cài Đặt & Chạy Dự Án

### **1. Prerequisites**
```bash
# Cài đặt Node.js (v18+)
node --version

# Cài đặt Python (v3.9+)
python3 --version

# Cài đặt MongoDB hoặc sử dụng MongoDB Atlas
```

### **2. Clone Repository**
```bash
git clone https://github.com/Yui-Mika/Clothing-website.git
cd Clothing-website
```

### **3. Setup Backend**
```bash
cd fastapi-backend

# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env từ template
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
nano .env
```

**Cấu hình .env:**
```env
# MongoDB
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DATABASE_NAME=veloura

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# VNPay
VNPAY_TMN_CODE=your-vnpay-tmn-code
VNPAY_HASH_SECRET=your-vnpay-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:8000/api/order/vnpay/callback

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=models/text-embedding-004

# Email (Gmail SMTP)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin credentials
ADMIN_EMAIL=admin@veloura.com
ADMIN_PASSWORD=admin123
```

**Import dữ liệu mẫu:**
```bash
# Import collections vào MongoDB
cd mongodb_collections
# Xem hướng dẫn trong mongodb_collections/README.md

# Tạo vector embeddings cho RAG
cd ../scripts
python3 regenerate_embeddings.py
```

**Chạy Backend:**
```bash
cd ..
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend chạy tại: http://localhost:8000
API Docs: http://localhost:8000/docs

### **4. Setup Frontend**
```bash
# Mở terminal mới
cd client

# Cài đặt dependencies
npm install

# Tạo file .env (nếu cần)
echo "VITE_API_URL=http://localhost:8000" > .env

# Chạy frontend
npm run dev
```

Frontend chạy tại: http://localhost:5173

---

## 🔑 Tài Khoản Mẫu

### **Admin Account**
- Email: `admin@veloura.com`
- Password: `admin123`
- Quyền: Full access (tất cả chức năng)

### **Staff Account**
- Email: `staff@veloura.com`
- Password: `staff123`
- Quyền: Quản lý sản phẩm, đơn hàng, blogs

### **Customer Account**
- Email: `john.doe@example.com`
- Password: `password123`

---

## 📡 API Endpoints

### **Authentication**
```
POST   /api/user/register        # Đăng ký customer
POST   /api/user/login           # Đăng nhập customer
POST   /api/user/logout          # Đăng xuất
GET    /api/user/profile         # Xem profile
POST   /api/admin/login          # Đăng nhập admin/staff
```

### **Products**
```
GET    /api/product/list         # Danh sách sản phẩm
GET    /api/product/{id}         # Chi tiết sản phẩm
POST   /api/product/add          # Thêm sản phẩm [Staff]
PUT    /api/product/{id}         # Cập nhật sản phẩm [Staff]
DELETE /api/product/{id}         # Xóa sản phẩm [Staff]
```

### **Orders**
```
POST   /api/order/cod            # Đặt hàng COD
POST   /api/order/stripe         # Đặt hàng Stripe
POST   /api/order/vnpay          # Đặt hàng VNPay
GET    /api/order/user           # Đơn hàng của user
GET    /api/order/list           # Tất cả đơn hàng [Staff]
PUT    /api/order/{id}/status    # Cập nhật trạng thái [Staff]
```

### **AI Chatbot**
```
POST   /api/chat                 # Chat với AI
POST   /api/chat/stream          # Chat với streaming response
```

### **Blogs**
```
GET    /api/blog/list            # Danh sách blogs
GET    /api/blog/{id}            # Chi tiết blog
POST   /api/blog/add             # Thêm blog [Staff]
PUT    /api/blog/{id}            # Cập nhật blog [Staff]
DELETE /api/blog/{id}            # Xóa blog [Staff]
```

### **Reviews**
```
POST   /api/review/add           # Thêm review
GET    /api/review/product/{id}  # Reviews của sản phẩm
```

Xem đầy đủ: http://localhost:8000/docs

---

## 🤖 AI Chatbot RAG System

### **Cách Hoạt Động**

1. **User gửi câu hỏi** → "Tìm áo thun nam giá rẻ"

2. **Generate Embedding** → Gemini text-embedding-004 chuyển query thành vector 768 chiều

3. **Vector Search** → MongoDB Atlas tìm kiếm sản phẩm tương tự bằng cosine similarity

4. **Retrieve Context** → Lấy top 5 sản phẩm liên quan nhất

5. **Build Prompt** → Kết hợp query + context + conversation history

6. **Generate Response** → Gemini 1.5 Flash tạo câu trả lời tự nhiên bằng tiếng Việt

7. **Return Answer** → Trả về danh sách sản phẩm với tên, giá, link

### **Vector Search Setup**

Chi tiết cấu hình MongoDB Atlas Vector Search: [`MONGODB_VECTOR_SEARCH_SETUP.md`](fastapi-backend/MONGODB_VECTOR_SEARCH_SETUP.md)

**Vector Indexes:**
- `vector_index_products` - 768 dimensions, cosine similarity
- `vector_index_blogs` - 768 dimensions, cosine similarity
- `vector_index_categories` - 768 dimensions, cosine similarity

### **AI Models**
- **Embedding**: `text-embedding-004` (768 dimensions)
- **Generation**: `gemini-1.5-flash` (fast, cost-effective)

---

## 🗄️ Database Schema

### **Collections**

#### **users**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "customer" | "staff" | "admin",
  isActive: Boolean,
  isVerified: Boolean,
  cartData: Object,
  createdAt: Date
}
```

#### **products**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discount: Number,
  image: [String],
  category: String,
  subCategory: String,
  sizes: [String],
  bestseller: Boolean,
  embedding: [Number],  // 768-dim vector
  createdAt: Date
}
```

#### **orders**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{ productId, name, price, quantity, size }],
  amount: Number,
  address: Object,
  status: "Order Placed" | "Packing" | "Shipped" | "Delivered",
  paymentMethod: "COD" | "Stripe" | "VNPay",
  payment: Boolean,
  createdAt: Date
}
```

#### **blogs**
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  category: String,
  author: String,
  image: String,
  isPublished: Boolean,
  embedding: [Number],  // 768-dim vector
  createdAt: Date
}
```

---

## 📊 Chức Năng Admin

### **Dashboard**
- Tổng quan doanh thu
- Biểu đồ bán hàng theo thời gian
- Top sản phẩm bán chạy
- Đơn hàng gần đây

### **Quản Lý Sản Phẩm**
- Thêm sản phẩm mới với upload ảnh Cloudinary
- Chỉnh sửa thông tin sản phẩm
- Xóa sản phẩm
- Quản lý categories, sizes, bestseller

### **Quản Lý Đơn Hàng**
- Xem tất cả đơn hàng
- Filter theo trạng thái
- Cập nhật trạng thái đơn hàng
- Xem chi tiết đơn hàng

### **Quản Lý Blog**
- Tạo blog mới với editor
- Upload featured image
- Publish/Draft status
- Categories cho blog

### **Báo Cáo**
- Doanh thu theo ngày/tháng/năm
- Top khách hàng
- Sản phẩm bán chạy
- Export CSV

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **HTTP-only Cookies** - Prevent XSS attacks
- **Password Hashing** - Bcrypt với salt
- **CORS Protection** - Whitelist domains
- **Input Validation** - Pydantic models
- **SQL Injection Prevention** - MongoDB queries
- **Rate Limiting** - Prevent abuse
- **Secure Payment** - PCI-compliant gateways

---

## 🚢 Deployment

### **Backend (FastAPI)**
```bash
# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000

# Với Gunicorn (recommended)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### **Frontend (React)**
```bash
# Build production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel/Netlify
vercel deploy --prod
```

### **Environment Variables**
- Sử dụng `.env` cho development
- Sử dụng environment variables trên server cho production
- **Không commit .env vào Git**

---

## 📚 Tài Liệu Tham Khảo

### **Backend Documentation**
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Motor](https://motor.readthedocs.io/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Stripe API](https://stripe.com/docs/api)
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/)

### **Frontend Documentation**
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

### **AI & RAG**
- [RAG Explained](https://www.promptingguide.ai/techniques/rag)
- [MongoDB Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/)
- [Text Embeddings](https://ai.google.dev/docs/embeddings_guide)

---

## 🤝 Contributing

Nếu bạn muốn đóng góp cho dự án:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 📞 Liên Hệ

Nếu có câu hỏi hoặc góp ý về dự án, vui lòng liên hệ qua:

- **GitHub Issues**: [Create an issue](https://github.com/Yui-Mika/Clothing-website/issues)
- **Email**: support@veloura.com

---

## 🎉 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Google Gemini](https://ai.google.dev/) - AI models
- [Cloudinary](https://cloudinary.com/) - Media management
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

<div align="center">

**Được xây dựng với ❤️ bởi Nhóm Veloura**

⭐ Star project này nếu bạn thấy hữu ích!

</div>
