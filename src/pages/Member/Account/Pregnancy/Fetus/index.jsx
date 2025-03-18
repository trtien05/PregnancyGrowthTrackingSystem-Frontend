import { Button, Modal, Input, Select, message, Table, Empty, Tag, Space, Popconfirm } from 'antd'
import { BabyIcon, Edit2, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axiosClient from '../../../../../utils/apiCaller'

function Fetus(props) {
  const { id } = props
  const [fetus, setFetus] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetusName, setFetusName] = useState('');
  const [fetusGender, setFetusGender] = useState('unknown');
  const [currentFetus, setCurrentFetus] = useState(null);

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  const fetchFetus = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get(`/pregnancies/${id}/fetuses`)
      if (response.code === 200) {
        setFetus(response.data)
      }
    } catch (error) {
      console.log("Failed to fetch fetus: ", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {

    fetchFetus()
  }, [id]);



  const handleFetusClick = (e) => {
    fetchFetus()
    e.preventDefault();
    if (fetus.length !== 0) {
      fetchFetus()
      setIsModalVisible(true);
    } else {
      setIsAddModalVisible(true);
    }
  }

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    setFetusName('');
    setFetusGender('unknown');
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setFetusName('');
    setFetusGender('unknown');
    setCurrentFetus(null);
  };

  const handleAddFetus = async () => {
    if (!fetusName.trim()) {
      message.error("Please enter a name for the fetus");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosClient.post(`/pregnancies/${id}/fetuses`, {
        nickName: fetusName.trim(),
        gender: fetusGender
      });

      if (response.code === 201 || response.code === 200) {
        message.success("Fetus information added successfully");
        setIsAddModalVisible(false);
        setFetusName('');
        setFetusGender('unknown');
      } else {
        message.error("Failed to add fetus information");
      }
    } catch (error) {
      console.error("Error adding fetus:", error);
      message.error("Failed to add fetus information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFetus = (record) => {
    setCurrentFetus(record);
    setFetusName(record.nickName);
    setFetusGender(record.gender);
    setIsEditModalVisible(true);
    setIsModalVisible(false);
  };

  const handleDeleteFetus = async (fetusId) => {
    try {
      setLoading(true);
      const response = await axiosClient.delete(`/pregnancies/${id}/fetuses/${fetusId}`);
      if (response.code === 200) {
        message.success("Fetus information deleted successfully");
        setFetus(fetus.filter(item => item.id !== fetusId));
      } else {
        message.error("Failed to delete fetus information");
      }
    } catch (error) {
      console.error("Error deleting fetus:", error);
      message.error("Failed to delete fetus information");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFetus = async () => {
    if (!fetusName.trim()) {
      message.error("Please enter a name for the fetus");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosClient.put(`/pregnancies/${id}/fetuses/${currentFetus.id}`, {
        nickName: fetusName.trim(),
        gender: fetusGender
      });

      if (response.code === 200) {
        message.success("Fetus information updated successfully");
        setFetus(fetus.map(item =>
          item.id === currentFetus.id ? { ...item, nickName: fetusName.trim(), gender: fetusGender } : item
        ));
        setIsEditModalVisible(false);
        setFetusName('');
        setFetusGender('unknown');
        setCurrentFetus(null);
      } else {
        message.error("Failed to update fetus information");
      }
    } catch (error) {
      console.error("Error updating fetus:", error);
      message.error("Failed to update fetus information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setIsAddModalVisible(true);
    setIsModalVisible(false);
  };

  // Define table columns
  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Nick Name',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (record) => {
        if (record === "male") {
          return <Tag color="green">Male</Tag>;
        } else if (record === "female") {
          return <Tag color="red">Female</Tag>;
        } else {
          return <Tag color="gray" >Unknown</Tag>;
        }
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Edit2
            size={18}
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => handleEditFetus(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this fetus?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteFetus(record.id)}
          >
            <Trash2 size={18} style={{ color: '#ff4d4f', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div >
      <BabyIcon onClick={handleFetusClick} size={22} style={{ color: '#FAACAA', cursor: 'pointer' }} />

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
            Fetus Information
          </div>
        }
        footer={false}
        open={isModalVisible}
        onCancel={handleModalCancel}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            key="add"
            type="primary"
            onClick={openAddModal}
            style={{ marginBottom: '10px', marginLeft: 'auto' }}
            className={'update-button-subscription'}
          >
            + Add Fetus
          </Button>
        </div>

        <Table
          className="ant-order-table"
          columns={columns}
          dataSource={fetus}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 2,
            showSizeChanger: false,
          }}
          locale={{
            emptyText: <Empty description="No fetus records found" />
          }}
          scroll={{ x: 'max-content' }}
        />
      </Modal>

      {/* Add Fetus Modal */}
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
            New Fetus Information
          </div>
        }
        open={isAddModalVisible}
        onCancel={handleAddModalCancel}
        footer={[
          <Button key="back" onClick={handleAddModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleAddFetus}
            className={'update-button-subscription'}
          >
            Save
          </Button>,
        ]}
      >
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: "#ff7875" }}>Name:</label>
          <Input
            placeholder="Enter your baby's name"
            value={fetusName}
            onChange={(e) => setFetusName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: "#ff7875" }}>Gender:</label>
          <Select
            value={fetusGender}
            onChange={(value) => setFetusGender(value)}
            style={{ width: '100%' }}
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'unknown', label: 'Unknown' }
            ]}
          />
        </div>
      </Modal>

      {/* Edit Fetus Modal */}
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
            Edit Fetus Information
          </div>
        }
        open={isEditModalVisible}
        onCancel={handleEditModalCancel}
        footer={[
          <Button key="back" onClick={handleEditModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleUpdateFetus}
            className={'update-button-subscription'}
          >
            Update
          </Button>,
        ]}
      >
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: "#ff7875" }}>Name:</label>
          <Input
            placeholder="Enter your baby's name"
            value={fetusName}
            onChange={(e) => setFetusName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: "#ff7875" }}>Gender:</label>
          <Select
            value={fetusGender}
            onChange={(value) => setFetusGender(value)}
            style={{ width: '100%' }}
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'unknown', label: 'Unknown' }
            ]}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Fetus