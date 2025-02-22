import { Row, Col } from 'antd'
import quote from '../../assets/images/quote.png'
import quote_small from '../../assets/images/quote_small.png'
import './TestimonialsSection.css'

// eslint-disable-next-line react/prop-types
const TestimonialCard = ({ text, author, info, className }) => (
  <div className={`testimonial-card ${className}`}>
    <div>
      <img src={quote_small} alt="quote" />
    </div>
    <div className="testimonial-content">
      <div>
        <p className="testimonial-text">{text}</p>
      </div>
      <div>
        <h4 className="testimonial-author">{author}</h4>
        <p className="testimonial-info">{info}</p>
      </div>
    </div>
  </div>
)

const TestimonialsSection = () => {
  return (
    <div className="testimonials-section">
      <div className="testimonials-container">
        <div className="quote-image">
          <img src={quote} alt="Quote" />
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <div className="header-section">
              <h2 className="header-title">
                Real Stories from
                <br />
                Real Customers
              </h2>
              <p className="header-subtitle">Get inspired by these stories.</p>
            </div>
            <div className="left-column">
              <TestimonialCard
                text="This platform makes me feel so supported. It's like having a personal pregnancy assistant and a community of moms all in one place!"
                author="Emma L."
                info="28, First-time mom, California, USA"
                className="card-small"
              />
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="right-column">
              <TestimonialCard
                text="PregnaJoy has been a lifesaver during my pregnancy! The growth tracking charts help me monitor my baby's progress, and the reminders ensure I never miss an important check-up. Highly recommend for any expecting parent!"
                author="Rachel K."
                info="31, 7 months pregnant, Amsterdam, Netherlands"
                className="card-large"
              />

              <div style={{ marginTop: '32px' }}>
                <TestimonialCard
                  text="I love seeing my baby's weekly progress! The growth charts help me stay informed, and the system even alerts me if something seems off."
                  author="Jessica P."
                  info="30, First-time mom, Toronto, Canada"
                  className="card-small"
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default TestimonialsSection
