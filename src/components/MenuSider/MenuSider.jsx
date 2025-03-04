import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  EyeOutlined,
  BellOutlined,
  PlusOutlined,
  CalendarOutlined
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
      label: (
        <Link
          to={`${config.routes.customer.pregnancy}/${baby.id}`}
          style={{ textDecoration: 'none' }}
        >
          {baby.name}
        </Link>
      ),
    })),
    // Add the "Add New Baby" button at the end
    {
      key: 'add-new-baby',
      label: (
        <Link
          to={`${config.routes.customer.profile}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <PlusOutlined /> Add new fetus
        </Link>
      ),
      className: 'add-new-baby-item'
    }
  ];
  const menuItems = [
    { key: '1', icon: <HomeOutlined />, label: 'Mother Information' },
    // {
    //   key: '2',
    //   icon: <CalendarOutlined />,
    //   label: (
    //     <Link
    //       to={config.routes.member.calendar}
    //       style={{ textDecoration: 'none' }}
    //     >
    //       Calendar
    //     </Link>
    //   ),
    // },
    {
      key: '3',
      icon: <Baby size={16} />,
      label: 'Fetus',
      children: fetusChildren,
    },
    { key: '5', icon: <EyeOutlined />, label: 'Mother status' },
    { key: '6', icon: <BellOutlined />, label: 'Fetal growth chart' },
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