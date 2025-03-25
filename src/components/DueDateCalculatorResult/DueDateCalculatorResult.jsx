import PropTypes from 'prop-types';
import { Button } from 'antd';
import './DueDateCalculatorResult.css';
import { format, addDays, addMonths } from 'date-fns';

const DueDateCalculatorResult = ({ calculationData, onBackToForm }) => {
  const {
    calculationMethod,
    date,
    weeks,
    days,
    transferType
  } = calculationData;

  const calculateDueDate = () => {
    if (!date) return null;

    let dueDate = null;

    switch (calculationMethod) {
      case 'Conception date':
        // Add 9 months and 7 days to the conception date
        dueDate = addDays(addMonths(date, 9), 7);
        break;
      case 'Last period':
        // Add 280 days to the last menstrual period
        dueDate = addDays(date, 280);
        break;
      case 'IVF':
        if (transferType === 'IVF 3 Day Transfer Date') {
          // Add 266 days to the 3-day transfer date
          dueDate = addDays(date, 266);
        } else {
          // Add 261 days to the 5-day transfer date
          dueDate = addDays(date, 261);
        }
        break;
      case 'Ultrasound': {
        // Calculate: Due Date = Ultrasound Date + (280 - Gestational Age in days)
        const gestationalAgeInDays = parseInt(weeks) * 7 + parseInt(days);
        dueDate = addDays(date, 280 - gestationalAgeInDays);
        break;
      }
      case 'I know my due date':
        // Simply use the entered due date
        dueDate = date;
        break;
      default:
        dueDate = null;
    }

    return dueDate;
  };

  const dueDate = calculateDueDate();
  const formattedDueDate = dueDate ? format(dueDate, 'MMMM d, yyyy') : 'Not available';

  return (
    <div className="due-date-result-container">
      <div className="result-content">


        <div className="congratulation-text">
          Congrats! Your due date is
        </div>

        <h1 className="due-date">{formattedDueDate}</h1>

        <div className="sun-icon">
          <span role="img" aria-label="sun">☀️</span>
        </div>

        <Button
          type="primary"
          className="back-button-cal"
          onClick={onBackToForm}
        >
          Back to calculator
        </Button>
      </div>
    </div>
  );
};
DueDateCalculatorResult.propTypes = {
  calculationData: PropTypes.shape({
    calculationMethod: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    cycleLength: PropTypes.number,
    weeks: PropTypes.number,
    days: PropTypes.number,
    transferType: PropTypes.string,
  }).isRequired,
  onBackToForm: PropTypes.func.isRequired,
};

export default DueDateCalculatorResult;