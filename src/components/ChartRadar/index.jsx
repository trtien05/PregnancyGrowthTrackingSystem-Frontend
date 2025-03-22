import { useEffect, useState } from 'react';
import axiosClient from '../../utils/apiCaller';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, Tooltip, ResponsiveContainer
} from 'recharts';

function ChartRadar({ week, id }) {
  const [radarChartGrowthMetricsByWeek, setRadarChartGrowthMetricsByWeek] = useState({
    data: [],
    max: 0
  });

  useEffect(() => {
    if (id && week) {
      const fetchRadarGrowhChart = async () => {
        try {
          const response = await axiosClient.get(`/dashboard/radar`, {
            params: {
              fetusId: id,
              week: week
            }
          });
          if (response.code === 200) {
            setRadarChartGrowthMetricsByWeek(response.data)
          }
        } catch (error) {
          console.log("Error", error)
        }
      }
      fetchRadarGrowhChart()
    }
  }, [id, week]);

  const { data, max } = radarChartGrowthMetricsByWeek;
  console.log("data", data);

  // Process data for Recharts radar chart
  const processedData = [];
  const metrics = new Set();

  if (data) {
    // Extract unique metric names
    data.forEach(item => {
      metrics.add(item.name);
    });

    // Create data structure for each metric
    metrics.forEach(metric => {
      const metricData = { name: metric };

      // Find values for this metric
      const maxValue = data.find(d => d.type === 'max' && d.name === metric)?.value || 0;
      const minValue = data.find(d => d.type === 'min' && d.name === metric)?.value || 0;
      const actualValue = data.find(d => d.type === 'value' && d.name === metric)?.value || 0;

      metricData.max = maxValue;
      metricData.min = minValue;
      metricData.value = actualValue;

      processedData.push(metricData);
    });
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      {processedData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, max]} />

            <Radar
              name="Maximum Value"
              dataKey="max"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.2}
            />

            <Radar
              name="Minimum Value"
              dataKey="min"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.2}
            />

            <Radar
              name="Actual Value"
              dataKey="value"
              stroke="#ff8042"
              fill="#ff8042"
              fillOpacity={0.6}
            />

            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ChartRadar;
