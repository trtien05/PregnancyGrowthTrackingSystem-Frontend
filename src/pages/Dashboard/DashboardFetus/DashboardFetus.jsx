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
        <h2 className="text-xl font-bold mb-2">Biểu đồ theo dõi thai nhi</h2>
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
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                label={{ value: 'Tuần thai', position: 'insideBottomRight', offset: 0 }}
              />
              <YAxis
                label={{
                  value: `${currentMeasurement.name || ''} (${currentMeasurement.unit || ''})`,
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} ${currentMeasurement.unit || ''}`, currentMeasurement.name || '']}
                labelFormatter={(label) => `Tuần ${label}`}
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
                stroke="#ccc"
                strokeDasharray="5 5"
                name="Giới hạn dưới"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey={`${currentMeasurementKey}_Max`}
                stroke="#ccc"
                strokeDasharray="5 5"
                name="Giới hạn trên"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Không có dữ liệu để hiển thị
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Biểu đồ này hiển thị giá trị {getCurrentMeasurement().name} theo tuần thai</p>
        <p>Đường liền nét thể hiện giá trị đo được, đường đứt nét thể hiện giới hạn bình thường</p>
        <p>Nhập cân nặng và các chỉ số mỗi tuần để theo dõi sự phát triển của thai nhi</p>
      </div>
    </div>
  )
}

export default DashboardFetus