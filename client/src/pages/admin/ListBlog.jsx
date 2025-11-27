import React, { useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { ShopContext } from '../../context/ShopContext'
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

// Component hiển thị danh sách blogs (Admin & Staff)
const ListBlog = () => {
  const { axios } = useContext(ShopContext)
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, published, draft
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  // Fetch blogs từ API
  useEffect(() => {
    fetchBlogs()
  }, [])

  // Filter và search blogs
  useEffect(() => {
    let result = [...blogs]

    // Filter by published status
    if (filter === 'published') {
      result = result.filter(blog => blog.isPublished)
    } else if (filter === 'draft') {
      result = result.filter(blog => !blog.isPublished)
    }

    // Search by title, category, author
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query) ||
        blog.author.toLowerCase().includes(query)
      )
    }

    setFilteredBlogs(result)
  }, [blogs, filter, searchQuery])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      // Lấy tất cả blogs (cả published và draft) cho admin
      const { data } = await axios.get('/api/blog/list?published_only=false')
      if (data.success) {
        setBlogs(data.blogs)
        setFilteredBlogs(data.blogs)
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách blogs')
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Xóa blog
  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Bạn có chắc muốn xóa blog "${blogTitle}"?`)) {
      return
    }

    try {
      setDeleteLoading(blogId)
      const { data } = await axios.delete(`/api/blog/${blogId}`)
      if (data.success) {
        toast.success(data.message || 'Đã xóa blog thành công')
        // Remove from local state
        setBlogs(blogs.filter(blog => blog._id !== blogId))
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Lỗi khi xóa blog')
      console.error('Error deleting blog:', error)
    } finally {
      setDeleteLoading(null)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Truncate text
  const truncate = (text, length) => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  return (
    <div className='w-full px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold mb-1'>Quản lý Blogs</h1>
          <p className='text-gray-500 text-sm'>
            Tổng cộng {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/add-blog')}
          className='flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors'
        >
          <FaPlus />
          <span>Thêm Blog Mới</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className='flex flex-col sm:flex-row gap-4 mb-6'>
        
        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors'
        >
          <option value='all'>Tất cả ({blogs.length})</option>
          <option value='published'>
            Đã xuất bản ({blogs.filter(b => b.isPublished).length})
          </option>
          <option value='draft'>
            Bản nháp ({blogs.filter(b => !b.isPublished).length})
          </option>
        </select>

        {/* Search Bar */}
        <div className='flex-1 relative'>
          <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Tìm kiếm theo tiêu đề, danh mục, tác giả...'
            className='w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors'
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='text-center py-12'>
          <div className='inline-block w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin'></div>
          <p className='mt-4 text-gray-500'>Đang tải...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        /* Empty State */
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg mb-4'>
            {searchQuery || filter !== 'all' 
              ? 'Không tìm thấy blog nào phù hợp' 
              : 'Chưa có blog nào. Hãy thêm blog đầu tiên!'
            }
          </p>
          {!searchQuery && filter === 'all' && (
            <button
              onClick={() => navigate('/admin/add-blog')}
              className='inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors'
            >
              <FaPlus />
              <span>Thêm Blog Mới</span>
            </button>
          )}
        </div>
      ) : (
        /* Blog List */
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
          
          {/* Desktop Table View */}
          <div className='hidden lg:block overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='text-left px-6 py-4 text-sm font-semibold text-gray-700'>Ảnh</th>
                  <th className='text-left px-6 py-4 text-sm font-semibold text-gray-700'>Tiêu đề</th>
                  <th className='text-left px-6 py-4 text-sm font-semibold text-gray-700'>Danh mục</th>
                  <th className='text-left px-6 py-4 text-sm font-semibold text-gray-700'>Tác giả</th>
                  <th className='text-center px-6 py-4 text-sm font-semibold text-gray-700'>Trạng thái</th>
                  <th className='text-left px-6 py-4 text-sm font-semibold text-gray-700'>Ngày tạo</th>
                  <th className='text-center px-6 py-4 text-sm font-semibold text-gray-700'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className='hover:bg-gray-50 transition-colors'>
                    
                    {/* Image */}
                    <td className='px-6 py-4'>
                      <div className='w-20 h-14 rounded-lg overflow-hidden bg-gray-100'>
                        {blog.image ? (
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
                            No Image
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className='px-6 py-4'>
                      <p className='font-medium text-gray-900 max-w-xs'>
                        {truncate(blog.title, 60)}
                      </p>
                    </td>

                    {/* Category */}
                    <td className='px-6 py-4'>
                      <span className='inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full'>
                        {blog.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className='px-6 py-4 text-sm text-gray-600'>
                      {blog.author}
                    </td>

                    {/* Status */}
                    <td className='px-6 py-4 text-center'>
                      {blog.isPublished ? (
                        <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
                          <FaEye className='text-xs' />
                          Đã xuất bản
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full'>
                          <FaEyeSlash className='text-xs' />
                          Bản nháp
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className='px-6 py-4 text-sm text-gray-600'>
                      {formatDate(blog.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                          className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                          title='Sửa'
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={deleteLoading === blog._id}
                          className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50'
                          title='Xóa'
                        >
                          {deleteLoading === blog._id ? (
                            <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin'></div>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className='lg:hidden divide-y divide-gray-100'>
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className='p-4'>
                <div className='flex gap-4'>
                  
                  {/* Image */}
                  <div className='w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
                    {blog.image ? (
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium text-gray-900 mb-1 truncate'>
                      {blog.title}
                    </h3>
                    <div className='flex flex-wrap gap-2 mb-2'>
                      <span className='inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full'>
                        {blog.category}
                      </span>
                      {blog.isPublished ? (
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full'>
                          <FaEye />
                          Xuất bản
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full'>
                          <FaEyeSlash />
                          Nháp
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-gray-500 mb-2'>
                      {blog.author} • {formatDate(blog.createdAt)}
                    </p>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                        className='flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'
                      >
                        <FaEdit />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id, blog.title)}
                        disabled={deleteLoading === blog._id}
                        className='flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50'
                      >
                        {deleteLoading === blog._id ? (
                          <div className='w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                          <>
                            <FaTrash />
                            Xóa
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  )
}

export default ListBlog
