import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select,
  DatePicker,
  Upload,
  Space,
  message,
  Radio
} from 'antd';
import { 
  PlusOutlined, 
  LoadingOutlined 
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import moment from 'moment';

const { Option } = Select;

const UserForm = ({ 
  initialValues, 
  onSubmit, 
  mode 
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Set initial values when the form is loaded or edited
  useEffect(() => {
    if (initialValues) {
      // Format date if it exists
      const formattedInitialValues = {
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth ? moment(initialValues.dateOfBirth.split('T')[0]) : null
      };
      
      form.setFieldsValue(formattedInitialValues);
      setImageUrl(initialValues.avatarUrl || '');
    } else {
      form.resetFields();
      setImageUrl('');
    }
  }, [initialValues, form]);

  // Function to validate image URL
  const validateImageUrl = (_, value) => {
    if (value) {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
      if (!urlPattern.test(value)) {
        return Promise.reject('Please enter a valid image URL');
      }
    }
    
    return Promise.resolve();
  };

  // Function to handle image file upload
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

  // Custom request function to handle Cloudinary upload
  const customUpload = async ({ file, onSuccess, onError }) => {
    setImageLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'pregnancy_tracking'); // Your Cloudinary preset
    
    try {
      const cloudApiUrl = 'https://api.cloudinary.com/v1_1/dsquusdck/image/upload'; 
      
      const response = await fetch(cloudApiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      const data = await response.json();
      setImageUrl(data.secure_url);
      form.setFieldsValue({ avatarUrl: data.secure_url });
      onSuccess(data);
      setImageLoading(false);
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      onError({ event: error });
      setImageLoading(false);
      message.error('Failed to upload image. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    
    try {
      // Create a clean copy of values
      let formattedValues = { ...values };
      
      // Format date of birth to match expected backend format (YYYY-MM-DDT00:00:00)
      if (values.dateOfBirth) {
        formattedValues.dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD') + 'T00:00:00';
      }
      
      // Make sure avatarUrl is set if we uploaded an image
      formattedValues.avatarUrl = imageUrl || values.avatarUrl || '';
      
      // Ensure all required fields are properly set
      formattedValues.symptoms = formattedValues.symptoms || 'None';
      
      // If password is empty and we're updating, remove it from the payload
      if (mode === 'update' && (!formattedValues.password || formattedValues.password.trim() === '')) {
        delete formattedValues.password;
      }

      // If we're updating a user, include the ID
      if (mode === 'update' && initialValues) {
        formattedValues.id = initialValues.id;
      }

      console.log('Submitting user data:', formattedValues);
      
      // Call the onSubmit function passed from the parent component
      await onSubmit(formattedValues);
      
      // Reset form if we're creating a new user
      if (mode === 'create') {
        form.resetFields();
        setImageUrl('');
      }
      
      message.success(`User ${mode === 'create' ? 'created' : 'updated'} successfully!`);
    } catch (error) {
      console.error('Submission error:', error);
      
      // Enhanced error handling
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          message.error(`Server Error: ${error.response.data.message}`);
        } else {
          message.error(`Server Error (${error.response.status}): Please check your input data`);
        }
        console.error('Response data:', error.response.data);
      } else {
        message.error(`Failed to ${mode} the user. Please check your connection and try again.`);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        enabled: true,
        verified: false,
        role: 'user',
        gender: false,
        bloodType: 'O_POSITIVE'
      }}
    >
      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[{ 
          required: true, 
          message: 'Please enter the full name' 
        }]}
      >
        <Input placeholder="Enter full name" />
      </Form.Item>

      <Form.Item
        name="username"
        label="Username"
        rules={[
          { 
            required: true, 
            message: 'Please enter a username' 
          },
          {
            min: 4,
            message: 'Username must be at least 4 characters'
          },
          {
            max: 20,
            message: 'Username cannot exceed 20 characters'
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: 'Username can only contain letters, numbers and underscores'
          }
        ]}
      >
        <Input placeholder="Enter username (4-20 characters, letters, numbers, underscores)" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { 
            required: true, 
            message: 'Please enter an email address' 
          },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Please enter a valid email format'
          },
          {
            max: 50,
            message: 'Email cannot exceed 50 characters'
          }
        ]}
      >
        <Input placeholder="Enter email address" />
      </Form.Item>

      {mode === 'create' && (
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { 
              required: true, 
              message: 'Please enter a password' 
            },
            {
              min: 6,
              message: 'Password must be at least 6 characters'
            },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                // Check for uppercase letter
                const hasUppercase = /[A-Z]/.test(value);
                // Check for special character
                const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
                
                if (!hasUppercase && !hasSpecialChar) {
                  return Promise.reject('Password must contain at least one uppercase letter and one special character');
                }
                if (!hasUppercase) {
                  return Promise.reject('Password must contain at least one uppercase letter');
                }
                if (!hasSpecialChar) {
                  return Promise.reject('Password must contain at least one special character');
                }
                
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input.Password placeholder="Enter password (min 6 chars, 1 uppercase, 1 special character)" />
        </Form.Item>
      )}

      {mode === 'update' && (
        <Form.Item
          name="password"
          label="Password (Leave blank to keep current password)"
          rules={[
            {
              min: 6,
              message: 'Password must be at least 6 characters',
              warningOnly: true
            },
            {
              validator: (_, value) => {
                if (!value || value.trim() === '') return Promise.resolve();
                
                // Check for uppercase letter
                const hasUppercase = /[A-Z]/.test(value);
                // Check for special character
                const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
                
                if (!hasUppercase && !hasSpecialChar) {
                  return Promise.reject('Password must contain at least one uppercase letter and one special character');
                }
                if (!hasUppercase) {
                  return Promise.reject('Password must contain at least one uppercase letter');
                }
                if (!hasSpecialChar) {
                  return Promise.reject('Password must contain at least one special character');
                }
                
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input.Password placeholder="Enter new password (optional, min 6 chars, 1 uppercase, 1 special character)" />
        </Form.Item>
      )}

      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[
          { 
            required: true, 
            message: 'Please enter a phone number' 
          },
          {
            pattern: /^\+[1-9]\d{1,14}$/,
            message: 'Please enter a valid phone number in international format (e.g., +12345678900)'
          },
          {
            max: 16, // +country code (up to 3 digits) and phone number (up to 13 digits)
            message: 'Phone number cannot exceed 16 characters including + and country code'
          }
        ]}
      >
        <Input placeholder="Enter phone number in international format (e.g., +12345678900)" />
      </Form.Item>

      <Form.Item
        name="nationality"
        label="Nationality"
        rules={[{ 
          required: true, 
          message: 'Please enter nationality' 
        }]}
      >
        <Input placeholder="Enter nationality" />
      </Form.Item>

      <Form.Item
        name="dateOfBirth"
        label="Date of Birth"
        rules={[{ 
          required: true, 
          message: 'Please select date of birth' 
        }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ 
          required: true, 
          message: 'Please select gender' 
        }]}
      >
        <Radio.Group>
          <Radio value={true}>Male</Radio>
          <Radio value={false}>Female</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="bloodType"
        label="Blood Type"
        rules={[{ 
          required: true, 
          message: 'Please select blood type' 
        }]}
      >
        <Select placeholder="Select blood type">
          <Option value="A_POSITIVE">A Positive</Option>
          <Option value="A_NEGATIVE">A Negative</Option>
          <Option value="B_POSITIVE">B Positive</Option>
          <Option value="B_NEGATIVE">B Negative</Option>
          <Option value="AB_POSITIVE">AB Positive</Option>
          <Option value="AB_NEGATIVE">AB Negative</Option>
          <Option value="O_POSITIVE">O Positive</Option>
          <Option value="O_NEGATIVE">O Negative</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="symptoms"
        label="Symptoms"
      >
        <Input.TextArea 
          placeholder="Enter symptoms (if any)" 
          rows={3} 
        />
      </Form.Item>

      <Form.Item
        name="role"
        label="Role"
        rules={[{ 
          required: true, 
          message: 'Please select a role' 
        }]}
      >
        <Select placeholder="Select user role">
          <Option value="admin">Admin</Option>
          <Option value="member">Member</Option>
          <Option value="user">User</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="avatarUrl"
        label="Avatar URL"
        rules={[
          { 
            validator: validateImageUrl
          }
        ]}
      >
        <Input 
          placeholder="Enter image URL (https://example.com/avatar.jpg)" 
          onChange={(e) => {
            const newUrl = e.target.value;
            form.setFieldsValue({ avatarUrl: newUrl });
            setImageUrl(newUrl);
          }}
        />
      </Form.Item>

      <Form.Item label="Upload Avatar">
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={customUpload}
          beforeUpload={beforeUpload}
        >
          {imageLoading ? (
            <div>
              <LoadingOutlined />
              <div style={{ marginTop: 8 }}>Uploading...</div>
            </div>
          ) : imageUrl ? (
            <div>
              <img 
                src={imageUrl} 
                alt="Avatar" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} 
              />
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
        <div style={{ marginTop: 8 }}>
          <small>Click the button above to upload an avatar (max: 2MB)</small>
        </div>
      </Form.Item>

      <Form.Item 
        name="enabled" 
        label="Account Status" 
        valuePropName="checked"
      >
        <Switch 
          checkedChildren="Active" 
          unCheckedChildren="Inactive" 
        />
      </Form.Item>

      <Form.Item 
        name="verified" 
        label="Verification Status" 
        valuePropName="checked"
      >
        <Switch 
          checkedChildren="Verified" 
          unCheckedChildren="Unverified" 
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={submitLoading}
          >
            {mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
          <Button 
            onClick={() => {
              form.resetFields();
              setImageUrl('');
            }}
            disabled={submitLoading}
          >
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

UserForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    nationality: PropTypes.string,
    dateOfBirth: PropTypes.string,
    avatarUrl: PropTypes.string,
    gender: PropTypes.bool,
    bloodType: PropTypes.string,
    symptoms: PropTypes.string,
    role: PropTypes.string,
    enabled: PropTypes.bool,
    verified: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'update']).isRequired,
};

export default UserForm;