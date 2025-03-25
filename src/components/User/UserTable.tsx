import React from 'react';
import { Table, Tag, Space, Button, Switch } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const UserTable = ({
  users,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onEdit,
  onToggleStatus,
  onView,
  loading,
  togglingUsers
}) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      align: 'center',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => (
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
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
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
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : role === 'member' ? 'blue' : 'green'}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'status',
      width: 100,
      render: (enabled) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Verification',
      dataIndex: 'verified',
      key: 'verification',
      width: 120,
      render: (verified) => (
        <Tag color={verified ? 'success' : 'warning'}>
          {verified ? 'Verified' : 'Unverified'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record) => {
        const isToggling = togglingUsers && togglingUsers[record.id];
        
        return (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              title="View"
              disabled={isToggling}
            />
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              title="Edit"
              disabled={isToggling}
            />
            <Switch
              checked={record.enabled}
              onChange={(checked) => {
                console.log(`Switch clicked: changing from ${record.enabled} to ${checked}`);
                onToggleStatus(record.id, checked);
              }}
              loading={isToggling}
              disabled={loading || isToggling}
              title="Toggle Status"
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={loading}
      pagination={{
        total: totalElements,
        current: page + 1, // Adjust to match Ant Design's 1-based pagination
        pageSize: rowsPerPage,
        onChange: (newPage, newPageSize) => onPageChange(newPage - 1, newPageSize || rowsPerPage),
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: 800 }} // Enable horizontal scrolling for responsiveness
    />
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  totalElements: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  togglingUsers: PropTypes.object
};

export default UserTable;