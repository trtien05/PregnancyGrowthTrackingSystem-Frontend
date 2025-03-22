import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import axiosClient from '../utils/apiCaller';

const ColumnChart = ({ fetusId, week, metrics }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for each metric
        const dataPromises = metrics.map(async (metric) => {

          // Changed from query parameters to path parameters as required by the API
          const response = await axiosClient.get(`/dashboard/column`, { params: { fetusId, week, metricId: metric.id } }
          );

          if (response.code === 200 && response.data) {
            return {
              metricName: metric.name,
              value: response.data.value,
              unit: metric.unit
            };
          }
          return null;
        });

        const results = await Promise.all(dataPromises);
        const validResults = results.filter(result => result !== null);
        setChartData(validResults);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    if (fetusId && week && metrics && metrics.length > 0) {
      fetchData();
    }
  }, [fetusId, week, metrics]);

  const config = {
    data: chartData,
    xField: 'metricName',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
      formatter: (datum) => `${datum.value} ${datum.unit}`,
    },
    meta: {
      metricName: {
        alias: 'Metric',
      },
      value: {
        alias: 'Value',
      },
    },
  };

  return (
    <div className="chart-container">
      {chartData.length > 0 ? (
        <Column {...config} />
      ) : (
        <p>No data available for the selected week</p>
      )}
    </div>
  );
};

export default ColumnChart;
