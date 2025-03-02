import { Card, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import './Pricing.css';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const pricingData = [
    {
      title: 'Each Month',
      price: '400.000đ',
      period: '/month',
      features: [
        'Full access to all',
        'Priority customer support',
        'Cancel anytime with no extra charges'
      ],
      buttonText: 'Choose plan',
      type: 'monthly',
      popular: true
    },
    {
      title: 'Lifetime Package',
      price: '4.000.000đ',
      period: '/forever',
      features: [
        'All features unlocked',
        'Exclusive lifetime',
        'No recurring payments'
      ],
      buttonText: 'Choose plan',
      type: 'lifetime'
    },

  ];

  const handleChoosePlan = (plan) => {
    navigate('/checkout', { state: { plan } });
  }

  return (
    <div className="pricing-container">
      <div className="pricing-section">
        <div className="pricing-header">
          <h1>Features & Pricing</h1>
          <p>Whether your time-saving automation needs are large or small, we&apos;re here to help you scale.</p>
        </div>

        <div className="pricing-cards">
          {pricingData.map((plan, index) => (
            <Card
              key={index}
              className={`pricing-card ${plan.type} ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && <div className="popular-tag">POPULAR</div>}
              <div className="price-section">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <h3 className="plan-title">{plan.title}</h3>
              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckOutlined className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="choose-plan-btn" type="primary" onClick={() => handleChoosePlan(plan)}>
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Pricing;