import { useState, useEffect, useCallback } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UserTable from '../../../components/User/UserTable';
import UserForm from '../../../components/User/UserForm';
import UserDetail from '../../../components/User/UserDetail';
import userService from '../../../services/userService';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0); // Zero-indexed for API
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  // Detail modal state
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  // Track toggle operations in progress
  const [togglingUsers, setTogglingUsers] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getAllUsers(page, rowsPerPage);
      
      if (response && response.data) {
        console.log('Fetched users:', response.data);
        setUsers(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
      } else {
        setUsers([]);
        setTotalElements(0);
        setError('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      setUsers([]);
      
      message.error(`Failed to fetch users: ${error.response?.data?.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setRowsPerPage(newPageSize);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode('update');
    setIsModalVisible(true);
  };

  const handleToggleStatus = async (id, enabled) => {
    // Track that we're toggling this user
    setTogglingUsers(prev => ({ ...prev, [id]: true }));
    
    try {
      console.log(`Toggling user ${id} to ${enabled ? 'active' : 'inactive'}`);
      
      // Call the API to toggle status
      const response = await userService.toggleUserStatus(id, enabled);
      
      if (response && response.data) {
        console.log('Toggle success response:', response.data);
        
        // Update the user in the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === id ? { ...user, enabled: enabled } : user
          )
        );
        
        message.success(`User ${enabled ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      message.error(`Failed to update user status: ${error.message || 'Unknown error'}`);
      
      // Revert the change in the UI by re-fetching users
      fetchUsers();
    } finally {
      // Remove this user from toggling state
      setTogglingUsers(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleSubmit = async (userData) => {
    try {
      if (modalMode === 'create') {
        await userService.createUser(userData);
        message.success('User created successfully');
      } else if (selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
        message.success('User updated successfully');
      }
      
      // Close modal and refresh list
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(`Failed to ${modalMode} user: ${error.message || 'Unknown error'}`);
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalVisible(true);
  };
  
  const handleView = (user) => {
    setDetailUser(user);
    setIsDetailModalVisible(true);
  };

  // Add retry mechanism for server errors
  const handleRetry = () => {
    message.info('Retrying to fetch users...');
    fetchUsers();
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16 
      }}>
        <h1>User Management</h1>
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
          >
            Create New User
          </Button>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '16px', 
          background: '#fff1f0', 
          border: '1px solid #ffa39e',
          borderRadius: '2px'
        }}>
          Server Error: {error}. Please try again later or contact support.
        </div>
      )}

      <UserTable 
        users={users}
        totalElements={totalElements}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onView={handleView}
        loading={loading}
        togglingUsers={togglingUsers}
      />

      <Modal
        title={modalMode === 'create' ? 'Create New User' : 'Edit User'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <UserForm 
          initialValues={selectedUser || undefined}
          onSubmit={handleSubmit}
          mode={modalMode}
        />
      </Modal>
      
      <Modal
        title="User Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setIsDetailModalVisible(false);
              handleEdit(detailUser);
            }}
          >
            Edit
          </Button>
        ]}
        width={800}
      >
        <UserDetail user={detailUser} />
      </Modal>
    </div>
  );
};

export default UserPage;