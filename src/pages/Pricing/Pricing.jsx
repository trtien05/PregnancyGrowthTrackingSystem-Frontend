import { Card, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import './Pricing.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../utils/apiCaller'

// Format price function to convert number to format with dots and đ symbol
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const Pricing = () => {
  const navigate = useNavigate();
  const [pricingData, setPringData] = useState([]);

  useEffect(() => {
    const fetchPlan = async () => {
      const response = await axiosClient.get('/membership-plans/active');
      if (response.code === 200) {
        setPringData(response.data);

      } else {
        console.log('Error: ', response.message)
      }
    }
    fetchPlan();
  }, []);

  const features = [
    'Full access to all',
    'Priority customer support',
    'Cancel anytime with no extra charges',
    'All features unlocked',
    'Exclusive lifetime',
    'No recurring payments'
  ]

  const handleChoosePlan = (planId) => {
    navigate(`/checkout/${planId}`);
  }

  return (
    <div className="pricing-container">
      <div className="pricing-section">
        <div className="pricing-header">
          <h1>Features & Pricing</h1>
          <p>Whether your time-saving automation needs are large or small, we&apos;re here to help you scale.</p>
        </div>

        <div className="pricing-cards">
          {pricingData?.map((plan, index) => (
            <Card
              key={index}
              className={`pricing-card ${plan.id === 1 ? 'popular' : ''}`}
            >
              {plan.popular && <div className="popular-tag">POPULAR</div>}
              <div className="price-section">
                <span className="price">{formatPrice(plan.price)}</span>
                <span className="period">/{plan.durationMonths} month</span>
              </div>
              <h3 className="plan-title">{plan.name}</h3>
              <ul className="features-list">
                {index === 0 ?
                  // First plan - display first 3 features
                  features.slice(0, 3).map((feature, idx) => (
                    <li key={idx}>
                      <CheckOutlined className="check-icon" />
                      {feature}
                    </li>
                  ))
                  :
                  // Second plan - display remaining 3 features
                  features.slice(3).map((feature, idx) => (
                    <li key={idx}>
                      <CheckOutlined className="check-icon" />
                      {feature}
                    </li>
                  ))
                }
              </ul>
              <Button className="choose-plan-btn" type="primary" onClick={() => handleChoosePlan(plan.id)}>
                Choose plan
              </Button>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Pricing;