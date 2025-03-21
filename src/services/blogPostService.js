import axiosClient from '../utils/apiCaller';

const blogPostService = {
  // Get all blog posts with pagination
  getAllBlogPosts: async (page = 0, size = 20) => {
    try {
      return await axiosClient.get('/blog-posts', {
        params: { page, size }
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get a single blog post by ID
  getBlogPostById: async (id) => {
    try {
      return await axiosClient.get(`/blog-posts/${id}`);
    } catch (error) {
      console.error(`Error fetching blog post with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new blog post
  createBlogPost: async (blogData) => {
    try {
      // Ensure nameTags is correctly formatted
      const processedData = {
        ...blogData,
        nameTags: blogData.nameTags || []
      };
      
      console.log('Creating blog post with data:', processedData);
      return await axiosClient.post('/blog-posts', processedData);
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Update an existing blog post
  updateBlogPost: async (id, blogData) => {
    try {
      // Ensure nameTags is correctly formatted
      const processedData = {
        ...blogData,
        nameTags: blogData.nameTags || []
      };
      
      console.log('Updating blog post with data:', processedData);
      return await axiosClient.put(`/blog-posts/${id}`, processedData);
    } catch (error) {
      console.error(`Error updating blog post with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a blog post
  deleteBlogPost: async (id) => {
    try {
      return await axiosClient.delete(`/blog-posts/${id}`);
    } catch (error) {
      console.error(`Error deleting blog post with id ${id}:`, error);
      throw error;
    }
  },

  // Toggle visibility of a blog post
  toggleBlogPostVisibility: async (id, isVisible) => {
    try {
      // Get the current blog post to preserve other fields
      const response = await axiosClient.get(`/blog-posts/${id}`);
      const currentPost = response.data;
      
      // Update only the isVisible field
      return await axiosClient.put(`/blog-posts/${id}`, {
        ...currentPost,
        isVisible
      });
    } catch (error) {
      console.error(`Error toggling visibility for blog post with id ${id}:`, error);
      throw error;
    }
  },

  // Get all tags
  getAllTags: async () => {
    try {
      return await axiosClient.get('/tags');
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }
};

export default blogPostService;