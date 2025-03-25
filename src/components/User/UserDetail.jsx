import React from 'react';
import { Typography, Divider, Tag, Avatar, Card, Space, Row, Col, Descriptions } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  GiftOutlined, 
  GlobalOutlined, 
  ManOutlined, 
  WomanOutlined,
  MedicineBoxOutlined,
  TagOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Title, Text, Paragraph } = Typography;

const UserDetail = ({ user }) => {
  if (!user) return null;

  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  
  const formatBloodType = (bloodType) => {
    if (!bloodType) return 'Unknown';
    return bloodType.replace('_', ' ');
  };

 
  const getRoleColor = () => {
    switch (user.role) {
      case 'admin': return 'red';
      case 'member': return 'blue';
      default: return 'green';
    }
  };

  return (
    <Card 
      className="user-detail-card"
      style={{ 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        background: 'linear-gradient(to right, #f5f7fa 0%, #f5f7fa 50%, #e6e9f0 100%)'
      }}
    >
      {/* Header Section */}
      <Row gutter={[16, 16]} align="middle" justify="center">
        <Col xs={24} style={{ textAlign: 'center' }}>
          <Avatar 
            size={120} 
            src={user.avatarUrl} 
            icon={!user.avatarUrl && <UserOutlined />}
            style={{ 
              border: '4px solid white', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}
          />
          <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
            {user.fullName}
          </Title>
          <Space>
            <Tag 
              color={getRoleColor()} 
              
            >
              {user.role}
            </Tag>
            <Tag 
              color={user.enabled ? 'success' : 'default'}
            >
              {user.enabled ? 'Active' : 'Inactive'}
            </Tag>
            <Tag 
              color={user.verified ? 'success' : 'warning'}
            >
              {user.verified ? 'Verified' : 'Unverified'}
            </Tag>
          </Space>
        </Col>
      </Row>
      
      <Divider />
      
      {/* Contact Information */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            type="inner" 
            title="Contact Details" 
            headStyle={{ background: '#f0f2f5', borderBottom: '1px solid #e8e8e8' }}
          >
            <Paragraph>
              <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              <Text strong>Email:</Text> {user.email}
            </Paragraph>
            <Paragraph>
              <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <Text strong>Phone:</Text> {user.phoneNumber || 'N/A'}
            </Paragraph>
            <Paragraph>
              <GlobalOutlined style={{ marginRight: 8, color: '#722ed1' }} />
              <Text strong>Nationality:</Text> {user.nationality || 'N/A'}
            </Paragraph>
          </Card>
        </Col>
        
        {/* Personal Information */}
        <Col xs={24} md={12}>
          <Card 
            type="inner" 
            title="Personal Information" 
            headStyle={{ background: '#f0f2f5', borderBottom: '1px solid #e8e8e8' }}
          >
            <Paragraph>
              <GiftOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
              <Text strong>Date of Birth:</Text> {formatDate(user.dateOfBirth)}
            </Paragraph>
            <Paragraph>
              {user.gender ? <ManOutlined style={{ marginRight: 8, color: '#1890ff' }} /> : <WomanOutlined style={{ marginRight: 8, color: '#eb2f96' }} />}
              <Text strong>Gender:</Text> {user.gender ? 'Male' : 'Female'}
            </Paragraph>
            <Paragraph>
              <MedicineBoxOutlined style={{ marginRight: 8, color: '#cf1322' }} />
              <Text strong>Blood Type:</Text> {formatBloodType(user.bloodType)}
            </Paragraph>
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      {/* Additional Information */}
      <Card 
        type="inner" 
        title="Additional Details" 
        headStyle={{ background: '#f0f2f5', borderBottom: '1px solid #e8e8e8' }}
      >
        <Paragraph>
          <Text strong>Symptoms:</Text> {user.symptoms || 'None'}
        </Paragraph>
        {user.createdAt && (
          <Paragraph>
            <Text strong>Account Created:</Text> {formatDate(user.createdAt)}
          </Paragraph>
        )}
        {user.updatedAt && (
          <Paragraph>
            <Text strong>Last Updated:</Text> {formatDate(user.updatedAt)}
          </Paragraph>
        )}
      </Card>
    </Card>
  );
};

UserDetail.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    enabled: PropTypes.bool,
    verified: PropTypes.bool,
    role: PropTypes.string,
    phoneNumber: PropTypes.string,
    nationality: PropTypes.string,
    dateOfBirth: PropTypes.string,
    avatarUrl: PropTypes.string,
    gender: PropTypes.bool,
    bloodType: PropTypes.string,
    symptoms: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

export default UserDetail;