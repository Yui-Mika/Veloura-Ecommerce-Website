import React, { useContext, useState, useEffect } from 'react'
import upload_icon from "../../assets/upload_icon.png"
import { toast } from 'react-hot-toast'
import { ShopContext } from '../../context/ShopContext'
import { FaTrash, FaChevronLeft } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'

// Component để thêm/sửa blog (Admin & Staff)
const AddBlog = () => {
  const { id } = useParams() // Lấy blog ID từ URL nếu đang edit
  const navigate = useNavigate()
  const { axios } = useContext(ShopContext)

  // Khai báo các state cho form
  const [image, setImage] = useState(null) // file ảnh được chọn
  const [imagePreview, setImagePreview] = useState(null) // preview URL
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Thời trang")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("Admin")
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)

  // Blog categories
  const categories = [
    "Thời trang",
    "Xu hướng",
    "Hướng dẫn",
    "Tin tức",
    "Phong cách"
  ]

  // Load blog data nếu đang edit
  useEffect(() => {
    if (id) {
      setIsEditMode(true)
      fetchBlogData()
    }
  }, [id])

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`)
      if (data.success) {
        const blog = data.blog
        setTitle(blog.title)
        setCategory(blog.category)
        setContent(blog.content)
        setAuthor(blog.author)
        setIsPublished(blog.isPublished)
        if (blog.image) {
          setImagePreview(blog.image)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Lỗi khi tải dữ liệu blog")
      navigate('/admin/blogs')
    }
  }

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB")
        return
      }

      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Xóa ảnh
  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề"
    } else if (title.trim().length < 20) {
      newErrors.title = "Tiêu đề phải có ít nhất 20 ký tự"
    } else if (title.trim().length > 200) {
      newErrors.title = "Tiêu đề không được vượt quá 200 ký tự"
    }

    if (!category) {
      newErrors.category = "Vui lòng chọn danh mục"
    }

    if (!content.trim()) {
      newErrors.content = "Vui lòng nhập nội dung"
    } else if (content.trim().length < 50) {
      newErrors.content = "Nội dung phải có ít nhất 50 ký tự"
    }

    if (!author.trim()) {
      newErrors.author = "Vui lòng nhập tên tác giả"
    }

    if (!isEditMode && !image) {
      newErrors.image = "Vui lòng chọn ảnh đại diện"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('category', category)
      formData.append('content', content.trim())
      formData.append('author', author.trim())
      
      if (image) {
        formData.append('image', image)
      }

      let response
      if (isEditMode) {
        // Update existing blog
        response = await axios.put(`/api/blog/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        // Create new blog
        response = await axios.post('/api/blog/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/admin/blogs')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error submitting blog:', error)
      toast.error(error.response?.data?.detail || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8'>
      {/* Header với nút quay lại */}
      <div className='flex items-center gap-4 mb-8'>
        <button
          onClick={() => navigate('/admin/blogs')}
          className='p-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-colors'
        >
          <FaChevronLeft />
        </button>
        <h1 className='text-3xl font-bold'>
          {isEditMode ? 'Sửa Blog' : 'Thêm Blog Mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-8'>
        
        {/* Left Column - Image Upload */}
        <div className='lg:w-1/3'>
          <div className='sticky top-8'>
            <label className='block text-sm font-medium mb-2'>
              Ảnh đại diện <span className='text-red-500'>*</span>
            </label>
            
            <div className='relative'>
              {imagePreview ? (
                <div className='relative aspect-video rounded-xl overflow-hidden border-2 border-gray-900 bg-gray-50 group'>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className='w-full h-full object-cover'
                  />
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='absolute top-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg'
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <label htmlFor='image' className='cursor-pointer'>
                  <div className='aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900 bg-gray-50 flex flex-col items-center justify-center transition-colors'>
                    <img src={upload_icon} alt="Upload" className='w-16 mb-3 opacity-50' />
                    <p className='text-sm text-gray-500'>Click để chọn ảnh</p>
                    <p className='text-xs text-gray-400 mt-1'>JPG, PNG, WEBP (max 5MB)</p>
                  </div>
                  <input
                    type='file'
                    id='image'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </label>
              )}
            </div>

            {errors.image && (
              <p className='text-red-500 text-sm mt-2'>{errors.image}</p>
            )}
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className='lg:w-2/3'>
          <div className='space-y-6'>
            
            {/* Title */}
            <div>
              <label htmlFor='title' className='block text-sm font-medium mb-2'>
                Tiêu đề <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Nhập tiêu đề blog (20-200 ký tự)'
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-900 transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.title && (
                <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                {title.length}/200 ký tự
              </p>
            </div>

            {/* Category & Author Row */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              
              {/* Category */}
              <div>
                <label htmlFor='category' className='block text-sm font-medium mb-2'>
                  Danh mục <span className='text-red-500'>*</span>
                </label>
                <select
                  id='category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-900 transition-colors ${
                    errors.category ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className='text-red-500 text-sm mt-1'>{errors.category}</p>
                )}
              </div>

              {/* Author */}
              <div>
                <label htmlFor='author' className='block text-sm font-medium mb-2'>
                  Tác giả <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='author'
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder='Nhập tên tác giả'
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-900 transition-colors ${
                    errors.author ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.author && (
                  <p className='text-red-500 text-sm mt-1'>{errors.author}</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor='content' className='block text-sm font-medium mb-2'>
                Nội dung <span className='text-red-500'>*</span>
              </label>
              <textarea
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Nhập nội dung blog (tối thiểu 50 ký tự)'
                rows={12}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-900 transition-colors resize-y ${
                  errors.content ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.content && (
                <p className='text-red-500 text-sm mt-1'>{errors.content}</p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                {content.length} ký tự (tối thiểu 50)
              </p>
            </div>

            {/* Published Status */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Trạng thái xuất bản
              </label>
              <div className='flex items-center gap-6'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    checked={isPublished === true}
                    onChange={() => setIsPublished(true)}
                    className='w-4 h-4 text-gray-900 focus:ring-gray-900'
                  />
                  <span className='text-sm'>Xuất bản</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    checked={isPublished === false}
                    onChange={() => setIsPublished(false)}
                    className='w-4 h-4 text-gray-900 focus:ring-gray-900'
                  />
                  <span className='text-sm'>Bản nháp</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className='flex gap-4 pt-4'>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật Blog' : 'Thêm Blog')}
              </button>
              <button
                type='button'
                onClick={() => navigate('/admin/blogs')}
                disabled={loading}
                className='px-6 py-3 border-2 border-gray-200 rounded-xl font-medium hover:border-gray-900 transition-colors disabled:opacity-50'
              >
                Hủy
              </button>
            </div>

          </div>
        </div>

      </form>
    </div>
  )
}

export default AddBlog
