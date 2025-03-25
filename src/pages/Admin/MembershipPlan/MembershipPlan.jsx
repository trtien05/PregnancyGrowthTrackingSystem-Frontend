import  { useState, useEffect } from 'react'
import axiosClient from '../../../utils/apiCaller'
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function MembershipPlan() {
  const [membershipPlans, setMembershipPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  })

  // Fetch membership plans
  const fetchMembershipPlans = async (page = 0, size = 20) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosClient.get('/membership-plans', {
        params: { page, size }
      })
      setMembershipPlans(response.data.content)
      setPagination({
        current: response.data.pageable.pageNumber + 1,
        pageSize: response.data.pageable.pageSize,
        total: response.data.totalElements
      })
    } catch (err) {
      console.error('Error fetching membership plans:', err)
      setError('Failed to load membership plans')
      message.error('Failed to load membership plans')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembershipPlans()
  }, [])

  const handleRetry = () => {
    fetchMembershipPlans()
  }

  const handleTableChange = (pagination) => {
    fetchMembershipPlans(pagination.current - 1, pagination.pageSize)
  }

  // Modal handlers
  const openCreateModal = () => {
    form.resetFields()
    setIsCreateModalVisible(true)
  }

  const openEditModal = (record) => {
    setCurrentPlan(record)
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      durationMonths: record.durationMonths,
      isActive: record.isActive
    })
    setIsEditModalVisible(true)
  }

  const handleCreateSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await axiosClient.post('/membership-plans', values)
      setIsCreateModalVisible(false)
      message.success('Membership plan created successfully')
      fetchMembershipPlans()
    } catch (err) {
      console.error('Error creating membership plan:', err)
      message.error('Failed to create membership plan')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await axiosClient.put(`/membership-plans/${currentPlan.id}`, values)
      setIsEditModalVisible(false)
      message.success('Membership plan updated successfully')
      fetchMembershipPlans()
    } catch (err) {
      console.error('Error updating membership plan:', err)
      message.error('Failed to update membership plan')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await axiosClient.delete(`/membership-plans/${id}`)
      message.success('Membership plan deleted successfully')
      fetchMembershipPlans()
    } catch (err) {
      console.error('Error deleting membership plan:', err)
      message.error('Failed to delete membership plan')
    } finally {
      setLoading(false)
    }
  }

  // Table columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price),
    },
    {
      title: 'Duration (Months)',
      dataIndex: 'durationMonths',
      key: 'durationMonths',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this membership plan?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <h1>MemberShip Plan Management</h1>
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
            className='update-button-subscription'

          >
            Create New MemberShip Plan
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={membershipPlans}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* Create Modal */}
      <Modal
        title="Create New Membership Plan"
        open={isCreateModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setIsCreateModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Plan Name"
            rules={[{ required: true, message: 'Please enter plan name' }]}
          >
            <Input placeholder="Enter plan name" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (VND)"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter price"
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="durationMonths"
            label="Duration (Months)"
            rules={[
              { required: true, message: 'Please enter duration' },
              { type: 'number', max: 12, message: 'Duration cannot exceed 12 months' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter duration in months"
              min={1}
              max={12}
            />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Membership Plan"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Plan Name"
            rules={[{ required: true, message: 'Please enter plan name' }]}
          >
            <Input placeholder="Enter plan name" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (VND)"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter price"
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="durationMonths"
            label="Duration (Months)"
            rules={[
              { required: true, message: 'Please enter duration' },
              { type: 'number', max: 12, message: 'Duration cannot exceed 12 months' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter duration in months"
              min={1}
              max={12}
            />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MembershipPlan