import { useEffect, useState } from "react"
import './Pregnancy.css'
import { Table, Tag, Empty, Button, Modal, DatePicker, Form, message, Popconfirm } from 'antd'
import axiosClient from "../../../../utils/apiCaller";
import Fetus from "./Fetus";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

function PregnancyPage() {
  const [pregnancy, setPregnancy] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  
  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dueDate, setDueDate] = useState(null)
  const [dueDateError, setDueDateError] = useState(false)
  const [currentPregnancy, setCurrentPregnancy] = useState(null)
  const [showLastPeriodPicker, setShowLastPeriodPicker] = useState(false)
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchPregnancy = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/pregnancies/me');
      if (response.code === 200) {
        // If API returns paginated data structure, update accordingly
        if (response.data.content) {
          setPregnancy(response.data.content);
          setTotalElements(response.data.totalElements);
        } else {
          setPregnancy(response.data);
          setTotalElements(response.data.length);
        }
      }
    } catch (error) {
      console.log('Failed to fetch pregnancy: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPregnancy();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Validate due date
  const validateDueDate = (date) => {
    if (!date) {
      setDueDateError(true);
      return false;
    }
    setDueDateError(false);
    return true;
  };

  // Modal handling functions
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    setDueDate(null);
    setShowLastPeriodPicker(false);
    form.resetFields();
  };

  const showEditModal = (record) => {
    setCurrentPregnancy(record);
    setDueDate(dayjs(record.dueDate));
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      dueDate: dayjs(record.dueDate),
    });
  };

  const handleCreateModalOk = async () => {
    if (!validateDueDate(dueDate)) {
      message.error('Please select a valid due date');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the date as needed by your API
      const formattedDate = dueDate.format('YYYY-MM-DD');

      // Send the due date to create a new pregnancy
      const response = await axiosClient.post('/pregnancies', {
        dueDate: formattedDate
      });

      if (response.code === 200 || response.code === 201) {
        message.success('Pregnancy information saved!');
        setIsCreateModalVisible(false);
        fetchPregnancy(); // Refresh the table
      } else {
        message.error('Failed to save pregnancy information');
      }
    } catch (error) {
      console.error('Error saving pregnancy information:', error);
      message.error('An error occurred while saving pregnancy information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditModalOk = async () => {
    if (!validateDueDate(dueDate)) {
      message.error('Please select a valid due date');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDate = dueDate.format('YYYY-MM-DD');
      
      const response = await axiosClient.put(`/pregnancies/${currentPregnancy.id}`, {
        dueDate: formattedDate
      });

      if (response.code === 200) {
        message.success('Pregnancy information updated!');
        setIsEditModalVisible(false);
        fetchPregnancy(); // Refresh the table
      } else {
        message.error('Failed to update pregnancy information');
      }
    } catch (error) {
      console.error('Error updating pregnancy information:', error);
      message.error('An error occurred while updating pregnancy information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePregnancy = async (id) => {
    try {
      const response = await axiosClient.delete(`/pregnancies/${id}`);
      
      if (response.code === 200) {
        message.success('Pregnancy record deleted successfully');
        fetchPregnancy(); // Refresh the table
      } else {
        message.error('Failed to delete pregnancy record');
      }
    } catch (error) {
      console.error('Error deleting pregnancy:', error);
      message.error('An error occurred while deleting pregnancy record');
    }
  };

  const handleModalCancel = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    setDueDate(null);
    setShowLastPeriodPicker(false);
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
    if (date) {
      setDueDateError(false);
    }
  };

  const handleCalculateDueDateClick = (e) => {
    e.preventDefault();
    setShowLastPeriodPicker(true);
  };

  const handleLastPeriodChange = (date) => {
    if (date) {
      // Calculate due date: Last period + 280 days (40 weeks)
      const calculatedDueDate = dayjs(date).add(280, 'day');
      setDueDate(calculatedDueDate);
    }
  };

  // Define table columns
  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 70,
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
    },
    {
      title: 'Start Date',
      dataIndex: 'pregnancyStartDate',
      key: 'pregnancyStartDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'Not yet delivered',
    },
    {
      title: 'Maternal Age',
      dataIndex: 'maternalAge',
      key: 'maternalAge',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record) => {
        const today = new Date();
        const dueDate = new Date(record.dueDate);

        if (record.deliveryDate) {
          return <Tag color="green">Delivered</Tag>;
        } else if (today > dueDate) {
          return <Tag color="red">Overdue</Tag>;
        } else {
          return <Tag color="blue">Ongoing</Tag>;
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <div className="action-buttons">
          <Fetus id={record.id} />
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showEditModal(record)}
            style={{ marginLeft: '5px' }}
          />
          <Popconfirm
            title="Delete Pregnancy Record"
            description="Are you sure you want to delete this pregnancy?"
            onConfirm={() => handleDeletePregnancy(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              style={{ marginLeft: '5px' }}
            />
          </Popconfirm>
        </div>
      ),
    }
  ];

  return (
    <div className="order-history-container">
      <div className="pregnancy-header">
        <h2 className="order-history-title">Pregnancy Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
          className="update-button-subscription"
        >
          Add Pregnancy
        </Button>
      </div>
      
      <Table
        className="ant-order-table"
        columns={columns}
        dataSource={pregnancy}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 5,
          total: totalElements,
          current: currentPage,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: <Empty description="No pregnancy records found" />
        }}
        scroll={{ x: 'max-content' }}
      />

      {/* Create Pregnancy Modal */}
      <Modal
        title={
          <div style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#FAACAA',
            marginBottom: '10px',
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '10px'
          }}>
            Track your baby's milestones
          </div>
        }
        open={isCreateModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleCreateModalOk}
            className={'update-button-subscription'}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <p style={{ fontSize: '16px', marginBottom: '20px', }}>
            To track your pregnancy journey, please provide your expected due date below.
          </p>
          <Form.Item
            validateStatus={dueDateError ? 'error' : ''}
            help={dueDateError ? 'Please select a due date' : ''}
          >
            <DatePicker
              style={{ width: '100%' }}
              onChange={handleDueDateChange}
              value={dueDate}
              placeholder="Due date or child's birthday"
              disabledDate={(current) => current && current < dayjs().subtract(30, 'day')}
              status={dueDateError ? 'error' : ''}
            />
          </Form.Item>
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontSize: '14px', color: 'gray' }}>Don't know your due date? </span>
            <a
              href="#"
              className='calculate-due-date'
              onClick={handleCalculateDueDateClick}
            >
              Calculate my due date
            </a>
          </div>

          {showLastPeriodPicker && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                Select the first day of your last period:
              </p>
              <DatePicker
                style={{ width: '100%' }}
                onChange={handleLastPeriodChange}
                placeholder="First day of last period"
                disabledDate={(current) => current && current > dayjs()}
              />
              <p style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                Your due date will be automatically calculated (280 days from last period)
              </p>
            </div>
          )}
        </Form>
      </Modal>

      {/* Edit Pregnancy Modal */}
      <Modal
        title={
          <div style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#FAACAA',
            marginBottom: '10px',
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '10px'
          }}>
            Update Baby's Due Date
          </div>
        }
        open={isEditModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleEditModalOk}
            className={'update-button-subscription'}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={editForm} layout="vertical">
          <p style={{ fontSize: '16px', marginBottom: '20px', }}>
            Update the expected due date for this pregnancy.
          </p>
          <Form.Item
            name="dueDate"
            validateStatus={dueDateError ? 'error' : ''}
            help={dueDateError ? 'Please select a valid due date' : ''}
          >
            <DatePicker
              style={{ width: '100%' }}
              onChange={handleDueDateChange}
              value={dueDate}
              placeholder="Due date"
              disabledDate={(current) => current && current < dayjs().subtract(30, 'day')}
              status={dueDateError ? 'error' : ''}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PregnancyPage