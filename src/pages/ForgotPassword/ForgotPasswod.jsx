import { message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../../utils/apiCaller'
import { LoadingOutlined } from '@ant-design/icons'
import banner from '../../assets/images/banner-signin.png'
import config from '../../config'
import { MAX_COUNTDOWN_TIME } from '../../config/constant'
function ForgotPasswod() {
  const [formData, setFormData] = useState({
    email: '',
  })
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(0);

  const [messageApi, contextHolder] = message.useMessage()
  // Handle countdown
  useEffect(() => {
    const timerId = setInterval(() => {
      if (seconds <= 0) return;

      setSeconds((prevSeconds) => {
        const updatedSeconds = prevSeconds - 1;
        localStorage.setItem(config.localStorage.seconds, updatedSeconds.toString());
        return updatedSeconds;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds]);
  // Check if seconds already in localStorage
  useEffect(() => {
    const storedSeconds = localStorage.getItem(config.localStorage.seconds);
    if (storedSeconds) setSeconds(parseInt(storedSeconds));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSeconds(MAX_COUNTDOWN_TIME);
      localStorage.setItem(config.localStorage.seconds, MAX_COUNTDOWN_TIME.toString());

      //Fetch API
      const responseEmail = await axiosClient.post(`/otp/generate?email=${encodeURIComponent(formData.email)}`)
      if (responseEmail.code === 200) {
        messageApi.success(`Verify your email: ${responseEmail.message}`)
        setTimeout(() => {
          navigate(config.routes.public.verifyEmail, { state: { email: formData.email } })

        }, 2000)
      } else {
        messageApi.error(responseEmail.message)
      }

    } catch (error) {
      const { response } = error
      const { data } = response


      messageApi.error(data.message)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="auth-container">
        <div className="auth-card">
          {/* Form Section */}
          {/* Điều kiện hiển thị */}
          <div className="form-section-forgot">
            <h1 className="form-title">Forgot Password?</h1>
            <div className="forgot-password-desc-wrapper">
              <div className="forgot-password-text">
                {seconds !== 0 && (
                  <span>
                    Not receiving emails? Resend after
                    <span className="forgot-password-countdown">{seconds}</span>s
                  </span>
                )}
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} className="form-input" />
              </div>




              <button type="submit" className="submit-button" disabled={seconds !== 0}>
                {seconds !== 0 ? <LoadingOutlined style={{ color: 'white' }} spin /> : 'Reset Password'}
              </button>
              <div className="form-redirect">
                <span>Return to login?</span>
                <a href="/login" className="form-redirect-link">Login</a>
              </div>

            </form>
          </div>
          {/* Image Section */}
          <div className="image-section">
            <img src={banner} alt="Mother and child illustration" />
            <div className="banner-text">
              <p>Every pregnancy is special.</p>
              <p>Let&apos;s make yours extraordinary!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswod