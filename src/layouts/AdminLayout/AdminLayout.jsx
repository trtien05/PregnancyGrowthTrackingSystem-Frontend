import { Layout } from 'antd';
import {
  HomeOutlined,
  DesktopOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  BellOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import './AdminLayout.css';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/index';
import config from '../../config/index';

const { Header, Content } = Layout;

const AdminLayout = () => {

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <Link to={config.routes.admin.dashboard}>Dashboard</Link>,
    },
    {
      key: '2',
      icon: <DesktopOutlined />,
      label: <Link to={config.routes.admin.manageMember}>Manage Member</Link>,
    },
    {
      key: '3',
      icon: <ClockCircleOutlined />,
      label: 'Fetal growth chart',
    },
    {
      key: '4',
      icon: <InboxOutlined />,
      label: <Link to={config.routes.admin.managePlans}>Manage Plans</Link>,
    },
    {
      key: '5',
      icon: <BellOutlined />,
      label: <Link to={config.routes.admin.growthMatrics}>Grouth Matrics</Link>,
    },
  ];

  return (
    <Layout className="admin-layout">
      <Sidebar sidebarBody={menuItems} />
      <Layout className="main-content">
        <Header className="header">
          {/* <HeaderAuth user={user} onLogout={handleLogout} /> */}
        </Header>

        <Content className="content">
          {/* Admin Content */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
