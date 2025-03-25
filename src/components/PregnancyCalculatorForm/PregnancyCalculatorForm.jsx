import { useState } from 'react'
import './PregnancyCalculatorForm.css'
import PregnancyCalculationResult from '../PregnancyCalculationResult/PregnancyCalculationResult';

const calculateBMI = (weight, height) => {
  const weightInKg = weight.unit === 'lb' ? weight.value * 0.45359237 : weight.value;

  // Convert height to meters (meters + centimeters/100)
  const heightInMeters = Number(height.meters) + (Number(height.centimeters) / 100);

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
    heightMeters: '',
    heightCentimeters: '',
    isCarryingTwins: false,
    pregnancyWeek: ''
  })

  const [errors, setErrors] = useState({
    prePregnancyWeight: '',
    currentWeight: '',
    heightMeters: '',
    heightCentimeters: '',
    pregnancyWeek: ''
  });

  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      prePregnancyWeight: '',
      currentWeight: '',
      heightMeters: '',
      heightCentimeters: '',
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
    if (!formData.heightMeters) {
      newErrors.heightMeters = 'Height in meters is required';
      isValid = false;
    } else if (parseFloat(formData.heightMeters) < 0) {
      newErrors.heightMeters = 'Height must be a positive number';
      isValid = false;
    }

    if (!formData.heightCentimeters && formData.heightCentimeters !== '0') {
      newErrors.heightCentimeters = 'Height in centimeters is required';
      isValid = false;
    } else if (parseFloat(formData.heightCentimeters) < 0 || parseFloat(formData.heightCentimeters) >= 100) {
      newErrors.heightCentimeters = 'Centimeters must be between 0 and 99';
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
        meters: Number(formData.heightMeters),
        centimeters: Number(formData.heightCentimeters) || 0
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
      heightMeters: '',
      heightCentimeters: '',
      isCarryingTwins: false,
      pregnancyWeek: ''
    });
    setErrors({
      prePregnancyWeight: '',
      currentWeight: '',
      heightMeters: '',
      heightCentimeters: '',
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
                name="heightMeters"
                value={formData.heightMeters}
                onChange={handleInputChange}
                placeholder="Meters"
                min="0"
                step="0.01"
                className={`height-meters ${errors.heightMeters ? 'error-input' : ''}`}
              />
              <span className="unit-label">m</span>
            </div>
            <div className="input-group">
              <input
                type="number"
                name="heightCentimeters"
                value={formData.heightCentimeters}
                onChange={handleInputChange}
                placeholder="Centimeters"
                min="0"
                max="99"
                className={errors.heightCentimeters ? 'error-input' : ''}
              />
              <span className="unit-label">cm</span>
            </div>
          </div>
          {errors.heightMeters && <p className="error-message">{errors.heightMeters}</p>}
          {errors.heightCentimeters && <p className="error-message">{errors.heightCentimeters}</p>}
        </div>

        <div className="checkbox-group">
          <input type="checkbox" id="twins" name="isCarryingTwins" checked={formData.isCarryingTwins} onChange={handleInputChange} />
          <label htmlFor="twins">I&apos;m carrying twins</label>
        </div>
        <div className="conversion-info">
          <p className="info-text">
            Conversion reference: 1 lb = 0.45 kg | 1 m = 100 cm
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
