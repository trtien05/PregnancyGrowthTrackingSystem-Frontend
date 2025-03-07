import { useState, useEffect } from 'react';
import { Button } from 'antd';
import './OvulationCycleResult.css';
import PropTypes from 'prop-types';

const OvulationCycleResult = ({ startDate, cycleLength, onStartOver }) => {
  const [currentCycle, setCurrentCycle] = useState(1);
  const [cycles, setCycles] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState(null);
  
  // Helper function to compare dates (ignoring time)
  const isSameDate = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };
  
  // Helper function to check if a date is within a range (inclusive)
  const isDateInRange = (date, startDate, endDate) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const s = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
    return d >= s && d <= e;
  };
  
  // Format date to display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate all 6 cycles when component mounts or inputs change
  useEffect(() => {
    const firstDate = new Date(startDate);
    const allCycles = [];
    
    for (let i = 0; i < 6; i++) {
      // Calculate menstruation date for this cycle
      const menstruationDate = new Date(firstDate);
      menstruationDate.setDate(menstruationDate.getDate() + (i * cycleLength));
      
      // Calculate fertile window (ovulation is ~14 days before next period)
      const fertileStart = new Date(menstruationDate);
      fertileStart.setDate(fertileStart.getDate() + (cycleLength - 14 - 2)); // Start 2 days before ovulation
      
      const fertileEnd = new Date(fertileStart);
      fertileEnd.setDate(fertileStart.getDate() + 5); // 5 day fertile window
      
      // Calculate due date (280 days from menstruation date)
      const dueDate = new Date(menstruationDate);
      dueDate.setDate(dueDate.getDate() + 280);
      
      allCycles.push({
        cycleNumber: i + 1,
        menstruationDate,
        fertileStart,
        fertileEnd,
        dueDate
      });
    }
    
    setCycles(allCycles);
  }, [startDate, cycleLength]);

  // Set current cycle data based on currentCycle state
  useEffect(() => {
    if (cycles.length > 0) {
      const cycle = cycles[currentCycle - 1];
      
      // Now generate calendar for the specific month of this cycle
      const monthDate = new Date(cycle.menstruationDate);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      
      const calendar = [];
      
      // Generate calendar days
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        let isMenstruationDay = false;
        let isFertileDay = false;
        let daysCycles = [];
        
        // Check for all cycles if this day is a menstruation or fertile day
        for (let c = 0; c < cycles.length; c++) {
          const cycleData = cycles[c];
          
          // Check if this is a menstruation day for this cycle
          if (isSameDate(currentDate, cycleData.menstruationDate)) {
            isMenstruationDay = true;
          }
          
          // Check if this is a fertile day for this cycle
          if (isDateInRange(currentDate, cycleData.fertileStart, cycleData.fertileEnd)) {
            isFertileDay = true;
            daysCycles.push(cycleData.cycleNumber);
          }
        }
        
        calendar.push({
          day,
          isMenstruationDay,
          isFertileDay,
          cycles: daysCycles
        });
      }
      
      setCurrentMonthData({
        ...cycle,
        month,
        year,
        calendar,
        firstDayOfMonth
      });
    }
  }, [cycles, currentCycle]);

  const handleNextCycle = () => {
    if (currentCycle < 6) {
      setCurrentCycle(currentCycle + 1);
    }
  };

  const handlePreviousCycle = () => {
    if (currentCycle > 1) {
      setCurrentCycle(currentCycle - 1);
    }
  };

  // Wait for data to load
  if (!currentMonthData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cycle-result">
      <div className="cycle-header">
        <h2>Cycle {currentCycle}/6</h2>
      </div>

      <div className="cycle-info">
        <div className="info-item">
          <div className="icon menstruation-icon">🔴</div>
          <div className="info-content">
            <div className="info-label">Menstruation date</div>
            <div className="info-value">{formatDate(currentMonthData.menstruationDate)}</div>
          </div>
        </div>
        
        <div className="info-item">
          <div className="icon fertile-icon">🔵</div>
          <div className="info-content">
            <div className="info-label">Fertile days</div>
            <div className="info-value">
              {formatDate(currentMonthData.fertileStart)} - {formatDate(currentMonthData.fertileEnd)}
            </div>
          </div>
        </div>
        
        <div className="info-item">
          <div className="icon due-icon">📅</div>
          <div className="info-content">
            <div className="info-label">Expected due date</div>
            <div className="info-value">{formatDate(currentMonthData.dueDate)}</div>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        {currentCycle > 1 && (
          <Button onClick={handlePreviousCycle} className="nav-btn prev-btn">
            ← Prev Cycle
          </Button>
        )}
        
        {currentCycle < 6 && (
          <Button onClick={handleNextCycle} className="nav-btn next-btn">
            Next Cycle →
          </Button>
        )}
      </div>

      
      <div className="footer-actions">
        <Button onClick={onStartOver} className="start-over-btn">Start Over</Button>
      </div>
    </div>
  );
};

OvulationCycleResult.propTypes = {
  startDate: PropTypes.string.isRequired,
  cycleLength: PropTypes.number.isRequired,
  onStartOver: PropTypes.func.isRequired,
};

export default OvulationCycleResult;