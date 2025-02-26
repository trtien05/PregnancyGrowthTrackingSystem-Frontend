import React, { useState } from 'react';
import { Steps, Form, Input, Select, DatePicker, InputNumber, Button, message, Result } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './MomInfor.css';

const { Step } = Steps;

const MomInfo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [form] = Form.useForm();

  const bloodTypes = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'O', label: 'O' },
    { value: 'AB', label: 'AB' }
  ];

  const validateMessages = {
    required: '${label} là trường bắt buộc!',
    types: {
      number: '${label} phải là số!',
    },
    number: {
      range: '${label} phải từ ${min} đến ${max}',
    }
  };

  const next = async () => {
    try {
      const values = await form.validateFields();
      if (currentStep === 1) {
        setFormData(values);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values) => {
    setFormData(values);
    message.success('Đã lưu thông tin thành công!');
    setCurrentStep(currentStep + 1);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.format('DD/MM/YYYY');
  };

  const steps = [
    {
      title: 'Basic information',
      content: (
        <div className="step-content">
          <div className="form-row">
            <div className="form-item">
              <label className="input-label required-field">Full Name</label>
              <Form.Item
                name="fullName"
                rules={[{ required: true }]}
                noStyle
                className="form-input"
              >
                <Input placeholder="Enter full name" />
              </Form.Item>

            </div>
            <div className="form-item">
              <label className="input-label required-field">Birth Date</label>
              <Form.Item
                name="dateOfBirth"
                rules={[{ required: true }]}
                noStyle
              >
                <DatePicker style={{ width: '100%' }} placeholder="Enter birth date" />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-item">
              <label className="input-label required-field">Blood type</label>
              <Form.Item
                name="bloodType"
                rules={[{ required: true }]}
                noStyle
              >
                <Select style={{ width: '91%' }} options={bloodTypes} placeholder="Enter blood type" />
              </Form.Item>
            </div>
            <div className="form-item">
              <label className="input-label required-field">Current week of pregnancy</label>
              <Form.Item
                name="currentWeek"
                rules={[{ required: true }, { type: 'number', min: 1, max: 42 }]}
                noStyle
              >
                <InputNumber style={{ width: '100%' }} placeholder="Enter current week" min={1} max={42} />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-item">
              <label className="input-label">Weight (kg)</label>
              <Form.Item name="weight" noStyle>
                <InputNumber style={{ width: '100%' }} placeholder="Enter weight" min={30} max={200} step={0.1} />
              </Form.Item>
            </div>
            <div className="form-item">
              <label className="input-label">Height (cm)</label>
              <Form.Item name="height" noStyle>
                <InputNumber style={{ width: '100%' }} placeholder="Enter height" min={140} max={200} />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-item">
              <label className="input-label required-field">
                Due date of birth</label>
              <Form.Item
                name="expectedDueDate"
                rules={[{ required: true }]}
                noStyle
              >
                <DatePicker style={{ width: '105%' }} placeholder="Enter due date" />
              </Form.Item>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Fetal information',
      content: (
        <div className="step-content">
          <div className="form-row">
            <div className="form-item">
              <label className="input-label required-field">Nhịp tim thai (nhịp/phút)</label>
              <Form.Item
                name="fetalHeartRate"
                rules={[{ required: true }, { type: 'number', min: 100, max: 200 }]}
                noStyle
              >
                <InputNumber style={{ width: '100%' }} placeholder="Nhập nhịp tim thai" min={100} max={200} />
              </Form.Item>
            </div>
          </div>

          <div className="form-row">
            <div className="form-item">
              <label className="input-label required-field">Chiều dài thai nhi (mm)</label>
              <Form.Item
                name="fetalLength"
                rules={[{ required: true }]}
                noStyle
              >
                <InputNumber style={{ width: '100%' }} placeholder="Nhập chiều dài thai nhi" min={0} />
              </Form.Item>
            </div>
            <div className="form-item">
              <label className="input-label required-field">Cân nặng thai nhi (g)</label>
              <Form.Item
                name="fetalWeight"
                rules={[{ required: true }]}
                noStyle
              >
                <InputNumber style={{ width: '100%' }} placeholder="Nhập cân nặng thai nhi" min={0} />
              </Form.Item>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Finish',
      content: (
        <div className="step-content">
          {formData && (
            <div className="summary-container">
              <Result
                icon={<CheckCircleOutlined />}
                status="success"
                title="Đã nhập thông tin thành công!"
                subTitle="Dưới đây là thông tin bạn đã nhập:"
              />

              <div className="summary-content">
                <h3>Thông tin cơ bản:</h3>
                <div className="summary-row">
                  <p><strong>Họ và tên:</strong> {formData.fullName}</p>
                  <p><strong>Ngày sinh:</strong> {formatDate(formData.dateOfBirth)}</p>
                  <p><strong>Nhóm máu:</strong> {formData.bloodType}</p>
                  <p><strong>Tuần thai:</strong> {formData.currentWeek}</p>
                  <p><strong>Cân nặng:</strong> {formData.weight}kg</p>
                  <p><strong>Chiều cao:</strong> {formData.height}cm</p>
                  <p><strong>Ngày dự sinh:</strong> {formatDate(formData.expectedDueDate)}</p>
                </div>

                <h3>Thông tin thai nhi:</h3>
                <div className="summary-row">
                  <p><strong>Nhịp tim thai:</strong> {formData.fetalHeartRate} nhịp/phút</p>
                  <p><strong>Chiều dài thai nhi:</strong> {formData.fetalLength}mm</p>
                  <p><strong>Cân nặng thai nhi:</strong> {formData.fetalWeight}g</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="mom-info-container">
      <h1 >Information for pregnant mothers</h1>

      <div className="form-container">
        <Steps current={currentStep} className="custom-steps">
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          {steps[currentStep].content}

          <div className="buttons-container">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <Button style={{ margin: '0 8px' }} onClick={prev}>
                Quay lại
              </Button>
            )}
            {currentStep < steps.length - 2 && (
              <button className="submit-button" style={{ width: '15%', borderRadius: '15px' }} onClick={next}>
                Next
              </button>
            )}
            {currentStep === steps.length - 2 && (
              <Button type="primary" htmlType="submit">
                Hoàn thành
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={() => setCurrentStep(0)}>
                Nhập thông tin mới
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MomInfo;