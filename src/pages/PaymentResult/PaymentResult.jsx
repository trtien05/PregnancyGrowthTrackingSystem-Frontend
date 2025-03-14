import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, Loading3QuartersOutlined } from '@ant-design/icons';
import { Button, Col, Result, Row, Typography, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/apiCaller';
import cookieUtils from '../../utils/cookieUtils';
import './PaymentResult.css';
import config from '../../config';

const { Title, Text, Paragraph } = Typography;

function PaymentResult() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);

  // Extract URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
  const vnp_TxnRef = urlParams.get("vnp_TxnRef");
  const orderId = urlParams.get("orderId");

  useEffect(() => {

    const verifyPayment = async () => {
      try {
        setLoading(true);

        // Get stored payment data from cookies
        const storedPaymentData = cookieUtils.getItem('paymentData');
        const paymentData = storedPaymentData ? JSON.parse(storedPaymentData) : null;

        if (paymentData) {
          setPaymentDetails(paymentData);
        }

        // For VNPay, check response code
        if (vnp_ResponseCode) {
          if (vnp_ResponseCode === "00") {
            // Verify with backend
            const response = await axiosClient.get('/payment/check/vnpay', {
              params: {
                vnp_TxnRef
              }
            });

            if (response.code === 200) {
              setPaymentStatus('success');
              cookieUtils.removeItem('paymentData');
              
              // Update payment status in the user's token instead of replacing the token
              const currentToken = cookieUtils.getItem(config.cookies.token);
              if (currentToken && response.data.token) {
                // Merge the existing token with the new payment information
                // This assumes the server returns only the updated fields in response.token
                const updatedToken = response.data.token;
                cookieUtils.setItem(config.cookies.token, updatedToken);
              } 
            } else {
              setPaymentStatus('failed');
              setError(response.message || 'Payment verification failed');
            }
          } else {
            setPaymentStatus('failed');
            setError('Payment was canceled or declined');
          }
        } else if (orderId) {
          // Handle other payment methods verification here
          const response = await axiosClient.get('/payment/check/momo', {
            params: { orderId }
          });

          if (response.code === 200) {
            cookieUtils.removeItem('paymentData');
            
            // Update payment status in the user's token instead of replacing the token
            const currentToken = cookieUtils.getItem(config.cookies.token);
            if (currentToken && response.token) {
              // Merge the existing token with the new payment information
              const updatedToken = response.data.token;
              cookieUtils.setItem(config.cookies.token, updatedToken);
            }
            setPaymentStatus('success');
          } else {
            setPaymentStatus('failed');
            setError(response.message || 'Payment verification failed');
          }
        } else {
          setPaymentStatus('failed');
          setError('No payment information found');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        setError('An error occurred while verifying payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();

    // Clean up payment data from cookies after verification
    return () => {
      cookieUtils.removeItem('paymentData');
    };
  }, [vnp_ResponseCode, vnp_TxnRef, orderId]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewSubscription = () => {
    navigate('/profile');
  };

  const handleTryAgain = () => {
    navigate('/pricing');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="payment-result-container">
        <div className="payment-result-section">
          <div className="payment-loading-indicator">
            <Loading3QuartersOutlined spin style={{ fontSize: '3rem', color: '#1890ff' }} />
            <Title level={3} style={{ marginTop: '16px' }}>Verifying your payment...</Title>
            <Paragraph>Please wait while we confirm your transaction.</Paragraph>
          </div>
        </div>
      </div>
    );
  }
  // No payment data state
  if (paymentStatus === 'no_data') {
    return (
      <div className="payment-result-container">
        <div className="payment-result-section">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="payment-result-wrapper no-data">
                <Result
                  icon={<ExclamationCircleFilled style={{ color: '#faad14', fontSize: '72px' }} />}
                  title="No Payment Data"
                  subTitle={error || "We couldn't find any payment information."}
                />

                <div className="payment-error-message warning">
                  <Paragraph>
                    This usually happens when:
                  </Paragraph>
                  <ul>
                    <li>The page was reloaded after payment</li>
                    <li>You accessed this page directly without making a payment</li>
                    <li>Your payment session has expired</li>
                  </ul>
                </div>

                <div className="payment-actions">
                  <Space size="middle">
                    <Button type="default" size="large" onClick={handleGoHome}>
                      Go to Homepage
                    </Button>
                    <Button type="primary" size="large" onClick={handleTryAgain}>
                      Go to Pricing
                    </Button>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  // Payment successful result
  if (paymentStatus === 'success') {
    return (
      <div className="payment-result-container">
        <div className="payment-result-section">
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="payment-result-wrapper success">
                <Result
                  icon={<CheckCircleFilled style={{ color: '#52c41a', fontSize: '72px' }} />}
                  title="Payment Successful!"
                  subTitle="Your transaction has been completed successfully."
                />

                {paymentDetails && (
                  <div className="payment-details">
                    <Title level={4}>Payment Details</Title>
                    <div className="details-grid">
                      <div className="details-item">
                        <Text type="secondary">Plan</Text>
                        <Text strong>{paymentDetails.planTitle}</Text>
                      </div>
                      <div className="details-item">
                        <Text type="secondary">Amount</Text>
                        <Text strong>{paymentDetails.planPrice}</Text>
                      </div>
                      <div className="details-item">
                        <Text type="secondary">Payment Method</Text>
                        <Text strong>{paymentDetails.paymentMethod.toUpperCase()}</Text>
                      </div>
                      <div className="details-item">
                        <Text type="secondary">Transaction ID</Text>
                        <Text strong>{vnp_TxnRef || orderId || 'N/A'}</Text>
                      </div>
                      <div className="details-item">
                        <Text type="secondary">Date</Text>
                        <Text strong>{new Date().toLocaleString()}</Text>
                      </div>
                    </div>
                  </div>
                )}

                <div className="payment-actions">
                  <Space size="middle">
                    <Button type="default" size="large" onClick={handleGoHome}>
                      Go to Homepage
                    </Button>
                    <Button size="large" style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none' }} onClick={handleViewSubscription}>
                      View My Subscription
                    </Button>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  // Payment failed result
  return (
    <div className="payment-result-container">
      <div className="payment-result-section">
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="payment-result-wrapper failed">
              <Result
                icon={<CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '72px' }} />}
                title="Payment Failed"
                subTitle={error || "Your payment could not be processed."}
              />

              {paymentDetails && (
                <div className="payment-attempted">
                  <Title level={4}>Payment Attempt Details</Title>
                  <div className="details-grid">
                    <div className="details-item">
                      <Text type="secondary">Plan</Text>
                      <Text strong>{paymentDetails.planTitle}</Text>
                    </div>
                    <div className="details-item">
                      <Text type="secondary">Amount</Text>
                      <Text strong>{paymentDetails.planPrice}</Text>
                    </div>
                    <div className="details-item">
                      <Text type="secondary">Payment Method</Text>
                      <Text strong>{paymentDetails.paymentMethod.toUpperCase()}</Text>
                    </div>
                  </div>
                </div>
              )}

              <div className="payment-error-message">
                <Paragraph type="danger">
                  {error || "We apologize for the inconvenience. Please try again or contact support if the problem persists."}
                </Paragraph>
              </div>

              <div className="payment-actions">
                <Space size="middle">
                  <Button type="default" size="large" onClick={handleGoHome}>
                    Go to Homepage
                  </Button>
                  <Button type="primary" danger size="large" onClick={handleTryAgain}>
                    Try Again
                  </Button>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PaymentResult;