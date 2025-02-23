import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Button, Col, Radio, Row, Skeleton, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import vnpayLogo from "../../assets/svg/vnpay-logo.svg"
import momoLogo from "../../assets/svg/momo-logo.svg"
import paypalLogo from "../../assets/svg/paypal-logo.svg"
import './Checkout.css'
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
const { Title, Text } = Typography;

function Checkout() {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  useEffect(() => {
    if (!location.state?.plan) {
      navigate('/pricing');
      return;
    }
  }, [location.state, navigate]);

  // Nếu không có plan, không render gì cả
  if (!location.state?.plan) {
    return null;
  }
  const { plan } = location.state;


  // Tính tổng tiền dựa trên plan
  const calculateTotal = () => {
    let basePrice = parseFloat(plan.price.replace('$', ''));
    // Nếu chọn PayPal, thêm phí 4.4% + $0.3
    if (paymentMethod === 'paypal') {
      basePrice = basePrice + (basePrice * 0.044) + 0.3;
    }
    return basePrice.toFixed(2);
  };
  return (
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
                      <Text strong>Ho Tran Tien</Text>
                    </div>
                    <div className='info-item'>
                      <Text type="secondary">Email</Text>
                      <Text strong>trantien100700@gmail.com</Text>
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
                      <Text strong>{plan.title}</Text>
                      <Text type="success">{plan.period}</Text>
                    </div>
                    <div className='plan-features'>
                      {plan.features.map((feature, index) => (
                        <Text key={index} type="secondary" className='feature-item'>
                          ✓ {feature}
                        </Text>
                      ))}
                    </div>
                    <div className='plan-price'>
                      <Text>Base Price:</Text>
                      <Text strong>{plan.price}</Text>
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
                    ${calculateTotal()}
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
                      value={'momo'}
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
                      value={'vnpay'}
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
                    <div style={{ height: `100%`, width: `100%` }}>
                      <Title level={2}>Overseas?</Title>
                    </div>
                    <div style={{ height: `100%`, width: `70%`, marginBottom: `10px` }}>
                      <Text>We will use
                        <span style={{ fontWeight: `bold` }}> VCB&apos;s latest currency transfer rate</span>.</Text>
                      <br />
                      <Text>Paypal also charges you additional fee of
                        <span style={{ fontWeight: `bold` }}> 4.4% rate </span>
                        + <span style={{ fontWeight: `bold` }}>0.3$ fixed fee</span> per transaction.
                      </Text>

                    </div>
                    <Radio
                      value={'paypal'}
                      style={{ visibility: 'hidden' }}
                    >
                      <figure className='checkout-payment-img-wrapper' style={{ width: `80px`, height: `80px`, marginTop: `0` }}>
                        <img
                          src={paypalLogo}
                          loading="lazy"
                          decoding="async"
                          alt="PAYPAL"
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
                  // onClick={handleOrder}
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
                <hr className='border-line' />

                {/* <Countdown style={{ width: `fit-content`, margin: `auto` }} title="Remaining Time" value={deadline} onFinish={handleTimerEnd} /> */}

              </div>
            </Skeleton>
          </Col>
        </Row>
      </div>

    </div>

  )
}

export default Checkout