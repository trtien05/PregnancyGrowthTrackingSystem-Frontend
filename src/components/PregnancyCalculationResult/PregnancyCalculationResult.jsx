import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const PregnancyCalculationResult = ({ bmi, weightGainRange, onStartOver }) => {


  // Parse weight gain range to get min and max values
  const [minGain, maxGain] = weightGainRange
    .split(' to ')
    .map(val => parseFloat(val));

  // Generate weight gain chart data
  const generateChartData = () => {
    const weeks = [0, 4, 12, 16, 20, 24, 28, 32, 36, 40];
    return weeks.map(week => {
      const progress = week / 40;
      const minWeight = (minGain * progress).toFixed(1);
      const maxWeight = (maxGain * progress).toFixed(1);

      return {
        week,
        minWeight: parseFloat(minWeight),
        maxWeight: parseFloat(maxWeight)
      };
    });
  };

  const chartData = generateChartData();

  return (
    <div className="result-container">

      <div className="result-content">
        <h2 className="result-title">Your pre-pregnancy body mass index:</h2>
        <div className="result-value">{bmi.toFixed(2)}</div>

        <h2 className="result-title">Your recommended pregnancy weight gain:</h2>
        <div className="result-value">{weightGainRange}</div>


        <div style={{ width: '100%', marginTop: '20px' }}>
          <h3 className="result-title" style={{ marginBottom: '20px' }}>
            Expected Weight Gain Range
          </h3>
          <LineChart
            width={500}
            height={250}
            data={chartData}
            margin={{ top: 5, right: 10, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              label={{
                value: 'Weeks',
                position: 'bottom'
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
            />
            <Line
              type="monotone"
              dataKey="minWeight"
              stroke="#0066cc"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>

          <div className="chart-description">
            <p>
              This graph shows how you&apos;re currently tracking toward your target pregnancy
              weight gain. The graph will indicate how much you weigh now. If the line between
              the orange and blue lines, you&apos;re within the recommended weight gain range for
              pregnant women at your body mass index (BMI). If the green dot is above or below
              those lines, you&apos;re tracking above or below your recommended weight gain.
            </p>

            <p>
              Keep in mind that these are just guidelines – they aren&apos;t set in stone. Depending on
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
};

export default PregnancyCalculationResult;