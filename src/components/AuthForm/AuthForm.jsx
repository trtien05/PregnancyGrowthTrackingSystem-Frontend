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
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [messageApi, contextHolder] = message.useMessage()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axiosClient.post('/auth/login', {}, { auth: formData })
      const data = response.data
      const { token } = data
      cookieUtils.setItem(config.cookies.token, token)
      messageApi.success('Logged in successfully')
      setTimeout(() => {
        navigate(config.routes.public.home)
      }, 2000)
    } catch (error) {
      console.log('Error: ', error)
    } finally {
      setLoading(false)
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
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" />
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
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
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
