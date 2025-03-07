import { useState } from 'react';
import { Input, Button, Select } from 'antd';
import './OvulationCalculatorForm.css';
import PropTypes from 'prop-types';

const OvulationCalculatorForm = ({ onShowResult }) => {
  const [startDate, setStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');

  const handleSubmit = () => {
    // Validate the form before submitting
    if (!startDate) {
      alert('Please select the first day of your last period');
      return;
    }
    onShowResult(startDate, parseInt(cycleLength));
  };

  return (
    <div className="calculator-form">
      <label>First day of your last period</label>
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
        className="input-field"
      />

      <label>How long was your last cycle</label>
      <Select
        value={cycleLength}
        onChange={(value) => setCycleLength(value)}
        placeholder="Select your cycle length"
        className="input-field"
      >
        {Array.from({ length: 22 }, (_, i) => {
          const days = 20 + i;
          return <Select.Option key={days} value={days.toString()}>{days} days</Select.Option>;
        })}
      </Select>

      <Button
        type="primary"
        onClick={handleSubmit}
        className="submit-btn"
      >
        See my fertile days
      </Button>
    </div>
  );
};
OvulationCalculatorForm.propTypes = {
  onShowResult: PropTypes.func.isRequired,
};

export default OvulationCalculatorForm;