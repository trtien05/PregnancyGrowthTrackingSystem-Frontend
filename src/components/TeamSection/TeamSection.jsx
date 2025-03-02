import { Row, Col } from 'antd'
import avatar1 from '../../assets/images/avatar.png'
import avatar2 from '../../assets/images/avatar_1.png'
import avatar3 from '../../assets/images/avatar_2.png'
import elipse from '../../assets/images/elipse.png'
import './TeamSection.css'

// eslint-disable-next-line react/prop-types
const TeamMember = ({ imgSrc, title }) => (
  <div className="team-card">
    <div className="image-container">
      <img src={imgSrc} alt="Medical Professional" className="member-image" />
    </div>
    <div className="member-info">
      <h3 className="member-name">John Doe</h3>
      <p className="member-title">{title}</p>
    </div>
  </div>
)

const TeamSection = () => {
  const teamMembers = [
    {
      title: 'Professor',
      imgSrc: avatar3
    },
    {
      title: 'Professor',
      imgSrc: avatar1
    },
    {
      title: 'Professor',
      imgSrc: avatar2
    }
  ]

  return (
    <div className="team-section">
      <div className="team-container">
        <div className="section-header">
          <div className="header-content">
            <h2 className="header-title-team">Your pregnancy journey,</h2>
            <p className="header-subtitle-team">guided with care and precision</p>
          </div>
        </div>

        <div className="elipse-image">
          <img src={elipse} alt="Elipse" width={693} height={693} />
        </div>

        <Row gutter={[0, 32]} justify="center">
          {teamMembers.map((member, index) => (
            <Col xs={24} md={12} lg={8} key={index} style={{ display: 'flex', justifyContent: 'center' }}>
              <TeamMember {...member} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default TeamSection
