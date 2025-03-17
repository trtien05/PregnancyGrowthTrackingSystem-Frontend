import { useEffect, useState } from 'react';
import {
  Layout,
  Typography,
  Card,
  Button,
  Modal,
  Radio,
  Space,
  Divider,
  Badge,
  Tag,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  CheckCircleFilled,
  CrownFilled,
  SafetyCertificateFilled,
} from '@ant-design/icons';
import './Subscription.css'
import axiosClient from '../../../../utils/apiCaller';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const SubscriptionPage = () => {
  const navigate = useNavigate();

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState('1');
  const [loading, setLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [pricingData, setPricingData] = useState([]);

  const isMonthlyPlan = subscriptionPlan?.amount === 400000;
  const currentPlan = isMonthlyPlan ? '1' : '2';
  const planColor = isMonthlyPlan ? '#52c41a' : '#ff7875';
  const planIcon = isMonthlyPlan ? <SafetyCertificateFilled /> : <CrownFilled />;
  const planName = isMonthlyPlan ? 'Each Month' : 'Lifetime Package';
  const planPeriod = isMonthlyPlan ? '1 month' : '10 months';


  useEffect(() => {
    const fetchSubscriptionPlan = async () => {
      try {
        const response = await axiosClient.get('/orders/latest');
        if(response.code === 200) {
          setSubscriptionPlan(response.data);
        }
      }
      catch (error) {
        console.error('Error fetching subscription plan:', error);
      } finally {
        setLoading(false);
      }
    }
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get('/membership-plans/active');
        if (response.code === 200) {
          setPricingData(response.data);
        } else {
          console.log('Error: ', response.message)
        }
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
    fetchSubscriptionPlan();
  }, []);

  const features = [
    'Full access to all',
    'Priority customer support',
    'Cancel anytime with no extra charges',
    'All features unlocked',
    'Exclusive lifetime',
    'No recurring payments'
  ]

  const monthlyFeatures = features.slice(0, 3);
  const lifetimeFeatures = features.slice(3);
  const currentFeatures = isMonthlyPlan ? monthlyFeatures : lifetimeFeatures;

  const formatPrice = (price) => {
    if (!price) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(price) + ' VNĐ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpdatePlan = () => {
    const selectedPlanObj = pricingData.find(plan => plan.id.toString() === selectedPlan);
    console.log('Selected plan:', selectedPlanObj);
    if (selectedPlanObj) {
      navigate(`/checkout/${selectedPlanObj.id}`);
    }
    setIsUpdateModalVisible(false);
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
  };

  return (
    <Layout className={'layout-subscription'}>
      <Content className={'content-subscription'}>
        <div className={'container-subscription'}>
          <div className={'page-header-subscription'}>
            <div>
              <Title level={2} className={'page-title-subscription'}>
                Your Subscription
              </Title>
              <Text type="secondary">
                Manage your pregnancy tracking subscription
              </Text>
            </div>
            <div className={'header-actions-subscription'}>
              {currentPlan === '2' ? (
                <Tooltip title="You are at the highest plan">
                  <Button
                    type="primary"
                    size="large"
                    disabled={true}
                  >
                    Update Plan
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setIsUpdateModalVisible(true)}
                  className={'update-button-subscription'}
                >
                  Update Plan
                </Button>
              )}
            </div>
          </div>

          <Card className={'current-plan-card-subscription'}>
            <div className={'plan-header-subscription'}>
              <div
                className={'plan-badge-subscription'}
                style={{ backgroundColor: planColor }}
              >
                {planIcon}
              </div>
              <div className={'plan-info-subscription'}>
                <div className={'plan-name-container-subscription'}>
                  <Title level={3} className={'plan-name-subscription'}>
                    {planName}
                  </Title>
                  <Badge
                    status="success"
                    text="Active"
                    className={'status-badge-subscription'}
                  />
                </div>
                <div className={'plan-price-subscription'}>
                  <Text className={'price-subscription'}>
                    {subscriptionPlan?.amount ? formatPrice(subscriptionPlan.amount) : ''}
                  </Text>
                  <Text type="secondary" className={'period-subscription'}>
                    /{planPeriod}
                  </Text>
                </div>
                
              </div>
              <div className={'subscription-dates'}>
                <Text type="secondary">
                  Start: <Text strong>{formatDate(subscriptionPlan?.startDate)}</Text> - 
                  End:  <Text strong>{formatDate(subscriptionPlan?.endDate)}</Text>
                </Text>
              </div>
            </div>

            <Divider className={'divider-subscription'} />

            <div className={'plan-features-subscription'}>
              <Title level={4} className={'features-title-subscription'}>
                Plan Features
              </Title>
              <Row gutter={[24, 16]} className={'features-grid-subscription'}>
                {currentFeatures.map((feature, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <div className={'feature-item-subscription'}>
                      <CheckCircleFilled
                        className={'feature-icon-subscription'}
                        style={{ color: planColor }}                     
                      />
                      <Text>{feature}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </div>
      </Content>

      {/* Update Plan Modal */}
      <Modal
        title="Update Your Subscription Plan"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsUpdateModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleUpdatePlan}
            disabled={selectedPlan === currentPlan}
          >
            Update Plan
          </Button>,
        ]}
        width={700}
        className={'plan-modal-subscription'}
      >
        <Paragraph className={'modal-description-subscription'}>
          Choose the plan that best fits your pregnancy journey. You can change
          your plan at any time.
        </Paragraph>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading pricing plans...</div>
        ) : (
          <Radio.Group
            onChange={handlePlanChange}
            value={selectedPlan}
            className={'plan-radio-group-subscription'}
          >
            <Space direction="vertical" className={'plan-options-subscription'}>
              {pricingData.map((plan) => (
                <Radio
                  key={plan.id}
                  value={plan.id.toString()}
                  className={'plan-option-subscription'}
                >
                  <Card
                    className={`plan-selection-card-subscription ${
                      selectedPlan === plan.id.toString() ? 'selected-plan-card-subscription' : ''
                    }`}
                    bordered={false}
                  >
                    <div className={'plan-selection-header-subscription'}>
                      <div>
                        <div className={'plan-selection-title-subscription'}>
                          <Text strong className={'plan-name-subscription'}>
                            {plan.name}
                          </Text>
                          {plan.popular && <Tag color="gold">RECOMMENDED</Tag>}
                        </div>
                        <div className={'plan-selection-price-subscription'}>
                          <Text className={'price-subscription'}>{formatPrice(plan.price)}</Text>
                          <Text type="secondary" className={'period-subscription'}>
                            /{plan.durationMonths} {plan.durationMonths > 1 ? 'months' : 'month'}
                          </Text>
                        </div>
                      </div>
                      <div
                        className={'plan-icon-subscription'}
                        style={{ backgroundColor: plan.durationMonths === 1 ? '#52c41a' : '#ff7875' }}
                      >
                        {plan.durationMonths === 1 ? <SafetyCertificateFilled /> : <CrownFilled />}
                      </div>
                    </div>

                    <div className={'plan-selection-features-subscription'}>
                      {(plan.durationMonths === 1 ? monthlyFeatures : lifetimeFeatures).map((feature, index) => (
                        <div key={index} className={'plan-selection-feature-subscription'}>
                          <CheckCircleFilled
                            className={'feature-icon-subscription'}
                            style={{ color: plan.durationMonths === 1 ? '#52c41a' : '#ff7875' }}
                          />
                          <Text>{feature}</Text>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
      </Modal>
    </Layout>
  );
};

export default SubscriptionPage;
