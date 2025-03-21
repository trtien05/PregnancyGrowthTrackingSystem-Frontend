
import { Typography, Divider, Tag, Image, Card, Space } from 'antd';
import PropTypes from 'prop-types';

const { Title, Text, Paragraph } = Typography;

const BlogPostDetail = ({ blog }) => {
  if (!blog) return null;

  return (
    <Card>
      <Title level={3}>{blog.heading}</Title>
      <Space style={{ marginBottom: 16 }}>
        {blog.nameTags && blog.nameTags.map(tag => (
          <Tag key={tag} color="processing">
            {tag}
          </Tag>
        ))}
      </Space>
      
      <Divider orientation="left">Page Title (SEO)</Divider>
      <Paragraph>{blog.pageTitle}</Paragraph>
      
      <Divider orientation="left">Short Description</Divider>
      <Paragraph>{blog.shortDescription}</Paragraph>
      
      {blog.featuredImageUrl && (
        <>
          <Divider orientation="left">Featured Image</Divider>
          <Image 
            src={blog.featuredImageUrl} 
            alt={blog.heading}
            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
          />
        </>
      )}
      
      <Divider orientation="left">Content</Divider>
      <div 
        dangerouslySetInnerHTML={{ __html: blog.content }} 
        style={{ 
          border: '1px solid #f0f0f0', 
          padding: 16, 
          borderRadius: 4,
          background: '#fafafa'
        }}
      />
      
      <Divider />
      
      <Space direction="vertical" size="small">
        <Text type="secondary">Visibility: {blog.isVisible ? 'Visible' : 'Hidden'}</Text>
        {blog.userDto && (
          <Text type="secondary">Author: {blog.userDto.fullName}</Text>
        )}
      </Space>
    </Card>
  );
};

BlogPostDetail.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number,
    heading: PropTypes.string,
    pageTitle: PropTypes.string,
    shortDescription: PropTypes.string,
    content: PropTypes.string,
    nameTags: PropTypes.arrayOf(PropTypes.string),
    isVisible: PropTypes.bool,
    featuredImageUrl: PropTypes.string,
    userDto: PropTypes.object,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

export default BlogPostDetail;