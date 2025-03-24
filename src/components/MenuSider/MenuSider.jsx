import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './MenuSider.css';
import { Link } from 'react-router-dom';
import config from '../../config';

const { Sider } = Layout;
import { Baby } from 'lucide-react';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axiosClient from '../../utils/apiCaller';

const MenuSider = () => {
  const { user } = useAuth();
  const [fetus, setFetus] = useState([]);

  useEffect(() => {
    const fetchFetus = async () => {
      // Add check to ensure user exists before accessing user.id
      if (!user || !user.id) {
        console.log('User not available yet');
        return;
      }

      try {
        const response = await axiosClient.get(`/fetuses/user/${user.id}`);
        if (response.code === 200) {
          setFetus(response.data);
        }
      } catch (error) {
        console.log('Failed to fetch fetus: ', error);
      }
    }
    fetchFetus();
  }, [user]); // Add user as a dependency


  // Create children for the Fetus menu item
  const fetusChildrenByWeek = [
    // Use the fetched fetus data instead of the hard-coded babyNames
    ...fetus.map(baby => ({
      key: `fetus-${baby.id}`,
      label: (
        <Link
          to={`${config.routes.customer.dashboardFetus}/${baby.id}`}
          style={{ textDecoration: 'none' }}
        >
          {baby.nickName || `Baby ${baby.id}`}
        </Link>
      ),
    })),
    // Add the "Add New Baby" button at the end
    {
      key: 'add-new-baby',
      label: (
        <Link
          to={`${config.routes.customer.pregnancy}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <PlusOutlined /> Add new fetus
        </Link>
      ),
      className: 'add-new-baby-item'
    }
  ];

  const fetusChildren = [
    ...fetus.map(baby => ({
      key: `fetus-${baby.id}`,
      label: (
        <Link
          to={`${config.routes.customer.manageMomInfor}/${baby.id}`}
          style={{ textDecoration: 'none' }}
        >
          {baby.nickName || `Baby ${baby.id}`}
        </Link>
      ),
    })),
  ];
  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Tracking All Babies',
      children: fetusChildren,
    },
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
      label: 'Tracking Baby by Week',
      children: fetusChildrenByWeek,
    },
    // { key: '5', icon: <EyeOutlined />, label: 'Mother status' },
    // { key: '6', icon: <BellOutlined />, label: 'Fetal growth chart' },
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