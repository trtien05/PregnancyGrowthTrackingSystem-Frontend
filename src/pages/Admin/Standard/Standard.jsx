import  { useState, useEffect } from 'react'
import axiosClient from '../../../utils/apiCaller'
import { Table, Button, Modal, Form, InputNumber, message, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function Standard() {
  const [standards, setStandards] = useState([])
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentStandard, setCurrentStandard] = useState(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  })

  // Fetch standards
  const fetchStandards = async (page = 0, size = 20, sortField = 'id', sortOrder = 'desc') => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosClient.get('/standards', {
        params: { 
          page, 
          size,
          sort: `${sortField},${sortOrder}`
        }
      })
      setStandards(response.data.content)
      setPagination({
        current: response.data.pageable.pageNumber + 1,
        pageSize: response.data.pageable.pageSize,
        total: response.data.totalElements
      })
    } catch (err) {
      console.error('Error fetching standards:', err)
      setError('Failed to load standards')
      message.error('Failed to load standards')
    } finally {
      setLoading(false)
    }
  }

  // Fetch metrics for dropdown
  const fetchMetrics = async () => {
    try {
      const response = await axiosClient.get('/metrics')
      setMetrics(response.data.content)
    } catch (err) {
      console.error('Error fetching metrics:', err)
      message.error('Failed to load metrics')
    }
  }

  useEffect(() => {
    fetchStandards()
    fetchMetrics()
  }, [])

  const handleRetry = () => {
    fetchStandards()
  }

  const handleTableChange = (pagination, filters, sorter) => {
    // Convert ant design sorter to backend sort parameters
    let sortField = 'id'; // default sort field
    let sortOrder = 'desc'; // default sort order
    
    if (sorter && sorter.field) {
      sortField = sorter.field;
      // Handle nested fields like 'metric.name'
      if (Array.isArray(sorter.field)) {
        sortField = sorter.field.join('.');
      }
      sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    
    fetchStandards(pagination.current - 1, pagination.pageSize, sortField, sortOrder);
  }

  // Modal handlers
  const openCreateModal = () => {
    form.resetFields()
    setIsCreateModalVisible(true)
  }

  const openEditModal = (record) => {
    setCurrentStandard(record)
    form.setFieldsValue({
      metricId: record.metricId,
      week: record.week,
      min: record.min,
      max: record.max
    })
    setIsEditModalVisible(true)
  }

  const handleCreateSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // Validate min is less than max
      if (values.min >= values.max) {
        message.error('Minimum value must be less than maximum value')
        setLoading(false)
        return
      }
      
      await axiosClient.post('/standards', values)
      setIsCreateModalVisible(false)
      message.success('Standard created successfully')
      fetchStandards()
    } catch (err) {
      console.error('Error creating standard:', err)
      message.error('Failed to create standard')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // Validate min is less than max
      if (values.min >= values.max) {
        message.error('Minimum value must be less than maximum value')
        setLoading(false)
        return
      }
      
      await axiosClient.put(`/standards/${currentStandard.id}`, values)
      setIsEditModalVisible(false)
      message.success('Standard updated successfully')
      fetchStandards()
    } catch (err) {
      console.error('Error updating standard:', err)
      message.error('Failed to update standard')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await axiosClient.delete(`/standards/${id}`)
      message.success('Standard deleted successfully')
      fetchStandards()
    } catch (err) {
      console.error('Error deleting standard:', err)
      message.error('Failed to delete standard')
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
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Metric Name',
      dataIndex: ['metric', 'name'],
      key: 'metricName',
      sorter: true,
    },
    {
      title: 'Week',
      dataIndex: 'week',
      key: 'week',
      sorter: true,
    },
    {
      title: 'Min Value',
      dataIndex: 'min',
      key: 'min',
      render: (value, record) => `${value} ${record.metric.unit}`,
      sorter: true,
    },
    {
      title: 'Max Value',
      dataIndex: 'max',
      key: 'max',
      render: (value, record) => `${value} ${record.metric.unit}`,
      sorter: true,
    },
    {
      title: 'Unit',
      dataIndex: ['metric', 'unit'],
      key: 'unit',
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
            title="Are you sure you want to delete this standard?"
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
        <h1>Growth Standards Management</h1>
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
            Create New Standard
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={standards}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        sortDirections={['ascend', 'descend', 'ascend']}
        showSorterTooltip={{ title: 'Click to sort' }}
      />

      {/* Create Modal */}
      <Modal
        title="Create New Standard"
        open={isCreateModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setIsCreateModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="metricId"
            label="Growth Metric"
            rules={[{ required: true, message: 'Please select a metric' }]}
          >
            <Select placeholder="Select a growth metric">
              {metrics.map(metric => (
                <Select.Option key={metric.metricId} value={metric.metricId}>
                  {metric.metricName} ({metric.unit})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="week"
            label="Week"
            rules={[
              { required: true, message: 'Please enter week number' },
              { type: 'number', min: 1, max: 41, message: 'Week must be between 1 and 41' }
            ]}
          >
            <InputNumber 
              min={1} 
              max={41} 
              style={{ width: '100%' }} 
              placeholder="Enter pregnancy week (1-41)"
              formatter={value => `${value}`}
              parser={value => value ? Number(value) : 1}
            />
          </Form.Item>
          <Form.Item
            name="min"
            label="Minimum Value"
            rules={[
              { required: true, message: 'Please enter minimum value' },
              { type: 'number', message: 'Please enter a valid number' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter minimum value"
              step={0.1}
              precision={2}
            />
          </Form.Item>
          <Form.Item
            name="max"
            label="Maximum Value"
            rules={[
              { required: true, message: 'Please enter maximum value' },
              { type: 'number', message: 'Please enter a valid number' }
            ]}
            tooltip="Maximum value must be greater than minimum value"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter maximum value"
              step={0.1}
              precision={2}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Standard"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="metricId"
            label="Growth Metric"
            rules={[{ required: true, message: 'Please select a metric' }]}
          >
            <Select placeholder="Select a growth metric">
              {metrics.map(metric => (
                <Select.Option key={metric.metricId} value={metric.metricId}>
                  {metric.metricName} ({metric.unit})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="week"
            label="Week"
            rules={[
              { required: true, message: 'Please enter week number' },
              { type: 'number', min: 1, max: 41, message: 'Week must be between 1 and 41' }
            ]}
          >
            <InputNumber 
              min={1} 
              max={41} 
              style={{ width: '100%' }} 
              placeholder="Enter pregnancy week (1-41)" 
              formatter={value => `${value}`}
              parser={value => value ? Number(value) : 1}
            />
          </Form.Item>
          <Form.Item
            name="min"
            label="Minimum Value"
            rules={[
              { required: true, message: 'Please enter minimum value' },
              { type: 'number', message: 'Please enter a valid number' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter minimum value"
              step={0.1}
              precision={2}
            />
          </Form.Item>
          <Form.Item
            name="max"
            label="Maximum Value"
            rules={[
              { required: true, message: 'Please enter maximum value' },
              { type: 'number', message: 'Please enter a valid number' }
            ]}
            tooltip="Maximum value must be greater than minimum value"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter maximum value"
              step={0.1}
              precision={2}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Standard