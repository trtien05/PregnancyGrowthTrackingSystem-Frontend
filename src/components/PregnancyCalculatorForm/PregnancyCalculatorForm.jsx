import { useState } from 'react'
import './PregnancyCalculatorForm.css'
import PregnancyCalculationResult from '../PregnancyCalculationResult/PregnancyCalculationResult';

const calculateBMI = (weight, height) => {
  const weightInKg = weight.unit === 'lb' ? weight.value * 0.45359237 : weight.value;

  let heightInMeters;
  if (height.unit === 'ft') {
    const totalInches = (height.feet * 12) + height.inches;
    heightInMeters = totalInches * 0.0254;
  } else {
    // For meters, handle the main value and inches separately
    heightInMeters = Number(height.feet) + (Number(height.inches) * 0.0254);
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

  const [errors, setErrors] = useState({
    prePregnancyWeight: '',
    currentWeight: '',
    heightFeet: '',
    heightInches: '',
    pregnancyWeek: ''
  });

  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      prePregnancyWeight: '',
      currentWeight: '',
      heightFeet: '',
      heightInches: '',
      pregnancyWeek: ''
    };

    // Validate pre-pregnancy weight
    if (!formData.prePregnancyWeight) {
      newErrors.prePregnancyWeight = 'Pre-pregnancy weight is required';
      isValid = false;
    } else if (parseFloat(formData.prePregnancyWeight) <= 0) {
      newErrors.prePregnancyWeight = 'Weight must be greater than 0';
      isValid = false;
    }

    // Validate current weight
    if (!formData.currentWeight) {
      newErrors.currentWeight = 'Current weight is required';
      isValid = false;
    } else if (parseFloat(formData.currentWeight) <= 0) {
      newErrors.currentWeight = 'Weight must be greater than 0';
      isValid = false;
    }

    // Validate height
    if (!formData.heightFeet) {
      newErrors.heightFeet = 'Height is required';
      isValid = false;
    } else if (parseFloat(formData.heightFeet) <= 0) {
      newErrors.heightFeet = 'Height must be greater than 0';
      isValid = false;
    }

    if (formData.heightFeetUnit === 'ft' && (!formData.heightInches || formData.heightInches === '')) {
      newErrors.heightInches = 'Inches is required';
      isValid = false;
    } else if (formData.heightFeetUnit === 'ft' && (parseFloat(formData.heightInches) < 0 || parseFloat(formData.heightInches) > 11)) {
      newErrors.heightInches = 'Inches must be between 0 and 11';
      isValid = false;
    }

    // Validate pregnancy week
    if (!formData.pregnancyWeek) {
      newErrors.pregnancyWeek = 'Pregnancy week is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bmi = calculateBMI(
      {
        value: Number(formData.prePregnancyWeight),
        unit: formData.prePregnancyUnit
      },
      {
        feet: Number(formData.heightFeet),
        inches: Number(formData.heightInches) || 0,
        unit: formData.heightFeetUnit
      }
    );

    const weightGainRange = getWeightGainRange(bmi, formData.isCarryingTwins);

    setCalculationResults({
      bmi,
      weightGainRange,
      currentPregnancyWeek: Number(formData.pregnancyWeek),
      prePregnancyWeight: {
        value: Number(formData.prePregnancyWeight),
        unit: formData.prePregnancyUnit
      },
      currentWeight: {
        value: Number(formData.currentWeight),
        unit: formData.currentWeightUnit
      }
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
    setErrors({
      prePregnancyWeight: '',
      currentWeight: '',
      heightFeet: '',
      heightInches: '',
      pregnancyWeek: ''
    });
  };

  if (showResults) {
    return (
      <PregnancyCalculationResult
        bmi={calculationResults.bmi}
        weightGainRange={calculationResults.weightGainRange}
        onStartOver={handleStartOver}
        currentPregnancyWeek={calculationResults.currentPregnancyWeek}
        prePregnancyWeight={calculationResults.prePregnancyWeight}
        currentWeight={calculationResults.currentWeight}
      />
    );
  }
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
              className={errors.prePregnancyWeight ? 'error-input' : ''}
            />
            <select name="prePregnancyUnit" value={formData.prePregnancyUnit} onChange={handleInputChange}>
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          {errors.prePregnancyWeight && <p className="error-message">{errors.prePregnancyWeight}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Your current weight </label>
          <div className="input-group">
            <input
              type="number"
              name="currentWeight"
              value={formData.currentWeight}
              onChange={handleInputChange}
              placeholder="Enter weight"
              min="0"
              className={errors.currentWeight ? 'error-input' : ''}
            />
            <select name="currentWeightUnit" value={formData.currentWeightUnit} onChange={handleInputChange}>
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
          {errors.currentWeight && <p className="error-message">{errors.currentWeight}</p>}
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
                className={`height-feet ${errors.heightFeet ? 'error-input' : ''}`}
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
                className={errors.heightInches ? 'error-input' : ''}
              />
              <span className="unit-label">inch</span>
            </div>
          </div>
          {errors.heightFeet && <p className="error-message">{errors.heightFeet}</p>}
          {errors.heightInches && <p className="error-message">{errors.heightInches}</p>}
        </div>

        <div className="checkbox-group">
          <input type="checkbox" id="twins" name="isCarryingTwins" checked={formData.isCarryingTwins} onChange={handleInputChange} />
          <label htmlFor="twins">I&apos;m carrying twins</label>
        </div>
        <div className="conversion-info">
          <p className="info-text">
            Conversion reference: 1 lb = 0.45 kg | 1 ft = 0.3 m | 1 inch = 2.5 cm
          </p>
        </div>
        <div className="form-group">
          <label className="form-label">Your week of pregnancy</label>
          <div className="input-group">
            <select
              name="pregnancyWeek"
              value={formData.pregnancyWeek}
              onChange={handleInputChange}
              className={`full-width ${errors.pregnancyWeek ? 'error-input' : ''}`}
            >
              <option value="">Select week</option>
              {pregnancyWeeks.map((week) => (
                <option key={week} value={week}>
                  {week} weeks
                </option>
              ))}
            </select>
          </div>
          {errors.pregnancyWeek && <p className="error-message">{errors.pregnancyWeek}</p>}
        </div>

        <button type="submit" className="submit-button">
          Calculate
        </button>
      </form>
    </div>
  )
}

export default PregnancyCalculatorForm
