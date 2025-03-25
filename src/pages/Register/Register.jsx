import { useState } from 'react'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import './Register.css'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import config from '../../config'
import axiosClient from '../../utils/apiCaller'
import { LoadingOutlined } from '@ant-design/icons'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

function Register() {
  useDocumentTitle('PregnaJoy | Register')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [messageApi, contextHolder] = message.useMessage()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setConfirmShowPassword] = useState(false)


  const [fullnameError, setFullnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const validateFullname = (fullname) => {
    const trimmedName = fullname.trim();
    return trimmedName.length > 0 && trimmedName.length <= 20;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/
    return passwordRegex.test(password);
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validate email
    if (name === 'email') {
      if (!validateEmail(value)) {
        setEmailError("Invalid email address.");
      } else {
        setEmailError('');
      }
    }

    // Validate full name
    if (name === 'fullName') {
      if (!validateFullname(value)) {
        setFullnameError("Full name must be between 1 and 20 characters.");
      } else {
        setFullnameError('');
      }
    }

    // Validate password
    // Validate password
    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError("Password must contain at least one uppercase letter, one number, and one special character.");
      } else {
        setPasswordError('');
      }
    }

    // Validate confirm password
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setConfirmPasswordError("Passwords do not match.");
        setPasswordMatch(false);
      } else {
        setConfirmPasswordError('');
        setPasswordMatch(true);
      }
    }
  };


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
              {fullnameError && <p className="error-message">{fullnameError}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
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
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
                autoComplete="new-password" // Thêm thuộc tính này
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>

            <div>
              {/* <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label> */}
              <div className="password-group">
                <label className="form-label">Confirm Password</label>
                <button type="button" onClick={() => setConfirmShowPassword(!showConfirmPassword)} className="password-toggle">
                  {showConfirmPassword ? (
                    <EyeOffIcon style={{ color: '#666666' }} size={16} />
                  ) : (
                    <EyeIcon style={{ color: '#666666' }} size={16} />
                  )}
                  <span>{showConfirmPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${!passwordMatch ? 'password-mismatch' : ''}`}
                required
                autoComplete="new-password" // Thêm thuộc tính này
              />
              {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
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
