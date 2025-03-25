import React from 'react';
import { Modal, Typography } from 'antd';
import { weeklyBlogs } from '../WeeklyBlogData';

const { Title, Paragraph } = Typography;

const BlogModal = ({ week, open, onClose }) => {
  // Find the blog data for the current week
  const blogData = weeklyBlogs.find(blog => blog.week === week) || {
    week: week,
    title: `Week ${week}`,
    content: "Information for this week will be coming soon. Stay tuned!"
  };

  return (
    <Modal
      title={`Week ${week}: ${blogData.title}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Typography>
        <Title level={4}>{blogData.title}</Title>
        <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
          {blogData.content}
        </Paragraph>

        <div style={{ marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
          <Paragraph type="secondary">
            <strong>Remember:</strong> Every pregnancy is unique. Always consult with your
            healthcare provider about any concerns or questions specific to your situation.
          </Paragraph>
        </div>
      </Typography>
    </Modal>
  );
};

export default BlogModal;
