import { useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import './Register.css';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function Register() {
  useDocumentTitle('PregnaJoy | Register');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  
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
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
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
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    const newData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    }
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', newData);
      console.log('response:', response);
      const data = response.data;
      if (response.status === 200) {
        const responseEmail = await axios.post(`http://localhost:8080/api/v1/otp/generate?email=${encodeURIComponent(data.data.email)}`);

        messageApi.success(`Verify your email: ${responseEmail.data.message}`);

        setTimeout(() => {
          navigate(config.routes.public.verifyEmail, { state: { email: formData.email } });
        }, 2000);
      }
    } catch (error) {
      console.log('Error:', error);
    }
    console.log('Form submitted:', newData);
  };

  return (
    <>
      {contextHolder}
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 >Create an account</h1>
            <a href="/login" className="form-link ">Have an account?</a>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
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
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${!passwordMatch ? 'password-mismatch' : ''}`}

                required
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
                By creating an account, I agree to our{' '}
                <a href="#">Terms of use</a> and{' '}
                <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="submit-button"
            >
              Create an account
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register

