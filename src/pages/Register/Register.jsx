import { useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import './Register.css';

function Register() {
  useDocumentTitle('PregnaJoy | Register');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    console.log('Form submitted:', formData);
  };

  return (
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
            className="create-button"
          >
            Create an account
          </button>

          <div className="divider-register">
            <span className="divider-text">OR</span>
          </div>

          <a href="http://localhost:8080/api/auth/callback/google/redirect">
            <button type="button" className="google-button">
              <img
                src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                alt="Google logo"
                width="20"
                height="20"
              />
              Continue with Google
            </button>
          </a>

        </form>
      </div>
    </div>
  );
}

export default Register

