import { useState } from 'react'
import { MenuOutlined, UserOutlined } from '@ant-design/icons'
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

const items = [
  {
    label: <Link>Profile</Link>,
    key: "profile",
  },
  {
    label: (
      <Link to={config.routes.public.login} onClick={() => cookieUtils.clear()}>
        Log Out
      </Link>
    ),
    key: config.routes.public.login,
  },
];

function Header(props) {
  // eslint-disable-next-line react/prop-types
  const { user } = props
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
        <Dropdown menu={{ items }} arrow placement="bottomRight" trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size={40} icon={<UserOutlined />} />
          </Space>
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
