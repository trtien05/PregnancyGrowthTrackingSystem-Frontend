import useDocumentTitle from '../../hooks/useDocumentTitle'
import banner from '../../assets/images/banner-verify.png'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import config from '../../config'
import './VerifyEmail.css'
import axiosClient from '../../utils/apiCaller'
import { LoadingOutlined } from '@ant-design/icons'

function VerifyEmail() {
  useDocumentTitle('PregnaJoy | Verify Email')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const { email } = location.state || {}

  // Check email before verify
  useEffect(() => {
    if (!email) {
      message.error('Email is required to verify OTP')
      navigate(config.routes.public.login)
    }
  }, [email, navigate])

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0]
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto advance to next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i]
      }
    }

    setOtp(newOtp)
    if (pastedData.length > 0 && pastedData.length < 6) {
      inputRefs[pastedData.length].current.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    try {
      setLoading(true)
      const response = await axiosClient.post(
        `/otp/validate-email?email=${encodeURIComponent(email)}&otp=${otpValue}`
      )
      if (response.code === 200) {
        messageApi.success(response.message)
        setTimeout(() => {
          navigate(config.routes.public.login)
        }, 2000)
      } else {
        messageApi.error(response.message)
      }
    } catch (error) {
      const { response } = error
      const { data } = response
      messageApi.error(data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="auth-container">
        <div className="auth-card-verify">
          <div>
            <img src={banner} width={300} alt="Verify Code" />
          </div>
          <div className="form-section">
            <h1 className="form-title-verify">Enter OTP Code </h1>
            <p className="form-description">Please check your email</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group-verify">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="form-input-otp"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <button type="submit" className="submit-button" disabled={otp.some((digit) => digit === '')}>
                {loading ? <LoadingOutlined style={{ color: 'white' }} spin /> : ' Verify OTP'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default VerifyEmail
