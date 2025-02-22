import { Col, List, Row, Typography, Space } from 'antd';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';
import logo from '../../../assets/images/logo.svg';
import './Footer.css';

const { Title, Text } = Typography;

const Footer = () => {
  const learnItems = [
    { id: 1, titleName: 'IELTS' },
    { id: 2, titleName: 'TOEIC' },
    { id: 3, titleName: 'MATHEMATICS' },
    { id: 4, titleName: 'CODING' },
  ];

  const pageItems = [
    { id: 1, titleName: 'Home' },
    { id: 2, titleName: 'About Us' },
    { id: 3, titleName: 'Blog' },
    { id: 4, titleName: 'Pregnancy' },
  ];

  return (
    <footer className="footer-section">
      <div className="container">
        <Row gutter={[24, 24]} className="footer-content">
          {/* Logo Column */}
          <Col xs={24} sm={24} md={6} lg={6}>
            <div className="footer-logo">
              <img src={logo} alt="MyTutor Logo" />
              <span className="brand-name">PregnaJoy</span>

            </div>
          </Col>

          {/* Learn Column */}
          <Col xs={24} sm={12} md={6} lg={6}>
            <Title level={4} className="footer-title">TOOLS</Title>
            <List
              dataSource={learnItems}
              renderItem={item => (
                <List.Item className="footer-list-item">
                  <Link to={`/${item.titleName.toLowerCase()}`}>{item.titleName}</Link>
                </List.Item>
              )}
            />
          </Col>

          {/* Page Column */}
          <Col xs={24} sm={12} md={6} lg={6}>
            <Title level={4} className="footer-title">PAGE</Title>
            <List
              dataSource={pageItems}
              renderItem={item => (
                <List.Item className="footer-list-item">
                  <Link to={`/${item.titleName.toLowerCase()}`}>{item.titleName}</Link>
                </List.Item>
              )}
            />
          </Col>

          {/* Contact Column */}
          <Col xs={24} sm={24} md={6} lg={6}>
            <Title level={4} className="footer-title">CONTACT</Title>
            <Space direction="vertical" size="middle">
              <Text>
                <PhoneOutlined /> 028-7300-5588
              </Text>
              <Text>
                <MailOutlined /> pregnajoy.main.official@gmail.com
              </Text>
              <Space size="large" className="social-icons">
                <Link to="#"><FacebookOutlined /></Link>
                <Link to="#"><TwitterOutlined /></Link>
                <Link to="#"><InstagramOutlined /></Link>
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Bottom Copyright Section */}
        <Row className="footer-bottom">
          <Col span={24}>
            <div className="copyright">
              <Text>@2024 Copyright All Rights Reserved</Text>
              <Space size="middle">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/legal">Legal Center</Link>
              </Space>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;