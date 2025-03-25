import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, ReferenceLine } from 'recharts';

const PregnancyCalculationResult = ({ bmi, weightGainRange, onStartOver, currentPregnancyWeek, prePregnancyWeight, currentWeight }) => {
  // Parse weight gain range to get min and max values
  const [minGain, maxGain] = weightGainRange
    .split(' to ')
    .map(val => parseFloat(val));

  // Convert weights to kg if they're in lb
  const preWeightKg = prePregnancyWeight?.unit === 'lb'
    ? prePregnancyWeight.value * 0.45359237
    : prePregnancyWeight?.value || 0;

  const currentWeightKg = currentWeight?.unit === 'lb'
    ? currentWeight.value * 0.45359237
    : currentWeight?.value || 0;

  const currentGain = currentWeightKg - preWeightKg;

  // Generate weight gain chart data
  const generateChartData = () => {
    const weeks = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
    return weeks.map(week => {
      const progress = week / 40;
      const minWeight = (minGain * progress).toFixed(1);
      const maxWeight = (maxGain * progress).toFixed(1);

      return {
        week,
        minWeight: parseFloat(minWeight),
        maxWeight: parseFloat(maxWeight),
        // Add a property to mark the current week
        isCurrentWeek: week === currentPregnancyWeek
      };
    });
  };

  const chartData = generateChartData();

  // Find the data point for current week or closest week
  const currentWeekData = chartData.find(data => data.week === currentPregnancyWeek) ||
    chartData.reduce((prev, curr) =>
      Math.abs(curr.week - currentPregnancyWeek) < Math.abs(prev.week - currentPregnancyWeek)
        ? curr
        : prev
    );

  return (
    <div className="result-container">
      <div className="result-content">
        <h2 className="result-title">Your pre-pregnancy body mass index:</h2>
        <div className="result-value">{bmi.toFixed(2)}</div>

        <h2 className="result-title">Your recommended pregnancy weight gain:</h2>
        <div className="result-value">{weightGainRange}</div>

        {currentPregnancyWeek && (
          <div className="current-status">
            <h3 className="result-title">Your current status:</h3>
            <p>Week {currentPregnancyWeek} - You've gained {currentGain.toFixed(1)} kg so far</p>
          </div>
        )}

        <div style={{ width: '100%', marginTop: '20px' }}>
          <h3 className="result-title" style={{ marginBottom: '20px' }}>
            Expected Weight Gain Range
          </h3>
          <LineChart
            width={500}
            height={250}
            data={chartData}
            margin={{ top: 5, right: 10, left: 50, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              label={{
                value: 'Weeks',
                position: 'insideBottom',
                offset: -5,
                style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' }
              }}
            />
            <YAxis
              label={{
                value: 'Weight (kg)',
                angle: -90,
                position: 'left'
              }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="maxWeight"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              name="Maximum recommended"
            />
            <Line
              type="monotone"
              dataKey="minWeight"
              stroke="#0066cc"
              strokeWidth={2}
              dot={false}
              name="Minimum recommended"
            />
            {currentPregnancyWeek && (
              <>
                <ReferenceDot
                  x={currentWeekData.week}
                  y={currentGain}
                  r={6}
                  fill="green"
                  stroke="none"
                />
                <ReferenceLine
                  x={currentWeekData.week}
                  stroke="green"
                  strokeDasharray="3 3"
                  label={{
                    value: `Week ${currentPregnancyWeek}`,
                    position: 'top',
                    fill: 'green',
                    fontSize: 12
                  }}
                />
              </>
            )}
          </LineChart>

          <div className="chart-description">
            <p>
              This graph shows how you're currently tracking toward your target pregnancy
              weight gain. The green dot indicates your current weight gain at week {currentPregnancyWeek}.
              If the dot is between the orange and blue lines, you're within the recommended weight gain range for
              pregnant women at your body mass index (BMI). If the green dot is above or below
              those lines, you're tracking above or below your recommended weight gain.
            </p>

            <p>
              Keep in mind that these are just guidelines – they aren't set in stone. Depending on
              your health needs and your medical conditions, your target weight gain may be
              different.
            </p>
          </div>
        </div>

        <button
          onClick={onStartOver}
          className="start-over-btn"
        >
          Start over
        </button>
      </div>
    </div>
  );
};

PregnancyCalculationResult.propTypes = {
  bmi: PropTypes.number.isRequired,
  weightGainRange: PropTypes.string.isRequired,
  onStartOver: PropTypes.func.isRequired,
  currentPregnancyWeek: PropTypes.number,
  prePregnancyWeight: PropTypes.shape({
    value: PropTypes.number,
    unit: PropTypes.string
  }),
  currentWeight: PropTypes.shape({
    value: PropTypes.number,
    unit: PropTypes.string
  })
};

export default PregnancyCalculationResult;