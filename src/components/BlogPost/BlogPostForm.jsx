import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Switch, 
  // Select,
  message,
  Upload,
  Space
} from 'antd';
import { 
  PlusOutlined, 
  LoadingOutlined 
} from '@ant-design/icons';
import PropTypes from 'prop-types';
// import blogPostService from '../../services/blogPostService';

// const { Option } = Select;
const { TextArea } = Input;

const BlogPostForm = ({ 
  initialValues, 
  onSubmit, 
  mode 
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // State for dynamic tags
  // const [tagOptions, setTagOptions] = useState([]);
  // const [tagsLoading, setTagsLoading] = useState(false);

  // Fetch tags when component mounts
  // useEffect(() => {
  //   const fetchTags = async () => {
  //     // setTagsLoading(true);
  //     try {
  //       const response = await blogPostService.getAllTags();
  //       if (response && response.data) {
  //         // Extract tag names from the response
  //         const tags = response.data.map(tag => tag.name);
  //         // setTagOptions(tags);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching tags:', error);
  //       message.error('Failed to load tags');
  //     } finally {
  //       setTagsLoading(false);
  //     }
  //   };

  //   fetchTags();
  // }, []);

  // Set initial values when the form is loaded or edited
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        heading: initialValues.heading,
        pageTitle: initialValues.pageTitle,
        shortDescription: initialValues.shortDescription,
        content: initialValues.content,
        nameTags: initialValues.nameTags || [],
        isVisible: initialValues.isVisible !== undefined ? initialValues.isVisible : true,
        featuredImageUrl: initialValues.featuredImageUrl,
      });
      setImageUrl(initialValues.featuredImageUrl || '');
    } else {
      form.resetFields();
      setImageUrl('');
    }
  }, [initialValues, form]);

  // Function to validate image URL
  const validateImageUrl = (_, value) => {
    if (!value && !imageUrl) {
      return Promise.reject('Please enter an image URL or upload an image');
    }
    
    if (value) {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
      if (!urlPattern.test(value)) {
        return Promise.reject('Please enter a valid image URL');
      }
    }
    
    return Promise.resolve();
  };

  // Function to handle image file upload
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    
    return isImage && isLt2M;
  };

  // Custom request function to handle Cloudinary upload
  const customUpload = async ({ file, onSuccess, onError }) => {
    setImageLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'pregnancy_tracking'); // Your Cloudinary preset
    
    try {
      const cloudApiUrl = 'https://api.cloudinary.com/v1_1/dsquusdck/image/upload'; 
      
      const response = await fetch(cloudApiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      const data = await response.json();
      setImageUrl(data.secure_url);
      form.setFieldsValue({ featuredImageUrl: data.secure_url });
      onSuccess(data);
      setImageLoading(false);
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      onError({ event: error });
      setImageLoading(false);
      message.error('Failed to upload image. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    
    try {
      // Make sure featuredImageUrl is set if we uploaded an image
      const blogData = {
        ...values,
        featuredImageUrl: imageUrl || values.featuredImageUrl,
      };

      // If we're updating a blog post, include the ID
      if (mode === 'update' && initialValues) {
        blogData.id = initialValues.id;
      }

      // Call the onSubmit function passed from the parent component
      await onSubmit(blogData);
      
      // Reset form if we're creating a new post
      if (mode === 'create') {
        form.resetFields();
        setImageUrl('');
      }
      
      message.success(`Blog post ${mode === 'create' ? 'created' : 'updated'} successfully!`);
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Server Error: ${error.response.data.message}`);
      } else {
        message.error(`Failed to ${mode} the blog post. Please try again.`);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        isVisible: true,
        nameTags: [],
      }}
    >
      <Form.Item
        name="heading"
        label="Blog Title"
        rules={[{ 
          required: true, 
          message: 'Please enter a title for the blog post' 
        }]}
      >
        <Input placeholder="Enter blog title" />
      </Form.Item>

      <Form.Item
        name="pageTitle"
        label="Page Title (SEO)"
        rules={[{ 
          required: true, 
          message: 'Please enter a page title for SEO' 
        }]}
      >
        <Input placeholder="Enter page title for SEO" />
      </Form.Item>

      <Form.Item
        name="shortDescription"
        label="Short Description"
        rules={[{ 
          required: true, 
          message: 'Please enter a short description' 
        }]}
      >
        <TextArea 
          placeholder="Enter a brief description of the blog post" 
          rows={3} 
        />
      </Form.Item>

      <Form.Item
        name="content"
        label="Content"
        rules={[{ 
          required: true, 
          message: 'Please enter blog content' 
        }]}
      >
        <TextArea 
          placeholder="Write your blog post content here..." 
          rows={10} 
          style={{ minHeight: '250px' }}
        />
      </Form.Item>

      {/* <Form.Item
        name="nameTags"
        label="Tags"
        rules={[{ 
          required: true, 
          message: 'Please select at least one tag' 
        }]}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select tags for the blog post"
          loading={tagsLoading}
        >
          {tagOptions.map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Select>
      </Form.Item> */}

      <Form.Item
        name="featuredImageUrl"
        label="Featured Image URL"
        rules={[
          { 
            required: true, 
            message: 'Please enter an image URL or upload an image' 
          },
          { 
            validator: validateImageUrl
          }
        ]}
      >
        <Input 
          placeholder="Enter image URL (https://example.com/image.jpg) or upload an image" 
          onChange={(e) => {
            const newUrl = e.target.value;
            form.setFieldsValue({ featuredImageUrl: newUrl });
            setImageUrl(newUrl);
          }}
        />
      </Form.Item>

      <Form.Item label="Upload Image">
        <Upload
          name="featuredImage"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={customUpload}
          beforeUpload={beforeUpload}
        >
          {imageLoading ? (
            <div>
              <LoadingOutlined />
              <div style={{ marginTop: 8 }}>Uploading...</div>
            </div>
          ) : imageUrl ? (
            <div>
              <img 
                src={imageUrl} 
                alt="Featured" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} 
              />
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
        <div style={{ marginTop: 8 }}>
          <small>Click the button above to upload an image (max: 2MB)</small>
        </div>
      </Form.Item>

      {imageUrl && (
        <Form.Item label="Image Preview">
          <img 
            src={imageUrl} 
            alt="Featured" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              objectFit: 'contain' 
            }} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Crect fill='%23f0f0f0' width='300' height='150'/%3E%3Ctext fill='%23999999' font-family='Arial' font-size='14' x='50%' y='50%' text-anchor='middle'%3EImage not found or invalid URL%3C/text%3E%3C/svg%3E";
              message.error('Unable to load image. Please check the URL.');
            }}
          />
        </Form.Item>
      )}

      <Form.Item 
        name="isVisible" 
        label="Visibility" 
        valuePropName="checked"
      >
        <Switch 
          checkedChildren="Visible" 
          unCheckedChildren="Hidden" 
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={submitLoading}
          >
            {mode === 'create' ? 'Create Blog Post' : 'Update Blog Post'}
          </Button>
          <Button 
            onClick={() => {
              form.resetFields();
              setImageUrl('');
            }}
            disabled={submitLoading}
          >
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

BlogPostForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    heading: PropTypes.string,
    pageTitle: PropTypes.string,
    shortDescription: PropTypes.string,
    content: PropTypes.string,
    nameTags: PropTypes.arrayOf(PropTypes.string),
    isVisible: PropTypes.bool,
    featuredImageUrl: PropTypes.string,
    userDto: PropTypes.object,
  }),
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'update']).isRequired,
};

export default BlogPostForm;