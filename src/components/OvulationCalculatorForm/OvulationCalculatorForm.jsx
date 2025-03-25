import { useState } from 'react';
import { Input, Button, Select, Alert } from 'antd';
import './OvulationCalculatorForm.css';
import PropTypes from 'prop-types';

const OvulationCalculatorForm = ({ onShowResult }) => {
  const [startDate, setStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validate start date
    if (!startDate) {
      newErrors.startDate = 'Please select the first day of your last period';
    } else {
      // Check if date is in the future
      const selectedDate = new Date(startDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.startDate = 'Date cannot be in the future';
      }
    }

    // Validate cycle length (already handled by Select component, but as a safety measure)
    if (!cycleLength) {
      newErrors.cycleLength = 'Please select your cycle length';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setFormSubmitted(true);

    // Validate the form before submitting
    if (validateForm()) {
      onShowResult(startDate, parseInt(cycleLength));
    }
  };

  return (
    <div className="calculator-form">
      {formSubmitted && Object.keys(errors).length > 0 && (
        <Alert
          message="Please correct the errors below"
          type="error"
          showIcon
          style={{ marginBottom: '15px' }}
        />
      )}

      <label>First day of your last period</label>
      <Input
        type="date"
        value={startDate}
        onChange={(e) => {
          setStartDate(e.target.value);
          if (formSubmitted) validateForm();
        }}
        required
        className={`input-field ${errors.startDate && formSubmitted ? 'input-error' : ''}`}
        max={new Date().toISOString().split('T')[0]} // Prevent future dates
      />
      {errors.startDate && formSubmitted && (
        <div className="error-message">{errors.startDate}</div>
      )}

      <label>How long was your last cycle</label>
      <Select
        value={cycleLength}
        onChange={(value) => {
          setCycleLength(value);
          if (formSubmitted) validateForm();
        }}
        placeholder="Select your cycle length"
        className={errors.cycleLength && formSubmitted ? 'select-error' : ''}
      >
        {Array.from({ length: 22 }, (_, i) => {
          const days = 20 + i;
          return <Select.Option key={days} value={days.toString()}>{days} days</Select.Option>;
        })}
      </Select>
      {
        errors.cycleLength && formSubmitted && (
          <div className="error-message">{errors.cycleLength}</div>
        )
      }

      <Button
        type="primary"
        onClick={handleSubmit}
        className="submit-btn"
      >
        See my fertile days
      </Button>
    </div >
  );
};

OvulationCalculatorForm.propTypes = {
  onShowResult: PropTypes.func.isRequired,
};

export default OvulationCalculatorForm;