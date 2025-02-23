import { Row, Col } from 'antd';
import perDay from "../../assets/images/per-day.svg";
import clients from "../../assets/images/client.svg";
import users from "../../assets/images/users.svg";
import countries from "../../assets/images/countries.svg";
import './AchievementSection.css';

const stats = [
  { img: perDay, value: "10,000+", label: "Downloads per day" },
  { img: clients, value: "500+", label: "Clients" },
  { img: users, value: "2 Million", label: "Users" },
  { img: countries, value: "140", label: "Countries" },
];

const AchievementsSection = () => {
  return (
    <div className="achievements-section">
      <div className="achievements-container">
        {/* Phần tiêu đề */}
        <div className="achievements-header">
          <h2>Our 18 years of achievements</h2>
          <p>With all our love, we have achieved this</p>
        </div>

        {/* Grid chứa stats */}
        <div className="achievements-grid">
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, index) => (
              <Col key={index} xs={24} sm={12} md={12} lg={12}>
                <div className="achievement-item">
                  <div className="info">
                    <img src={stat.img} alt={stat.label} />
                    <p>{stat.value}</p>
                  </div>
                  <span>{stat.label}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AchievementsSection;
