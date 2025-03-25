import { useState, useEffect } from 'react'
import axiosClient from '../../../utils/apiCaller'
import { 
  Table, 
  Button, 
  message, 
  Tag, 
  Input,
  Space, 
  Modal,
  Avatar,
  Descriptions,
  Typography,
  Tooltip,
  Popconfirm,
  Form,
  Select,
  DatePicker,
  Switch
} from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined, 
  LockOutlined, 
  UnlockOutlined,
  UserDeleteOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons'
import moment from 'moment'

const { Title } = Typography;
const { Option } = Select;

function Member() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [searchText, setSearchText] = useState('')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [bloodTypes] = useState([
    'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 
    'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'
  ])
  const [countries] = useState([
    'American', 'British', 'Chinese', 'French', 'German', 
    'Italian', 'Japanese', 'Spanish', 'Australian', 'Canadian', 'AX'
  ])

  // Fetch users
  const fetchUsers = async (page = 0, size = 10, sortField = 'id', sortOrder = 'desc') => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosClient.get('/users', {
        params: { 
          page, 
          size,
          sort: `${sortField},${sortOrder}`,
          search: searchText || undefined
        }
      })
      setUsers(response.data.content)
      setPagination({
        current: response.data.pageable.pageNumber + 1,
        pageSize: response.data.pageable.pageSize,
        total: response.data.totalElements
      })
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
      message.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRetry = () => {
    fetchUsers()
  }

  const handleTableChange = (pagination, filters, sorter) => {
    // Convert ant design sorter to backend sort parameters
    let sortField = 'id'; // default sort field
    let sortOrder = 'desc'; // default sort order
    
    if (sorter && sorter.field) {
      sortField = sorter.field;
      sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    
    fetchUsers(pagination.current - 1, pagination.pageSize, sortField, sortOrder);
  }

  const handleSearch = () => {
    fetchUsers(0, pagination.pageSize); // Reset to first page when searching
  }

  const showUserDetails = (user) => {
    setCurrentUser(user)
    setDetailModalVisible(true)
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    setLoading(true)
    try {
      await axiosClient.patch(`/users/${userId}/status`, { enabled: !currentStatus })
      message.success(`User ${currentStatus ? 'disabled' : 'enabled'} successfully`)
      fetchUsers(pagination.current - 1, pagination.pageSize)
    } catch (err) {
      console.error('Error updating user status:', err)
      message.error('Failed to update user status')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    setLoading(true)
    try {
      await axiosClient.delete(`/users/${userId}`)
      message.success('User deleted successfully')
      fetchUsers(pagination.current - 1, pagination.pageSize)
    } catch (err) {
      console.error('Error deleting user:', err)
      message.error('Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    form.resetFields()
    form.setFieldsValue({
      enabled: true,
      verified: false
    })
    setIsCreateModalVisible(true)
  }

  const openEditModal = (user) => {
    setCurrentUser(user)
    editForm.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      role: user.role,
      gender: user.gender === null ? null : user.gender === true ? 'male' : 'female',
      dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
      bloodType: user.bloodType || null,
      nationality: user.nationality || null,
      symptoms: user.symptoms || null,
      verified: user.verified,
      enabled: user.enabled
    })
    setIsEditModalVisible(true)
  }

  const handleCreateSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // Transform gender from string to boolean
      if (values.gender === 'male') {
        values.gender = true
      } else if (values.gender === 'female') {
        values.gender = false
      } else {
        values.gender = null
      }
      
      // Format date
      if (values.dateOfBirth) {
        values.dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD')
      }

      await axiosClient.post('/users', values)
      setIsCreateModalVisible(false)
      message.success('User created successfully')
      form.resetFields()
      fetchUsers(pagination.current - 1, pagination.pageSize)
    } catch (err) {
      console.error('Error creating user:', err)
      if (err.response?.data?.message) {
        message.error(err.response.data.message)
      } else {
        message.error('Failed to create user')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields()
      setLoading(true)
      
      // Transform gender from string to boolean
      if (values.gender === 'male') {
        values.gender = true
      } else if (values.gender === 'female') {
        values.gender = false
      } else {
        values.gender = null
      }

      // Format date
      if (values.dateOfBirth) {
        values.dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD')
      }

      await axiosClient.put(`/users/${currentUser.id}`, values)
      setIsEditModalVisible(false)
      message.success('User updated successfully')
      fetchUsers(pagination.current - 1, pagination.pageSize)
    } catch (err) {
      console.error('Error updating user:', err)
      if (err.response?.data?.message) {
        message.error(err.response.data.message)
      } else {
        message.error('Failed to update user')
      }
    } finally {
      setLoading(false)
    }
  }

  // Format the date of birth
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('MMM DD, YYYY');
  };

  // Format the blood type for display
  const formatBloodType = (bloodType) => {
    if (!bloodType) return 'N/A';
    return bloodType.replace('_', ' ');
  };

  // Get role color for tags
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'red';
      case 'member': return 'blue';
      case 'user': return 'green';
      default: return 'default';
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      width: 70,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      width: 80,
      render: (avatarUrl) => (
        <Avatar src={avatarUrl} size="large">
          {!avatarUrl && 'User'}
        </Avatar>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      render: (role) => <Tag color={getRoleColor(role)}>{role?.toUpperCase()}</Tag>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'enabled',
      sorter: true,
      render: (enabled, record) => (
        <Space>
          <Tag color={enabled ? 'green' : 'red'}>
            {enabled ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
          <Tag color={record.verified ? 'blue' : 'orange'}>
            {record.verified ? 'VERIFIED' : 'UNVERIFIED'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => showUserDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title={record.enabled ? "Disable User" : "Enable User"}>
            <Popconfirm
              title={`Are you sure you want to ${record.enabled ? 'disable' : 'enable'} this user?`}
              onConfirm={() => handleToggleUserStatus(record.id, record.enabled)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                icon={record.enabled ? <LockOutlined /> : <UnlockOutlined />}
                danger={record.enabled}
                type={record.enabled ? "default" : "primary"}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                icon={<UserDeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <Title level={2}>User Management</Title>
        <Space>
          {error && (
            <Button
              type="primary"
              danger
              onClick={handleRetry}
            >
              Retry
            </Button>
          )}
          <Input
            placeholder="Search users..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250 }}
            suffix={
              <SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />
            }
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            className='update-button-subscription'
          >
            Create User
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        sortDirections={['ascend', 'descend', 'ascend']}
        showSorterTooltip={{ title: 'Click to sort' }}
      />

      {/* User Detail Modal */}
      <Modal
        title="User Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {currentUser && (
          <>
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <Avatar src={currentUser.avatarUrl} size={100}>
                {!currentUser.avatarUrl && currentUser.fullName?.charAt(0)}
              </Avatar>
              <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>
                {currentUser.fullName}
              </Title>
              <Tag color={getRoleColor(currentUser.role)} style={{ margin: '10px 0' }}>
                {currentUser.role?.toUpperCase()}
              </Tag>
            </div>
            
            <Descriptions bordered column={2}>
              <Descriptions.Item label="User ID">{currentUser.id}</Descriptions.Item>
              <Descriptions.Item label="Username">{currentUser.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{currentUser.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{currentUser.phoneNumber || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  <Tag color={currentUser.enabled ? 'green' : 'red'}>
                    {currentUser.enabled ? 'ACTIVE' : 'INACTIVE'}
                  </Tag>
                  <Tag color={currentUser.verified ? 'blue' : 'orange'}>
                    {currentUser.verified ? 'VERIFIED' : 'UNVERIFIED'}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {formatDate(currentUser.dateOfBirth)}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {currentUser.gender === true ? 'Male' : 
                 currentUser.gender === false ? 'Female' : 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Blood Type">
                {formatBloodType(currentUser.bloodType)}
              </Descriptions.Item>
              <Descriptions.Item label="Nationality">
                {currentUser.nationality || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Symptoms" span={2}>
                {currentUser.symptoms || 'None reported'}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {formatDate(currentUser.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {formatDate(currentUser.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        open={isCreateModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setIsCreateModalVisible(false)}
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter user full name' }]}
          >
            <Input placeholder="Enter user full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter user email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters long' }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
              style={{ width: '100%' }}
            >
              <Select placeholder="Select user role">
                <Option value="admin">Admin</Option>
                <Option value="member">Member</Option>
                <Option value="user">User</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="gender"
              label="Gender"
              style={{ width: '100%' }}
            >
              <Select placeholder="Select gender" allowClear>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              style={{ width: '100%' }}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              style={{ width: '100%' }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              name="bloodType"
              label="Blood Type"
              style={{ width: '100%' }}
            >
              <Select placeholder="Select blood type" allowClear>
                {bloodTypes.map(type => (
                  <Option key={type} value={type}>
                    {formatBloodType(type)}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="nationality"
              label="Nationality"
              style={{ width: '100%' }}
            >
              <Select placeholder="Select nationality" allowClear showSearch>
                {countries.map(country => (
                  <Option key={country} value={country}>{country}</Option>
                ))}
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            name="symptoms"
            label="Symptoms"
          >
            <Input.TextArea placeholder="Enter symptoms" />
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              name="verified"
              label="Verified"
              valuePropName="checked"
              style={{ width: '100%' }}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="enabled"
              label="Enabled"
              valuePropName="checked"
              initialValue={true}
              style={{ width: '100%' }}
            >
              <Switch />
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={loading}
        width={700}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter user full name' }]}
          >
            <Input placeholder="Enter user full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter user email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
              style={{ width: '100%' }}
            >
              <Select placeholder="Select user role">
                <Option value="admin">Admin</Option>
                <Option value="member">Member</Option>
                <Option value="user">User</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="gender"
              label="Gender"
              style={{ width: '100%' }}
            >
              <Select placeholder="Select gender" allowClear>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              style={{ width: '100%' }}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              style={{ width: '100%' }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              name="bloodType"
              label="Blood Type"
              style={{ width: '100%' }}
            >
              <Select placeholder="Select blood type" allowClear>
                {bloodTypes.map(type => (
                  <Option key={type} value={type}>
                    {formatBloodType(type)}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="nationality"
              label="Nationality"
              style={{ width: '100%' }}
            >
              <Select placeholder="Select nationality" allowClear showSearch>
                {countries.map(country => (
                  <Option key={country} value={country}>{country}</Option>
                ))}
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            name="symptoms"
            label="Symptoms"
          >
            <Input.TextArea placeholder="Enter symptoms" />
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item
              name="verified"
              label="Verified"
              valuePropName="checked"
              style={{ width: '100%' }}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="enabled"
              label="Enabled"
              valuePropName="checked"
              style={{ width: '100%' }}
            >
              <Switch />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}

export default Member;