import { useState } from 'react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import './Register.css'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import config from '../../config'
import axiosClient from '../../utils/apiCaller'
import { LoadingOutlined } from '@ant-design/icons'

function Register() {
  useDocumentTitle('PregnaJoy | Register')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword)
      } else {
        setPasswordMatch(value === formData.password)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false)
      return
    }
    const newData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    }
    try {
      setLoading(true)
      const response = await axiosClient.post('/auth/register', newData)
      const data = response.data
      if (response.code === 200) {
        const responseEmail = await axiosClient.post(`/otp/generate?email=${encodeURIComponent(data.email)}`)
        messageApi.success(`Verify your email: ${responseEmail.message}`)
        setTimeout(() => {
          navigate(config.routes.public.verifyEmail, { state: { email: formData.email } })
        }, 2000)
      }
    } catch (error) {
      console.log('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Create an account</h1>
            <a href="/login" className="form-link ">
              Have an account?
            </a>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required autoComplete="username" />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
                autoComplete="new-password" // Thêm thuộc tính này
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${!passwordMatch ? 'password-mismatch' : ''}`}
                required
                autoComplete="new-password" // Thêm thuộc tính này
              />
              {!passwordMatch && <p className="error-message">Passwords do not match</p>}
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="checkbox-input"
                required
              />
              <label htmlFor="agreeToTerms" className="checkbox-label">
                By creating an account, I agree to our <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <LoadingOutlined style={{ color: 'white' }} spin /> : 'Create an account'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
