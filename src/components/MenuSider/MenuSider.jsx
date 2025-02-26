import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  BellOutlined,
  PlusOutlined
} from '@ant-design/icons';
import './MenuSider.css';
import { Link } from 'react-router-dom';
import config from '../../config';

const { Sider } = Layout;
import { Baby } from 'lucide-react';

const MenuSider = () => {
  const babyNames = [
    { key: 'baby1', name: 'Nguyen Van A', path: `${config.routes.customer.dashboardFetus}` },
    { key: 'baby2', name: 'Le Thi C', path: `${config.routes.customer.dashboardFetus}` },
    { key: 'baby3', name: 'Tran Van B', path: `${config.routes.customer.dashboardFetus}` },
  ];
  // Create children for the Fetus menu item
  const fetusChildren = [
    // Add all the baby names first
    ...babyNames.map(baby => ({
      key: baby.key,
      label: <Link to={baby.path}>{baby.name}</Link>,
    })),
    // Add the "Add New Baby" button at the end
    {
      key: 'add-new-baby',
      label: (
        <Link to={`${config.routes.customer.dashboardFetus}/add-new`} className="add-new-baby-link">
          <PlusOutlined /> Thêm mới em bé
        </Link>
      ),
      className: 'add-new-baby-item'
    }
  ];
  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <Link to={config.routes.customer.manageMomInfor}>Dashboard</Link>,

    },
    {
      key: '2',
      icon: <Baby style={{ marginRight: '12px' }} />,
      label: 'Fetus',
      children: fetusChildren
    },
    {
      key: '3',
      icon: <ClockCircleOutlined />,
      label: 'Fetal growth chart'
    },
    {
      key: '4',
      icon: <EyeOutlined />,
      label: 'Mother status'
    },
    {
      key: '5',
      icon: <BellOutlined />,
      label: 'Notification'
    }
  ];

  return (
    <Sider theme="light" width={250} className="menu-sider">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        items={menuItems.map(item => ({
          ...item,
          // className: 'menu-item'
        }))}
      />
    </Sider>
  );
};

export default MenuSider;