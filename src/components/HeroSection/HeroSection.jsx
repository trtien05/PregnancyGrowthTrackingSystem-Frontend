import { Row, Col, Button } from 'antd';
import banner from '../../assets/images/banner.png';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-container">
        <Row gutter={[32, 32]} align="middle" justify="space-between">
          {/* Left Column - Text Content */}
          <Col xs={24} md={12}>
            <div className="hero-text">
              <h1 className="hero-title">
                &quot;Together,
                <br />
                Every Step of the Way&quot;
              </h1>
              <p className="hero-description">
                At PregnaJoy, we&apos;re here to support you through your entire pregnancy journey. From tracking your baby&apos;s growth to gentle
                reminders, we walk beside you, ensuring you feel cared for and confident every step of the way.
              </p>
              <Button type="primary" size="large" className="hero-button">
                Embrace This Beautiful Journey
              </Button>
            </div>
          </Col>

          {/* Right Column - Image */}
          <Col xs={24} md={12} className="hero-image-container">
            <div className="hero-image-wrapper">
              <img src={banner} alt="Caring hands holding baby's hand illustration" className="hero-image" />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default HeroSection;
