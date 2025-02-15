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



  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword);
      } else {
        setPasswordMatch(value === formData.password);
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
              {!passwordMatch && (
                <p className="error-message">Passwords do not match</p>
              )}
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

