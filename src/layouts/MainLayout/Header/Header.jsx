import { useState } from 'react'
import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer } from 'antd'
import logo from '../../../assets/images/logo.svg'
import './Header.css'

const navLinks = [
  { title: 'About Us', href: '#' },
  { title: 'Pregnancy', href: '#' },
  { title: 'Blog', href: '/blogs' },
  { title: 'FAQ', href: '#' },
  { title: 'Explore Plans', href: '#' }
]

function Header() {
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

      <a href="/login" className="hidden md:block">
        <button className="join-button">Join us</button>
      </a>
    </nav>
  )
}

export default Header
