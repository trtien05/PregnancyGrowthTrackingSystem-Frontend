import { useState, useEffect, useCallback } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BlogTable from '../../../components/BlogPost/BlogTable';
import BlogPostForm from '../../../components/BlogPost/BlogPostForm';
import BlogPostDetail from '../../../components/BlogPost/BlogPostDetail';
import blogPostService from '../../../services/blogPostService';

const BlogPostPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0); // Zero-indexed for API
  const [rowsPerPage, setRowsPerPage] = useState(20); // Changed from 10 to 20 to match backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  // Detail modal state
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailBlog, setDetailBlog] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await blogPostService.getAllBlogPosts(page, rowsPerPage);
      
      if (response && response.data) {
        setBlogs(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
      } else {
        setBlogs([]);
        setTotalElements(0);
        setError('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError(error.message || 'Failed to fetch blog posts');
      setBlogs([]);
      
      message.error(`Failed to fetch blog posts: ${error.response?.data?.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handlePageChange = (newPage, newPageSize) => {
    // newPage from BlogTable is already 0-indexed (converted in the table component)
    setPage(newPage);
    setRowsPerPage(newPageSize);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setModalMode('update');
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this blog post?',
      content: 'This action cannot be undone',
      onOk: async () => {
        try {
          await blogPostService.deleteBlogPost(id);
          message.success('Blog post deleted successfully');
          
          fetchBlogs();
        } catch (error) {
          message.error('Failed to delete blog post');
        }
      }
    });
  };

  const handleToggleVisibility = async (id, isVisible) => {
    try {
      await blogPostService.toggleBlogPostVisibility(id, isVisible);
      message.success('Blog post visibility updated');
      fetchBlogs();
    } catch (error) {
      message.error('Failed to update blog post visibility');
    }
  };

  const handleSubmit = async (blogData) => {
    try {
      if (modalMode === 'create') {
        await blogPostService.createBlogPost(blogData);
        message.success('Blog post created successfully');
      } else if (selectedBlog) {
        await blogPostService.updateBlogPost(selectedBlog.id, blogData);
        message.success('Blog post updated successfully');
      }
      
      // Close modal and refresh list
      setIsModalVisible(false);
      fetchBlogs();
    } catch (error) {
      message.error(`Failed to ${modalMode} blog post: ${error.message || 'Unknown error'}`);
    }
  };

  const openCreateModal = () => {
    setSelectedBlog(null);
    setModalMode('create');
    setIsModalVisible(true);
  };
  
  const handleView = (blog) => {
    setDetailBlog(blog);
    setIsDetailModalVisible(true);
  };

  // Add retry mechanism for server errors
  const handleRetry = () => {
    message.info('Retrying to fetch blog posts...');
    fetchBlogs();
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16 
      }}>
        <h1>Blog Posts Management</h1>
        <div>
          {error && (
            <Button 
              type="primary" 
              danger 
              onClick={handleRetry} 
              style={{ marginRight: 8 }}
            >
              Retry
            </Button>
          )}
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={openCreateModal}
          >
            Create New Blog Post
          </Button>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '16px', 
          background: '#fff1f0', 
          border: '1px solid #ffa39e',
          borderRadius: '2px'
        }}>
          Server Error: {error}. Please try again later or contact support.
        </div>
      )}

      <BlogTable 
        blogs={blogs}
        totalElements={totalElements}
        page={page} // Pass the 0-indexed page directly
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
        onView={handleView}
        loading={loading}
      />

      <Modal
        title={modalMode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <BlogPostForm 
          initialValues={selectedBlog || undefined}
          onSubmit={handleSubmit}
          mode={modalMode}
        />
      </Modal>
      
      <Modal
        title="Blog Post Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setIsDetailModalVisible(false);
              handleEdit(detailBlog);
            }}
          >
            Edit
          </Button>
        ]}
        width={800}
      >
        <BlogPostDetail blog={detailBlog} />
      </Modal>
    </div>
  );
};

export default BlogPostPage;