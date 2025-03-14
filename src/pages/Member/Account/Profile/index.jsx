import {
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
  ConfigProvider,
  Select,
  Avatar,
  Upload,
  message,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Profile.css'
import { useEffect, useState } from 'react';
import axiosClient from '../../../../utils/apiCaller';
import countries from 'world-countries';
import dayjs from 'dayjs'; // Import dayjs for date handling
import useAuth from '../../../../hooks/useAuth';
import cookieUtils from '../../../../utils/cookieUtils';

const { Option } = Select;

const countryList = countries.map((country) => ({
  label: country.name.common,
  value: country.cca2, // Mã quốc gia 2 ký tự (VD: VN, US, JP)
}));

const UpdateUserForm = () => {
  const {user} = useAuth();
  console.log('User:', user);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Function to check file type
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    return isImage && isLt2M;
  };

  // Function to handle file change
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get URL from Cloudinary response
      if (info.file.response && info.file.response.secure_url) {
        setLoading(false);
        setImageUrl(info.file.response.secure_url);
      }
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error('Avatar upload failed.');
    }
  };

  // Custom request to handle file upload to Cloudinary
  const customUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.CLOUD_UPLOAD_PRESET || 'pregnancy_tracking');
    
    try {
      const cloudApiUrl = import.meta.env.CLOUD_API_URL || 'https://api.cloudinary.com/v1_1/dsquusdck/image/upload';
      
      const response = await fetch(cloudApiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      onSuccess(data); // Pass the Cloudinary response to onSuccess
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      onError({ event: error });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from API
        const response = await axiosClient.get('/auth/profile');
        const data = response.data;
        console.log('User data:', data);
        
        // Parse date of birth properly
        const dateOfBirth = data.dateOfBirth ? dayjs(data.dateOfBirth) : null;
        
        // Set form values
        form.setFieldsValue({
          fullName: data.fullName,
          username: data.username,
          nationality: data.national ? data.nationality : undefined,
          phoneNumber: data.phoneNumber,
          dateOfBirth: dateOfBirth, // Use the parsed dayjs object
          bloodType: data.bloodType
            ? data.bloodType
            : undefined,
          symptoms: data.symptoms, // Note: there seems to be a typo here (symtomps vs symptoms)
        });
        
        // Set avatar URL if available
        if (data.avatarUrl) {
          setImageUrl(data.avatarUrl);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, [form]);

  const onFinish = async (values) => {
    let formattedDateOfBirth = null;
    if (values.dateOfBirth) {
      formattedDateOfBirth = values.dateOfBirth.format('YYYY-MM-DD') + 'T00:00:00';
    }

    const dataToSubmit = {
      fullName: values.fullName,
      username: values.username,
      bloodType: values.bloodType,
      nationality: values.nationality,
      phoneNumber: values.phoneNumber,
      symptoms: values.symptoms,
      avatarUrl: imageUrl, 
      dateOfBirth: formattedDateOfBirth,
    };
    
    // Submit to backend
    try {
      message.loading({ content: 'Updating profile...', key: 'updateProfile' });
      
      const response = await axiosClient.put(`/users/${user.id}`, dataToSubmit);
      console.log('Update user information response:', response);
      
      message.success({ 
        content: 'Profile updated successfully!', 
        key: 'updateProfile', 
        duration: 2 
      });
      
      // Optionally navigate back after successful update
      // setTimeout(() => navigate(-1), 1500);
      
    } catch (error) {
      console.error('Failed to update user information:', error);
      
      // Determine if it's a CORS error
      const isCorsError = 
        error.message && (
          error.message.includes('Network Error') || 
          error.message.includes('CORS')
        );
      
      message.error({ 
        content: isCorsError 
          ? 'CORS error: Unable to connect to the server. Please contact support.' 
          : 'Failed to update profile. Please try again later.',
        key: 'updateProfile', 
        duration: 3 
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#d23f57',
          colorPrimaryHover: '#b83548',
          colorBorder: '#e0e0e0',
          colorPrimaryBorder: '#d23f57',
          controlOutline: 'rgba(210, 63, 87, 0.2)',
        },
      }}
    >
      <Card className="form-card">
        <div className="form-header">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="back-button"
          >
            Back
          </Button>
          <h2 className="form-title-profile">
            <EditOutlined className="title-icon" /> Update User Information
          </h2>
        </div>
        <Form
          form={form}
          name="updateUserForm"
          onFinish={onFinish}
          layout="vertical"
          className="form"
        >
          <Row gutter={16}>
           <Col xs={24} sm={24}>
              <Form.Item
                name="avatar"
                rules={[{ required: false, message: 'Please input your avatar!' }]}
                style={{ textAlign: 'center' }}
              >
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={customUpload}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <Avatar 
                      size={64} 
                      src={imageUrl} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="Full Name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="username"
                label="User Name"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="User Name"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="bloodType"
                label="Blood Type"
                rules={[
                  {
                    required: false,
                    message: 'Please select your blood type!',
                  },
                ]}
              >
                <Select placeholder="Select blood type">
                  <Option value="A_POSITIVE">A+</Option>
                  <Option value="A_NEGATIVE">A-</Option>
                  <Option value="B_POSITIVE">B+</Option>
                  <Option value="B_NEGATIVE">B-</Option>
                  <Option value="AB_POSITIVE">AB+</Option>
                  <Option value="AB_NEGATIVE">AB-</Option>
                  <Option value="O_POSITIVE">O+</Option>
                  <Option value="O_NEGATIVE">O-</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nationality"
                label="Nationality"
                rules={[
                  {
                    required: true,
                    message: 'Please select your nationality!',
                  },
                ]}
              >
                <Select
                  placeholder="Select nationality"
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option
                      ? option.label.toLowerCase().includes(input.toLowerCase())
                      : false
                  }
                  options={countryList}
                />
              </Form.Item>
            </Col>
          </Row>

          


          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input
                  prefix={<PhoneOutlined className="input-icon" />}
                  placeholder="Phone Number"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select your date of birth!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  suffixIcon={<CalendarOutlined className="input-icon" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="symptoms"
                label="Symptoms"
                rules={[{ required: false, message: 'Please input your symptoms!' }]}
              >
                <Input.TextArea
                  placeholder="Symptoms"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button-profile">
              Update Information
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default UpdateUserForm;
