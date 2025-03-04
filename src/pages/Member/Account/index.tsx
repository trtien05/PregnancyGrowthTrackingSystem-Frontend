import React from 'react';
import {
  RightOutlined,
  EditOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  UserOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import config from '../../../config';
import './Setting.css';

const { Title } = Typography;

const SettingsPage = () => {
  const sections = [
    {
      title: 'Account',
      items: [
        {
          key: 'profile',
          icon: <EditOutlined />,
          label: 'Edit profile',
          link: config.routes.customer.profile,
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
      title: 'Fetus',
      items: [
        {
          key: 'fetus',
          icon: <HeartOutlined />,
          label: 'Your Babies',
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
        },
        {
          key: 'payment',
          icon: <CreditCardOutlined />,
          label: 'Saved payment cards',
          // link: config.routes.auth.checkout,
        },
      ],
    },
  ];

  return (
    <div className="wrapper-profile">
      <div className="container-profile">
        <div className="planSection-profile">
          <div className="planTitle-profile">Your Plan</div>
          <div className="planName-profile">Free Trial (3 Days)</div>
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
                <Link
                  to={item.link}
                  key={item.key}
                  className="menuItemLink-profile"
                >
                  {content}
                </Link>
              ) : (
                content
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;