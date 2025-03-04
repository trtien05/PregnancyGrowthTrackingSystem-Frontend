import { useState } from 'react'
import { DashboardOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Drawer, Dropdown, Space } from 'antd'
import logo from '../../../assets/images/logo.svg'
import './Header.css'
import { Link } from 'react-router-dom'
import config from '../../../config'
import cookieUtils from '../../../utils/cookieUtils'

const navLinks = [
  { title: 'About Us', href: '#' },
  { title: 'Pregnancy', href: '#' },
  { title: 'Blog', href: '/blogs' },
  { title: 'FAQ', href: '#' },
  { title: 'Pricing', href: '/pricing' }
]

function Header(props) {
  // eslint-disable-next-line react/prop-types
  const { user, role } = props
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleLogout = () => {
    cookieUtils.clear()
    window.location.href = config.routes.public.login
  }

  const items = [
    {
      label:
        <Link
          className='menu-item-link'
          to={config.routes.customer.profile}
        >
          <div className='menu-item-header'>
            <UserOutlined style={{ marginBottom: '2px' }} /> Account
          </div>
        </Link>,
      key: config.routes.customer.profile,
    },
    ...(role === 'ROLE_authenticatedUser' ? [
      {
        label:
          <Link
            className='menu-item-link'
            to={config.routes.customer.manageMomInfor}
          >
            <div className='menu-item-header'>
              <DashboardOutlined /> Dashboard
            </div>
          </Link>,
        key: config.routes.customer.manageMomInfor
      }
    ] : []),
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
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="header">
      <div className="logo-container">
        <img src={logo} alt="logo" width={30} height={24} />
        <span className="brand-name">PregnaJoy</span>
      </div>

      <div className="nav-links">
        {navLinks.map((link, index) => (
          <a key={index} href={link.href} className="nav-link">
            {link.title}
          </a>
        ))}
      </div>

      <div className="mobile-menu-button">
        <Button type="text" icon={<MenuOutlined />} onClick={toggleMobileMenu} />
      </div>

      <Drawer title="Menu" placement="right" onClose={toggleMobileMenu} open={mobileMenuOpen}>
        {navLinks.map((link, index) => (
          <a key={index} href={link.href} className="mobile-nav-link">
            {link.title}
          </a>
        ))}
        <div style={{ padding: '16px' }}>
          <Button type="primary" href="/login" block className="join-button">
            Join us
          </Button>
        </div>
      </Drawer>
      {user ? (
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Avatar
            size={40}
            icon={<UserOutlined />} className='userAvatar' />
        </Dropdown>
      ) : (
        <a href="/login" className="hidden md:block">
          <button className="join-button">Join us</button>
        </a>
      )}
    </nav>
  )
}

export default Header
