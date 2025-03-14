import React, { useState } from 'react';
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
  notification,
} from 'antd';
import {
  CheckCircleFilled,
  CrownFilled,
  SafetyCertificateFilled,
  RocketFilled,
  CloseCircleOutlined,
} from '@ant-design/icons';
import './Subscription.css'


const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;


const SubscriptionPage = () => {
  const [currentPlan, setCurrentPlan] = useState('premium');
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] =
    useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading] = useState(false);

  const subscriptionPlans= [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 4.99,
      period: 'month',
      features: [
        'Weekly pregnancy updates',
        'Basic pregnancy tracker',
        'Limited articles access',
        'Email support',
      ],
      icon: <SafetyCertificateFilled />,
      color: '#52c41a',
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 9.99,
      period: 'month',
      features: [
        'Daily pregnancy updates',
        'Advanced pregnancy tracker',
        'Full articles access',
        'Nutrition guidance',
        'Personalized tips',
        'Priority support',
        'Symptom tracker',
      ],
      recommended: true,
      icon: <CrownFilled />,
      color: '#ff7875',
    },
    {
      id: 'annual',
      name: 'Annual Premium',
      price: 89.99,
      period: 'year',
      features: [
        'All Premium features',
        'Save 25% compared to monthly',
        'Exclusive content',
        'Priority support',
        'Baby development videos',
        'Personalized birth plan',
        'Expert Q&A access',
      ],
      icon: <RocketFilled />,
      color: '#722ed1',
    },
  ];

  const handleUpdatePlan = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(selectedPlan);
      setLoading(false);
      setIsUpdateModalVisible(false);

      notification.success({
        message: 'Plan Updated',
        description: `You have successfully updated to the ${
          subscriptionPlans.find((plan) => plan.id === selectedPlan)?.name
        }.`,
        placement: 'topRight',
      });
    }, 1500);
  };

  const handleCancelPlan = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsCancelModalVisible(false);

      notification.info({
        message: 'Subscription Canceled',
        description:
          'Your subscription has been canceled. You will still have access until the end of your billing period.',
        placement: 'topRight',
      });
    }, 1500);
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
  };

  const getCurrentPlan = () => {
    return subscriptionPlans.find((plan) => plan.id === currentPlan);
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
              <Button
                type="primary"
                size="large"
                onClick={() => setIsUpdateModalVisible(true)}
                className={'update-button-subscription'}
              >
                Update Plan
              </Button>
              <Button
                danger
                size="large"
                onClick={() => setIsCancelModalVisible(true)}
              >
                Cancel Plan
              </Button>
            </div>
          </div>

          <Card className={'current-plan-card-subscription'}>
            <div className={'plan-header-subscription'}>
              <div
                className={'plan-badge-subscription'}
                style={{ backgroundColor: getCurrentPlan()?.color }}
              >
                {getCurrentPlan()?.icon}
              </div>
              <div className={'plan-info-subscription'}>
                <div className={'plan-name-container-subscription'}>
                  <Title level={3} className={'plan-name-subscription'}>
                    {getCurrentPlan()?.name}
                  </Title>
                  <Badge
                    status="success"
                    text="Active"
                    className={'status-badge-subscription'}
                  />
                </div>
                <div className={'plan-price-subscription'}>
                  <Text className={'price-subscription'}>
                    ${getCurrentPlan()?.price}
                  </Text>
                  <Text type="secondary" className={'period-subscription'}>
                    per {getCurrentPlan()?.period}
                  </Text>
                </div>
              </div>
            </div>

            <Divider className={'divider-subscription'} />

            <div className={'plan-features-subscription'}>
              <Title level={4} className={'features-title-subscription'}>
                Plan Features
              </Title>
              <Row gutter={[24, 16]} className={'features-grid-subscription'}>
                {getCurrentPlan()?.features.map((feature, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <div className={'feature-item-subscription'}>
                      <CheckCircleFilled
                        className={'feature-icon-subscription'}
                        style={{ color: getCurrentPlan()?.color }}
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

        <Radio.Group
          onChange={handlePlanChange}
          value={selectedPlan}
          className={'plan-radio-group-subscription'}
        >
          <Space direction="vertical" className={'plan-options-subscription'}>
            {subscriptionPlans.map((plan) => (
              <Radio
                key={plan.id}
                value={plan.id}
                className={'plan-option-subscription'}
              >
                <Card
                  className={`${'plan-selection-card-subscription'} ${
                    selectedPlan === plan.id ? 'selected-plan-card-subscription' : ''
                  }`}
                  bordered={false}
                >
                  <div className={'plan-selection-header-subscription'}>
                    <div>
                      <div className={'plan-selection-title-subscription'}>
                        <Text strong className={'plan-name-subscription'}>
                          {plan.name}
                        </Text>
                        {plan.recommended && (
                          <Tag color="gold">RECOMMENDED</Tag>
                        )}
                      </div>
                      <div className={'plan-selection-price-subscription'}>
                        <Text className={'price-subscription'}>${plan.price}</Text>
                        <Text type="secondary" className={'period-subscription'}>
                          per {plan.period}
                        </Text>
                      </div>
                    </div>
                    <div
                      className={'plan-icon-subscription'}
                      style={{ backgroundColor: plan.color }}
                    >
                      {plan.icon}
                    </div>
                  </div>

                  <div className={'plan-selection-features-subscription'}>
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className={'plan-selection-feature-subscription'}>
                        <CheckCircleFilled
                          className={'feature-icon-subscription'}
                          style={{ color: plan.color }}
                        />
                        <Text>{feature}</Text>
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <Text type="secondary" className={'more-features-subscription'}>
                        +{plan.features.length - 3} more features
                      </Text>
                    )}
                  </div>
                </Card>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Modal>

      {/* Cancel Plan Modal */}
      <Modal
        title="Cancel Your Subscription"
        open={isCancelModalVisible}
        onCancel={() => setIsCancelModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsCancelModalVisible(false)}>
            Keep Subscription
          </Button>,
          <Button
            key="submit"
            danger
            loading={loading}
            onClick={handleCancelPlan}
          >
            Confirm Cancellation
          </Button>,
        ]}
        className={'cancel-modal-subscription'}
      >
        <div className={'cancel-modal-content-subscription'}>
          <div className={'cancel-icon-subscription'}>
            <CloseCircleOutlined />
          </div>
          <Title level={4}>Are you sure you want to cancel?</Title>
          <Paragraph>If you cancel your subscription:</Paragraph>
          <ul className={'cancel-list-subscription'}>
            <li>
              You will lose access to all premium features at the end of your
              billing period
            </li>
            <li>Your subscription will remain active until March 15, 2024</li>
            <li>You can resubscribe at any time</li>
          </ul>
          <Paragraph type="secondary" className={'cancel-note-subscription'}>
            We're sorry to see you go! If you're having any issues with your
            subscription, our support team is always here to help.
          </Paragraph>
        </div>
      </Modal>
    </Layout>
  );
};

export default SubscriptionPage;
