import React from 'react';
import { Table, Tag, Space, Button, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { IBlogPost } from '../../types/blog';

interface BlogTableProps {
  blogs: IBlogPost[];
  totalElements: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (blog: IBlogPost) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, isVisible: boolean) => void;
  onView: (blog: IBlogPost) => void; 
}

const BlogTable: React.FC<BlogTableProps> = ({
  blogs,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  onToggleVisibility,
  onView, // Thêm prop onView
}) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      align: 'center' as const,
    },
    {
      title: 'Title',
      dataIndex: 'heading',
      key: 'heading',
      render: (text: string) => (
        <div style={{ 
          maxWidth: 200, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap' 
        }}>
          {text}
        </div>
      )
    },
    // {
    //   title: 'Author',
    //   dataIndex: ['userDto', 'fullName'],
    //   key: 'author',
    //   width: 150,
    // },
    // {
    //   title: 'Tags',
    //   dataIndex: 'nameTags',
    //   key: 'tags',
    //   render: (tags: string[]) => (
    //     <div style={{ 
    //       maxWidth: 200, 
    //       overflow: 'hidden', 
    //       textOverflow: 'ellipsis', 
    //       whiteSpace: 'nowrap' 
    //     }}>
    //       {tags && tags.map(tag => (
    //         <Tag key={tag} color="processing" style={{ margin: 2 }}>
    //           {tag}
    //         </Tag>
    //       ))}
    //     </div>
    //   ),
    // },
    {
      title: 'Status',
      dataIndex: 'isVisible',
      key: 'status',
      width: 100,
      render: (isVisible: boolean) => (
        <Tag color={isVisible ? 'success' : 'default'}>
          {isVisible ? 'Visible' : 'Hidden'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200, // Tăng độ rộng để chứa thêm nút
      align: 'center' as const,
      render: (_, record: IBlogPost) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
            title="View"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            title="Edit"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
            title="Delete"
          />
          <Switch
            checked={record.isVisible}
            onChange={(checked) => onToggleVisibility(record.id, checked)}
            title="Toggle Visibility"
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={blogs}
      rowKey="id"
      pagination={{
        total: totalElements,
        current: page + 1, // Adjust to match Ant Design's 1-based pagination
        pageSize: rowsPerPage,
        onChange: (newPage, newPageSize) => onPageChange(newPage - 1, newPageSize || rowsPerPage),
        //showSizeChanger: true,
        //pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: 800 }} // Enable horizontal scrolling for responsiveness
    />
  );
};

export default BlogTable;