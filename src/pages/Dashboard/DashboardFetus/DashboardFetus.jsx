import { Skeleton, Tooltip } from "antd"
import './DashboardFetus.css'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../utils/apiCaller";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

function DashboardFetus() {
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosClient.get(`/fetus-metrics/fetus/${id}/all-metrics`);
        if (response.code === 200) {
          setMetrics(response.data);
          return response.data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch metrics: ', error);
        return [];
      }
    };

    const fetchMetricData = async (metricId) => {
      try {
        const response = await axiosClient.get(`/dashboard/line?fetusId=${id}&metricId=${metricId}`);
        if (response.code === 200) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error(`Failed to fetch data for metric ${metricId}: `, error);
        return null;
      }
    };

    const processData = async () => {
      setLoading(true);
      const metricsData = await fetchMetrics();

      if (!metricsData.length) {
        setLoading(false);
        return;
      }

      // Fetch data for each metric
      const metricResults = await Promise.all(
        metricsData.map(metric => fetchMetricData(metric.id))
      );

      // Process the data into combined format
      const processedData = combineMetricData(metricResults);
      setChartData(processedData);
      setLoading(false);
    };

    processData();
  }, [id]);

  // Function to combine all metric data into the required format
  const combineMetricData = (metricResults) => {
    // Filter out any null results
    const validResults = metricResults.filter(result => result !== null);

    if (!validResults.length) return [];

    // Create a map of week -> data object
    const weekMap = new Map();

    validResults.forEach(result => {
      const metricName = result.metric.name.replace(/\s+/g, '');

      result.data.forEach(point => {
        // Extract week number from "Week X" format
        const weekMatch = point.name.match(/Week\s+(\d+)/i);
        if (!weekMatch) return;

        const week = parseInt(weekMatch[1]);

        if (!weekMap.has(week)) {
          weekMap.set(week, { week });
        }

        const weekData = weekMap.get(week);

        // Add the data point based on type
        if (point.type === 'value') {
          weekData[metricName] = point.value;
        } else if (point.type === 'min') {
          weekData[`${metricName}_Min`] = point.value;
        } else if (point.type === 'max') {
          weekData[`${metricName}_Max`] = point.value;
        }
      });
    });

    // Convert the map to array and sort by week
    return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
  };

  // Create measurements array based on metrics

  const [selectedMeasurement, setSelectedMeasurement] = useState(null);

  useEffect(() => {
    // Set the first metric as selected when metrics are loaded
    if (metrics.length > 0 && !selectedMeasurement) {
      setSelectedMeasurement(metrics[0].id);
    }
  }, [metrics, selectedMeasurement]);

  const getCurrentMeasurement = () => {
    return metrics.find(m => m.id === selectedMeasurement) || {};
  };
  console.log("metrics", metrics);
  console.log("chartData", chartData);
  const formatChartData = (chartData) => {
    return chartData.map((entry) => {
      const formattedEntry = { week: entry.week };

      Object.keys(entry).forEach((key) => {
        if (key !== "week") {
          formattedEntry[key] = entry[key];
        }
      });

      return formattedEntry;
    });
  };
  // Kết quả mong muốn
  const formattedData = formatChartData(chartData);
  console.log("formattedData", formattedData);

  // Get the current measurement name without spaces to match the data keys
  const currentMeasurement = getCurrentMeasurement();
  const currentMeasurementKey = currentMeasurement.name?.replace(/\s+/g, '') || '';

  return (
    <div >
      <div className="mb-4">
        <h2  style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Fetal monitoring chart</h2>
        <div className="metrics-buttons">
          {metrics.map(measure => (
            <button
              key={measure.id}
              className={`metric-button ${selectedMeasurement === measure.id ? 'metric-button-active' : 'metric-button-inactive'}`}
              onClick={() => setSelectedMeasurement(measure.id)}
            >
              {measure.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: "400px", marginTop: "20px" }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : formattedData.length > 0 ? (
          <ResponsiveContainer width="90%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                label={{ value: 'Week', position: 'insideBottomRight', offset: 0 }}
              />
              <YAxis
                label={{
                  value: `${currentMeasurement.name || ''} (${currentMeasurement.unit || ''})`,
                  angle: -90,
                  position: 'insideLeft',
                  offset: -20,
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} ${currentMeasurement.unit || ''}`, currentMeasurement.name || '']}
                labelFormatter={(label) => `Week ${label}`}
              />
              <Legend />

              <Line
                type="monotone"
                dataKey={currentMeasurementKey}
                stroke={currentMeasurement.color || '#1890ff'}
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
                name={currentMeasurement.name || ''}
              />

              <Line
                type="monotone"
                dataKey={`${currentMeasurementKey}_Min`}
                stroke="#FF8C00"  
                strokeDasharray="5 5"
                strokeWidth={3}
                name="Lower limit"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey={`${currentMeasurementKey}_Max`}
                stroke="#4CAF50"  
                strokeDasharray="5 5"
                strokeWidth={3}
                name="Upper limit"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-data-container" style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            border: '2px dashed #ccc',
            borderRadius: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '64px', width: '64px', marginBottom: '16px', color: '#aaa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No data</h3>
                <p style={{ textAlign: 'center', marginBottom: '8px' }}>No fetal follow-up data are available.</p>
                <p style={{ textAlign: 'center' }}>Update your baby's indicators periodically to monitor development.</p>
          </div>
        )}
      </div>


    </div>
  )
}

export default DashboardFetus