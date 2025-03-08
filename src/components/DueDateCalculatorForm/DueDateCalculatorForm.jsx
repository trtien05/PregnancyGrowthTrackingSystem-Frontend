import { useState } from 'react';
import { Button, Select, DatePicker, Radio, Space } from 'antd';
import './DueDateCalculatorForm.css';
import DueDateCalculatorResult from '../DueDateCalculatorResult/DueDateCalculatorResult';

const { Option } = Select;

const DueDateCalculatorForm = () => {
  const [calculationMethod, setCalculationMethod] = useState('Ultrasound');
  const [date, setDate] = useState(null);
  const [cycleLength, setCycleLength] = useState('28 days');
  const [weeks, setWeeks] = useState('6');
  const [days, setDays] = useState('0');
  const [transferType, setTransferType] = useState('IVF 3 Day Transfer Date');
  const [showResults, setShowResults] = useState(false);

  const handleCalculationMethodChange = (value) => {
    setCalculationMethod(value);
  };

  const generateWeeksOptions = () => {
    const options = [];
    for (let i = 1; i <= 24; i++) {
      options.push(<Option key={i} value={i.toString()}>{i}</Option>);
    }
    return options;
  };

  const generateDaysOptions = () => {
    const options = [];
    for (let i = 0; i <= 6; i++) {
      options.push(<Option key={i} value={i.toString()}>{i}</Option>);
    }
    return options;
  };

  const generateCycleLengthOptions = () => {
    const options = [<Option key="unknown" value="I don't know">I don&apos;t know</Option>];
    for (let i = 20; i <= 45; i++) {
      options.push(<Option key={i} value={`${i} days`}>{i} days</Option>);
    }
    return options;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  const renderInputFields = () => {
    switch (calculationMethod) {
      case 'Last period':
        return (
          <>
            <div className="form-group">
              <label>When did your last period start?</label>
              <DatePicker 
                className="form-control" 
                value={date} 
                onChange={setDate}
                format="DD-MM-YYYY"
              />
            </div>
            <div className="form-group">
              <label>Cycle length</label>
              <Select
                className="form-control"
                value={cycleLength}
                onChange={setCycleLength}
              >
                {generateCycleLengthOptions()}
              </Select>
            </div>
          </>
        );
      case 'Conception date':
        return (
          <div className="form-group">
            <label>When did you conceive?</label>
            <DatePicker 
              className="form-control" 
              value={date} 
              onChange={setDate}
              format="DD-MM-YYYY"
            />
          </div>
        );
      case 'IVF':
        return (
          <>
            <div className="form-group">
              <label>Date of transfer</label>
              <DatePicker 
                className="form-control" 
                value={date} 
                onChange={setDate}
                format="DD-MM-YYYY"
              />
            </div>
            <div className="form-group">
              <Radio.Group value={transferType} onChange={e => setTransferType(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="IVF 3 Day Transfer Date">IVF 3 Day Transfer Date</Radio>
                  <Radio value="IVF 5 Day Transfer Date">IVF 5 Day Transfer Date</Radio>
                </Space>
              </Radio.Group>
            </div>
          </>
        );
      case 'Ultrasound':
        return (
          <>
            <div className="form-group">
              <label>Date of ultrasound</label>
              <DatePicker 
                className="form-control" 
                value={date} 
                onChange={setDate}
                format="DD-MM-YYYY"
              />
            </div>
            <div className="form-group">
              <label >Calculated gestational age on the date that the ultrasound was performed</label>
              <div className="gestational-age">
                <div className="weeks-container">
                  <label>Weeks</label>
                  <Select
                    className="form-control"
                    value={weeks}
                    onChange={setWeeks}
                  >
                    {generateWeeksOptions()}
                  </Select>
                </div>
                <div className="days-container">
                  <label>Days</label>
                  <Select
                    className="form-control"
                    value={days}
                    onChange={setDays}
                  >
                    {generateDaysOptions()}
                  </Select>
                </div>
              </div>
            </div>
          </>
        );
      case 'I know my due date':
        return (
          <div className="form-group">
            <label>What&apos;s your due date?</label>
            <DatePicker 
              className="form-control" 
              value={date} 
              onChange={setDate}
              format="DD-MM-YYYY"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (showResults) {
    return (
      <DueDateCalculatorResult 
        calculationData={{
          calculationMethod,
          date,
          cycleLength,
          weeks,
          days,
          transferType
        }}
        onBackToForm={handleBackToForm}
      />
    );
  }

  return (
    <div className="due-date-calculator-form">
      <div className="form-group">
        <label>Calculation method</label>
        <Select
          className="form-control cycle-dropdown"
          value={calculationMethod}
          onChange={handleCalculationMethodChange}
        >
          <Option value="Ultrasound">Ultrasound</Option>
          <Option value="Last period">Last period</Option>
          <Option value="Conception date">Conception date</Option>
          <Option value="IVF">IVF</Option>
          <Option value="I know my due date">I know my due date</Option>
        </Select>
      </div>
      
      {renderInputFields()}
      
      <div className="form-group">
        <Button 
          type="primary" 
          className="timeline-button"
          onClick={handleSubmit}
          disabled={!date}
        >
          See your timeline
        </Button>
      </div>
    </div>
  );
};

export default DueDateCalculatorForm;