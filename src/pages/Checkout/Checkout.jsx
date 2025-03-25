import { CheckOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import { Button, Col, message, Radio, Row, Skeleton, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import vnpayLogo from "../../assets/svg/vnpay-logo.svg"
import momoLogo from "../../assets/svg/momo-logo.svg"
import './Checkout.css'
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axiosClient from '../../utils/apiCaller';
import cookieUtils from '../../utils/cookieUtils';
const { Title, Text } = Typography;



function Checkout() {
  const { user, role } = useAuth();
  const { id } = useParams();
  const [plan, setPlan] = useState({});
  const [messageApi, contextHolder] = message.useMessage()

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/membership-plans/${id}`);
        if (response.code === 200) {
          setPlan(response.data);
        } else {
          messageApi.error('Error: ' + response.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [id]);

  const features = [
    'Full access to all',
    'Priority customer support',
    'Cancel anytime with no extra charges',
    'All features unlocked',
    'Exclusive lifetime',
    'No recurring payments'
  ]

  const handleOrder = async () => {
    if (!user) {
      messageApi.error('Please login to continue');
      return;
    }
    if (role === 'ROLE_admin') {
      messageApi.error('Admin cannot buy plan');
      return;
    }
    try {
      setLoading(true);
      const response = await axiosClient.post(`/payment/order`,
        {
          provider: paymentMethod,
          membershipPlanId: id,
          userId: user.id
        }
      );
      cookieUtils.setItem('paymentData', JSON.stringify({
        paymentMethod: paymentMethod,
        planPrice: plan.price,
        planTitle: plan.title,
      }));
      if (response.code === 200) {
        setTimeout(() => {
          messageApi.success('Payment created successfully');
        }, 3000);
        window.location.href = response.data.paymentUrl;
      } else {
        messageApi.error('Error: ' + response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Format price function to convert number to format with dots and đ symbol
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0đ";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };
  console.log("plan", plan)
  console.log("user", user)
  return (
    <>
      {contextHolder}
      <div className='checkout-container'>
        <div className='checkout-section'>
          <Row gutter={[16, 16]}>
            <Col xl={13} lg={13} sm={24} xs={24}>
              <Skeleton loading={loading} style={{ backgroundColor: '#fff', padding: '27px 50px', margin: '50px 5px', borderRadius: '15px' }}>
                <div className='checkout-wrapper'>
                  {/* Thông tin user */}
                  <div className='user-info-section'>
                    <Title level={2}>User Information</Title>
                    <div className='info-grid'>
                      <div className='info-item'>
                        <Text type="secondary">Full Name</Text>
                        <Text strong>{user?.fullName || ""}</Text>
                      </div>
                      <div className='info-item'>
                        <Text type="secondary">Email</Text>
                        <Text strong>{user?.email || ""}</Text>
                      </div>
                      <div className='info-item'>
                        <Text type="secondary">Phone</Text>
                        <Text strong>{'0949447272' || 'Not provided'}</Text>
                      </div>
                    </div>
                  </div>

                  <hr className='border-line' />

                  {/* Thông tin đơn hàng */}
                  <div className='order-info-section'>
                    <Title level={2}>Order Details</Title>
                    <div className='plan-details'>
                      <div className='plan-header'>
                        <Text strong>{plan.name}</Text>
                        <Text type="success">{plan.durationMonths} months</Text>
                      </div>
                      <div className='plan-features'>
                        <ul className="features-list">
                          {id === '1' ?
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
                      </div>
                      <div className='plan-price'>
                        <Text>Base Price:</Text>
                        <Text strong>
                          {plan.price !== undefined ? formatPrice(plan.price) : "Loading..."}
                        </Text>
                      </div>
                    </div>
                  </div>

                  <hr className='border-line' />

                  {/* Tổng tiền */}
                  <div className='checkout-total'>
                    <Space direction='vertical'>
                      <Title level={2}>Total</Title>
                      <Text type="secondary">
                        {paymentMethod === 'paypal' &&
                          'Includes PayPal fee (4.4% + $0.3)'}
                      </Text>
                    </Space>
                    <Title level={2} type="success">
                      {plan.price !== undefined ? formatPrice(plan.price) : "Loading..."}
                    </Title>
                  </div>
                </div>
              </Skeleton>
            </Col>
            <Col xl={10} lg={10} sm={24} xs={24}>
              <Skeleton loading={loading} style={{ backgroundColor: '#fff', padding: '27px 30px', margin: '50px 5px', borderRadius: '15px' }}>
                <div className='checkout-wrapper'>
                  <Title level={2} >Payment method</Title>

                  <div className='checkout-payment'>

                    <Radio.Group
                      name="payment"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <Radio
                        value={'MOMO'}
                        style={{ visibility: 'hidden' }}
                      >
                        <figure className='checkout-payment-img-wrapper'>
                          <img
                            src={momoLogo}
                            loading="lazy"
                            decoding="async"
                            alt='MOMO'
                          />
                        </figure>
                      </Radio>
                      <Radio
                        value={'VNPAY'}
                        style={{ visibility: 'hidden' }}
                      >
                        <figure className='checkout-payment-img-wrapper'>
                          <img
                            src={vnpayLogo}
                            loading="lazy"
                            decoding="async"
                            alt="VNPAY"
                          />
                        </figure>
                      </Radio>

                    </Radio.Group>
                  </div>
                  <div className='btn-div'>
                    <Button
                      style={{ marginRight: '10px', width: `40%` }}
                      type="default"
                      size="large"
                    // onClick={handleCancel}
                    >
                      {loading ? (
                        <Loading3QuartersOutlined
                          spin
                          style={{ fontSize: '1.6rem' }}
                        />
                      ) : (
                        'Cancel'
                      )}
                    </Button>
                    <Button
                      style={{ marginRight: '10px', width: `60%` }}
                      type="primary"
                      size="large"
                      onClick={handleOrder}
                    >
                      {loading ? (
                        <Loading3QuartersOutlined
                          spin
                          style={{ fontSize: '1.6rem' }}
                        />
                      ) : (
                        'Pay'
                      )}
                    </Button>
                  </div>
                </div>
              </Skeleton>
            </Col>
          </Row>
        </div>

      </div>
    </>


  )
}

export default Checkout