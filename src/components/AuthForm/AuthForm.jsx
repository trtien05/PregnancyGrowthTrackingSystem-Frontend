import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import banner from "../../assets/images/banner-signin.png";
import './AuthForm.css';
import cookieUtils from "../../utils/cookieUtils";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const [passwordError, setPasswordError] = useState(''); 
  // Hàm validate mật khẩu (password)
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};


const [emailError, setEmailError] = useState(''); // Thêm state để theo dõi lỗi email

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  // Kiểm tra mật khẩu khi người dùng nhập vào
  if (name === 'password') {
    if (!validatePassword(value)) {
      setPasswordError("Password must contain at least one uppercase letter, one number, and one special character.");
    } else {
      setPasswordError('');
    }
  }

  // Kiểm tra email khi người dùng nhập vào
  if (name === 'username') {  // Validate email khi người dùng nhập vào trường email
    if (!validateEmail(value)) {
      setEmailError("Invalid email address.");
    } else {
      setEmailError('');
    }
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/login", {}, {
        auth: formData
      });
      console.log("response: ", response);
      const data = response.data.data;
      const { token } = data;
      cookieUtils.setItem(config.cookies.token, token);
      messageApi.success('Logged in successfully');
      setTimeout(() => {
        navigate(config.routes.public.home);
      }, 2000);
    } catch (error) {
      console.log("Error: ", error);
    }
  };



  return (
    <>
      {contextHolder}
      <div className="auth-container">
        <div className="auth-card">
          {/* Form Section */}
          {/* Điều kiện hiển thị */}
          <div className="form-section">
            <h1 className="form-title">Sign in</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                />
                {emailError && <p className="error-message">{emailError}</p>}
              </div>

              <div className="form-group">
                <div className="password-group">
                  <label className="form-label">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOffIcon style={{ color: '#666666' }} size={16} /> : <EyeIcon style={{ color: '#666666' }} size={16} />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="on"
                />
                {passwordError && <p className="error-message">{passwordError}</p>}

              </div>

              <div className="form-links">
                <a href="/register" className="form-link">
                  Don&apos;t have an account?
                </a>
                <a href="#" className="form-link">Reset password</a>
              </div>

              <button type="submit" className="submit-button">
                Sign in
              </button>

              <div className="divider">
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
          {/* Image Section */}
          <div className="image-section">
            <img
              src={banner}
              alt="Mother and child illustration"
            />
            <div className="banner-text">
              <p>Every pregnancy is special.</p>
              <p>Let&apos;s make yours extraordinary!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthForm;