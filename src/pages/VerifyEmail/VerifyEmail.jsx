import useDocumentTitle from "../../hooks/useDocumentTitle";
import banner from "../../assets/images/banner-verify.png"
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import config from "../../config";
import './VerifyEmail.css';

function VerifyEmail() {
  useDocumentTitle('PregnaJoy | Verify Email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state || {};

  // Check email before verify
  useEffect(() => {
    if (!email) {
      message.error('Email is required to verify OTP');
      navigate(config.routes.public.login);
    }
  }, [email, navigate]);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];


  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0]; // Only take the first character if multiple characters are pasted
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance to next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);
    if (pastedData.length > 0 && pastedData.length < 6) {
      inputRefs[pastedData.length].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/otp/validate-email?email=${encodeURIComponent(email)}&otp=${otpValue}`);
      if (response.status === 200) {
        messageApi.success(response.data.message);
        setTimeout(() => {
          navigate(config.routes.public.login);
        }, 2000);
      }
    } catch (error) {
      console.log("Error: ", error);
    }

  };

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
              <button type="submit" className="submit-button"
                disabled={otp.some(digit => digit === '')}
              >
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default VerifyEmail