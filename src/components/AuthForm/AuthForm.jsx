import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import banner from '../../assets/images/banner-signin.png'
import './AuthForm.css'
import cookieUtils from '../../utils/cookieUtils'
import config from '../../config'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import axiosClient from '../../utils/apiCaller'
import { LoadingOutlined } from '@ant-design/icons'

function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [messageApi, contextHolder] = message.useMessage()

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const [passwordError, setPasswordError] = useState('')

  // Hàm validate mật khẩu (password)
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/
    return passwordRegex.test(password)
  }

  const [emailError, setEmailError] = useState('') // Thêm state để theo dõi lỗi email

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    // Kiểm tra mật khẩu khi người dùng nhập vào
    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('Password must contain at least one uppercase letter, one number, and one special character.')
      } else {
        setPasswordError('')
      }
    }

    // Kiểm tra email khi người dùng nhập vào
    if (name === 'email') {
      if (!value.trim()) {
        setEmailError("Email is required.");
      } else if (!validateEmail(value)) {
        setEmailError("Invalid email address.");
      } else {
        setEmailError("");
      }
    }

  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(''); // Reset lỗi trước khi gửi request

    // Check if form data is valid before submission
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setPasswordError("Password is required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Create Base64 encoded credentials for Basic Auth
      const credentials = btoa(`${formData.email}:${formData.password}`);

      const response = await axiosClient.post('/auth/login', {}, {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      const data = response.data;
      const { token } = data;
      cookieUtils.setItem(config.cookies.token, token);
      messageApi.success('Logged in successfully');
      setTimeout(() => {
        navigate(config.routes.public.home);
      }, 2000);
    } catch (error) {
      console.log('Error: ', error);
      setLoading(false);

      if (error.response) {
        if (error.response.status === 401) {
          setPasswordError("Incorrect password. Please try again.");
        } else if (error.response.status === 404) {
          setEmailError("Email not found. Please check again.");
        } else {
          messageApi.error("Something went wrong. Please try again.");
        }
      } else {
        messageApi.error("Network error. Please check your connection.");
      }
    }
  }

  return (
    <>
      {contextHolder}
      <div className="auth-container">
        <div className="auth-card">
          {/* Form Section */}
          {/* Điều kiện hiển thị */}
          <div className="form-section">
            <h1 className="form-title">Sign In</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} className="form-input" />
                {emailError && <p className="error-message">{emailError}</p>}
              </div>

              <div className="form-group">
                <div className="password-group">
                  <label className="form-label">Password</label>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                    {showPassword ? (
                      <EyeOffIcon style={{ color: '#666666' }} size={16} />
                    ) : (
                      <EyeIcon style={{ color: '#666666' }} size={16} />
                    )}

                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="on"
                />
                {passwordError && <p className="error-message">{passwordError}</p>}
              </div>

              <div className="form-links">
                <a href={config.routes.public.register} className="form-link">
                  Don&apos;t have an account?
                </a>
                <a href={config.routes.public.forgotPassword} className="form-link">
                  Reset password
                </a>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? <LoadingOutlined style={{ color: 'white' }} spin /> : 'Sign in'}
              </button>

              <div className="divider">
                <span className="divider-text">OR</span>
              </div>

              <a href="http://localhost:8080/api/auth/callback/google/redirect">
                <button type="button" className="google-button">
                  <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google logo" width="20" height="20" />
                  Continue with Google
                </button>
              </a>
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


export default AuthForm
