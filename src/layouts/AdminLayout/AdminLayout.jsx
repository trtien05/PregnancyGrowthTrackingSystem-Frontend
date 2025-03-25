import { Avatar, Dropdown, Layout } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './AdminLayout.css';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/index';
import config from '../../config/index';
import { IoNewspaperOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import cookieUtils from '../../utils/cookieUtils';
import { PiStandardDefinitionFill } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";

const { Header, Content } = Layout;

const AdminLayout = () => {
  const menuItems = [
    {
      key: '1',
      icon: <LuLayoutDashboard size = { 22 } />,
      label: <Link to={config.routes.admin.dashboard}>Dashboard</Link>,
    },
    {
      key: '2',
      icon: <FaRegUser size={22} />,
      label: <Link to={config.routes.admin.manageMember}>Manage Member</Link>,
    },
    {
      key: '3',
      icon: <IoNewspaperOutline size={25} />,
      label: <Link to={config.routes.admin.manageBlogPost}>Manage Blog Post</Link>,
    },
    {
      key: '4',
      icon: <MdBorderColor size={23} />,
      label: <Link to={config.routes.admin.manageMembershipPlan}>Manage Plans</Link>,
    },
    {
      key: '5',
      icon: <FaChartLine size={20} style={{ marginRight: '3px' }} />,
      label: <Link to={config.routes.admin.growthMetrics}>Growth Metrics</Link>,
    },
    {
      key: '6',
      icon: <PiStandardDefinitionFill size={20} style={{ marginRight: '3px' }} />,
      label: <Link to={config.routes.admin.manageStandard}>Manage Standard</Link>,
    },
  ];
  const handleLogout = () => {
    cookieUtils.clear()
    window.location.href = config.routes.public.login
  }
  const items = [
    {
      label: (
        <div
          className={`menu-item-header logoutItem`}
          onClick={handleLogout}
        >
          <LogoutOutlined /> Logout
        </div>
      ),
      key: config.routes.public.login,
    },
  ];
  return (
    <Layout className="admin-layout">
      <Sidebar menuItems={menuItems} />
      <Layout className="main-content">
        <Header className="header-admin">
          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Avatar
              size={40}
              icon={<UserOutlined />} className='userAvatar' />
          </Dropdown>
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
