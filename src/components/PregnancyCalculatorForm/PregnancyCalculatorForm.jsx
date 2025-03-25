import { useState } from 'react'
import './PregnancyCalculatorForm.css'
import PregnancyCalculationResult from '../PregnancyCalculationResult/PregnancyCalculationResult';

const calculateBMI = (weight, height) => {
  // Convert weight to kg if in lbs
  const weightInKg = weight.unit === 'lb' ? weight.value * 0.45359237 : weight.value;

  // Convert height to meters if in ft/in
  let heightInMeters;
  if (height.unit === 'ft') {
    const totalInches = (height.feet * 12) + height.inches;
    heightInMeters = totalInches * 0.0254;
  } else {
    heightInMeters = height.meters;
  }

  return weightInKg / (heightInMeters * heightInMeters);
};

const getWeightGainRange = (bmi, isTwins) => {
  if (isTwins) {
    return "17 to 25 kg";
  }

  if (bmi < 18.5) {
    return "13 to 18 kg";
  } else if (bmi >= 18.5 && bmi < 25) {
    return "11.5 to 16 kg";
  } else if (bmi >= 25 && bmi < 30) {
    return "7 to 11.5 kg";
  } else {
    return "5 to 9 kg";
  }
};


const PregnancyCalculatorForm = () => {
  const [formData, setFormData] = useState({
    prePregnancyWeight: '',
    prePregnancyUnit: 'lb',
    currentWeight: '',
    currentWeightUnit: 'lb',
    heightFeet: '',
    heightFeetUnit: 'ft',
    heightInches: '',
    isCarryingTwins: false,
    pregnancyWeek: ''
  })

  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);



  const handleSubmit = (e) => {
    e.preventDefault();

    const bmi = calculateBMI(
      {
        value: Number(formData.prePregnancyWeight),
        unit: formData.prePregnancyUnit
      },
      {
        feet: Number(formData.heightFeet),
        inches: Number(formData.heightInches),
        unit: formData.heightFeetUnit
      }
    );

    const weightGainRange = getWeightGainRange(bmi, formData.isCarryingTwins);

    setCalculationResults({
      bmi,
      weightGainRange
    });
    setShowResults(true);
  };

  const handleStartOver = () => {
    setShowResults(false);
    setFormData({
      prePregnancyWeight: '',
      prePregnancyUnit: 'lb',
      currentWeight: '',
      currentWeightUnit: 'lb',
      heightFeet: '',
      heightFeetUnit: 'ft',
      heightInches: '',
      isCarryingTwins: false,
      pregnancyWeek: ''
    });
  };

  if (showResults) {
    return (
      <PregnancyCalculationResult
        bmi={calculationResults.bmi}
        weightGainRange={calculationResults.weightGainRange}
        onStartOver={handleStartOver}
      />
    );
  }
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }


  // Generate array of weeks 1-42
  const pregnancyWeeks = Array.from({ length: 42 }, (_, i) => i + 1)

  return (
    <div className="calculator-container">
      <form onSubmit={handleSubmit} className="pregnancy-calculator">
        <div className="form-group">
          <label className="form-label">Your pre-pregnancy weight</label>
          <div className="input-group">
            <input
              type="number"
              name="prePregnancyWeight"
              value={formData.prePregnancyWeight}
              onChange={handleInputChange}
              placeholder="Enter weight"
              min="0"
              required
            />
            <select name="prePregnancyUnit" value={formData.prePregnancyUnit} onChange={handleInputChange}>
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Your weight right now</label>
          <div className="input-group">
            <input
              type="number"
              name="currentWeight"
              value={formData.currentWeight}
              onChange={handleInputChange}
              placeholder="Enter weight"
              min="0"
              required
            />
            <select name="currentWeightUnit" value={formData.currentWeightUnit} onChange={handleInputChange}>
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Your height</label>
          <div className="height-group">
            <div className="input-group">
              <input
                type="number"
                name="heightFeet"
                value={formData.heightFeet}
                onChange={handleInputChange}
                placeholder="Feet"
                min="0"
                required
                className="height-feet"
              />
              <select name="heightFeetUnit" value={formData.heightFeetUnit} onChange={handleInputChange}>
                <option value="ft">ft</option>
                <option value="m">m</option>
              </select>
            </div>
            <div className="input-group">
              <input
                type="number"
                name="heightInches"
                value={formData.heightInches}
                onChange={handleInputChange}
                placeholder="Inches"
                min="0"
                max="11"
                required
              />
              <span className="unit-label">in</span>
            </div>
          </div>
        </div>

        <div className="checkbox-group">
          <input type="checkbox" id="twins" name="isCarryingTwins" checked={formData.isCarryingTwins} onChange={handleInputChange} />
          <label htmlFor="twins">I&apos;m carrying twins</label>
        </div>
        <div className="conversion-info">
          <p className="info-text">
            <small>Conversion reference: 1 lb = 0.45 kg | 1 ft = 0.3 m</small>
          </p>
        </div>
        <div className="form-group">
          <label className="form-label">Your week of pregnancy</label>
          <div className="input-group">
            <select name="pregnancyWeek" value={formData.pregnancyWeek} onChange={handleInputChange} required className="full-width">
              <option value="">Select week</option>
              {pregnancyWeeks.map((week) => (
                <option key={week} value={week}>
                  {week} weeks
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Calculate
        </button>
      </form>
    </div>
  )
}

export default PregnancyCalculatorForm
