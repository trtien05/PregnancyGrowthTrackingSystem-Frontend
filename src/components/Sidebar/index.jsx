import Sider from 'antd/es/layout/Sider';
import { Menu } from 'antd';
import './Sidebar.css';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';


export default function Sidebar(menuItems) {
  const location = useLocation();

  return (
    <Sider theme="light" width={270} className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <img src={logo} alt="PregnaCare" width={20} />
        </div>
        <div>
          <p className="sidebar-title">PregnaCare</p>
          <p className="sidebar-subtitle">Modern Member Dashboard</p>
        </div>
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={[location.pathname ? location.pathname : '1']}
        defaultOpenKeys={['3']}
        items={menuItems.menuItems.map((item, index) => ({
          ...item,
          key: item.key || index,
        }))}
      />
    </Sider>
  );
}
