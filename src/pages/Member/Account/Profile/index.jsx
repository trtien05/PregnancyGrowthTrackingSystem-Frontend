import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
  ConfigProvider,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Profile.css'


const UpdateUserForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Form values:', values);
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
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="First Name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="Last Name"
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
