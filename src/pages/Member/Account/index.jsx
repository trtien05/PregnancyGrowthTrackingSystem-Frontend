import {
  RightOutlined,
  EditOutlined,
  HistoryOutlined,
  UserOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Typography, Modal, DatePicker, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../../config';
import './Setting.css';
import useAuth from '../../../hooks/useAuth';
import { BabyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosClient from '../../../utils/apiCaller';
import dayjs from 'dayjs'; // Make sure to import dayjs

const { Title } = Typography;

const SettingsPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [pregnancy, setPregnancy] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLastPeriodPicker, setShowLastPeriodPicker] = useState(false);

  useEffect(() => {
    const fetchPregnancy = async () => {
      try {
        const response = await axiosClient.get('/pregnancies/me');
        if (response.code === 200) {
          setPregnancy(response.data);
        }
      } catch (error) {
        console.log('Failed to fetch pregnancy: ', error);
      }
    }
    fetchPregnancy();
  }, []);
  console.log("pregnancy", pregnancy);

  const handlePregnancyClick = (e) => {
    e.preventDefault();
    if (!pregnancy || pregnancy.length === 0) {
      setIsModalVisible(true);
    } else {
      navigate(config.routes.customer.pregnancy);
    }
  };

  const handleModalOk = async () => {
    if (!dueDate) {
      message.error('Please select a due date');
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
        setIsModalVisible(false);
        // Update pregnancy data
        setPregnancy([response.data]);
        // Navigate to pregnancy page
        navigate(config.routes.customer.pregnancy);
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

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setDueDate(null);
    setShowLastPeriodPicker(false);
  };

  const allSections = [
    {
      title: 'Account',
      items: [
        {
          key: 'profile',
          icon: <EditOutlined />,
          label: 'Edit profile',
          link: config.routes.customer.profileInformation,
        },
        {
          key: 'subscription',
          icon: <UserOutlined />,
          label: 'Manage your subscription',
          link: config.routes.customer.subscription,
        },
      ],
    },

    {
      title: 'Pregnancy',
      items: [
        {
          key: 'pregnancy',
          // icon: <BabyIcon size={22} style={{ marginTop: '8px' }} />,
          icon: <HeartOutlined />,
          label: 'Manage your pregnancy',
          link: config.routes.customer.pregnancy,
          onClick: handlePregnancyClick
        },
      ],
    },
    {
      title: 'Payment',
      items: [
        {
          key: 'history',
          icon: <HistoryOutlined />,
          label: 'Order history',
          link: config.routes.customer.oderHistory,
        },
      ],
    },
  ];

  // Filter sections and items based on user role
  const sections = allSections
    .filter(section => role === 'ROLE_user' ?
      (section.title !== 'Payment' && section.title !== 'Pregnancy') : true)
    .map(section => {
      if (section.title === 'Account' && role === 'ROLE_user') {
        return {
          ...section,
          items: section.items.filter(item => item.key !== 'subscription')
        };
      }
      return section;
    });

  return (
    <div className="wrapper-profile">
      <div className="container-profile">
        <div className="planSection-profile">
          <div className="planTitle-profile">Your Plan</div>
          <div className="planName-profile">{role === 'ROLE_user' ? "Not Subscribed" : "Member"}</div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="section-profile">
            <Title level={3} className="sectionTitle-profile">
              {section.title}
            </Title>
            {section.items.map((item) => {
              const content = (
                <div key={item.key} className="menuItem-profile">
                  <span className="menuItemIcon-profile">{item.icon}</span>
                  <span className="menuItemLabel-profile">{item.label}</span>
                  <RightOutlined className="menuItemArrow-profile" />
                </div>
              );

              return item.link ? (
                item.onClick ? (
                  <a
                    href={item.link}
                    key={item.key}
                    className="menuItemLink-profile"
                    onClick={item.onClick}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    key={item.key}
                    className="menuItemLink-profile"
                  >
                    {content}
                  </Link>
                )
              ) : (
                content
              );
            })}
          </div>
        ))}
      </div>

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
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleModalOk}
            className={'update-button-subscription'}
          >
            Save
          </Button>,
        ]}
      >
        <p style={{ fontSize: '16px', marginBottom: '20px', }}>
          To track your pregnancy journey, please provide your expected due date below.
        </p>
        <DatePicker
          style={{ width: '100%' }}
          onChange={(date) => setDueDate(date)}
          value={dueDate}
          placeholder="Due date or child's birthday"
          disabledDate={(current) => current && current < dayjs().subtract(30, 'day')}
        />
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
      </Modal>
    </div>
  );
};

export default SettingsPage;