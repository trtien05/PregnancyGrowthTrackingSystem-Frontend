import React, { useState, useEffect } from 'react'
import axiosClient from '../../../utils/apiCaller'
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Spin } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function GrowthMetric() {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentMetric, setCurrentMetric] = useState(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  })

  // Fetch growth metrics
  const fetchMetrics = async (page = 0, size = 20) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosClient.get('/metrics', {
        params: { page, size }
      })
      setMetrics(response.data.content)
      setPagination({
        current: response.data.pageable.pageNumber + 1,
        pageSize: response.data.pageable.pageSize,
        total: response.data.totalElements
      })
    } catch (err) {
      console.error('Error fetching growth metrics:', err)
      setError('Failed to load growth metrics')
      message.error('Failed to load growth metrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  const handleRetry = () => {
    fetchMetrics()
  }

  const handleTableChange = (pagination) => {
    fetchMetrics(pagination.current - 1, pagination.pageSize)
  }

  // Modal handlers
  const openCreateModal = () => {
    form.resetFields()
    setIsCreateModalVisible(true)
  }

  const openEditModal = (record) => {
    setCurrentMetric(record)
    form.setFieldsValue({
      metricName: record.metricName,
      unit: record.unit,
      min: record.min,
      max: record.max
    })
    setIsEditModalVisible(true)
  }

  const handleCreateSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await axiosClient.post('/metrics', values)
      setIsCreateModalVisible(false)
      message.success('Growth metric created successfully')
      fetchMetrics()
    } catch (err) {
      console.error('Error creating growth metric:', err)
      message.error('Failed to create growth metric')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await axiosClient.put(`/metrics/${currentMetric.metricId}`, values)
      setIsEditModalVisible(false)
      message.success('Growth metric updated successfully')
      fetchMetrics()
    } catch (err) {
      console.error('Error updating growth metric:', err)
      message.error('Failed to update growth metric')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await axiosClient.delete(`/metrics/${id}`)
      message.success('Growth metric deleted successfully')
      fetchMetrics()
    } catch (err) {
      console.error('Error deleting growth metric:', err)
      message.error('Failed to delete growth metric')
    } finally {
      setLoading(false)
    }
  }

  // Table columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'metricId',
      key: 'metricId',
    },
    {
      title: 'Metric Name',
      dataIndex: 'metricName',
      key: 'metricName',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Minimum Value',
      dataIndex: 'min',
      key: 'min',
      render: (min) => min === null ? 'N/A' : min,
    },
    {
      title: 'Maximum Value',
      dataIndex: 'max',
      key: 'max',
      render: (max) => max === null ? 'N/A' : max,
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
            title="Are you sure you want to delete this growth metric?"
            onConfirm={() => handleDelete(record.metricId)}
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
        <h1>Growth Metric Management</h1>
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
            Create New Growth Metric
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={metrics}
        rowKey="metricId"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* Create Modal */}
      <Modal
        title="Create New Growth Metric"
        open={isCreateModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setIsCreateModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="metricName"
            label="Metric Name"
            rules={[{ required: true, message: 'Please enter metric name' }]}
          >
            <Input placeholder="Enter metric name" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: 'Please enter unit' }]}
          >
            <Input placeholder="Enter unit (e.g., mm, g, bpm)" />
          </Form.Item>
          <Form.Item
            name="min"
            label="Minimum Value (Optional)"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter minimum value"
            />
          </Form.Item>
          <Form.Item
            name="max"
            label="Maximum Value (Optional)"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter maximum value"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Growth Metric"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="metricName"
            label="Metric Name"
            rules={[{ required: true, message: 'Please enter metric name' }]}
          >
            <Input placeholder="Enter metric name" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: 'Please enter unit' }]}
          >
            <Input placeholder="Enter unit (e.g., mm, g, bpm)" />
          </Form.Item>
          <Form.Item
            name="min"
            label="Minimum Value (Optional)"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter minimum value"
            />
          </Form.Item>
          <Form.Item
            name="max"
            label="Maximum Value (Optional)"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter maximum value"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GrowthMetric