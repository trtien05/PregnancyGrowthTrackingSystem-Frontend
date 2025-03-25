import React, { useEffect, useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import axiosClient from '../../utils/apiCaller';
import { Spin, Empty, Card, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;

// Color palette for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#ff5252', '#00C49F', '#FFBB28'];

const BarChart = ({ fetusId, week, metrics }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data for each metric
        const dataPromises = metrics
          .filter(metric => metric && metric.metricId)
          .map(async (metric) => {
            const response = await axiosClient.get(`/dashboard/bar?fetusId=${fetusId}&week=${week}`);

            if (response.code === 200 && response.data) {
              return response.data;
            }
            return null;
          });

        const results = await Promise.all(dataPromises);
        const validResults = results.filter(result => result !== null);
        setChartData(validResults);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (fetusId && week && metrics && metrics.length > 0) {
      fetchData();
    }
  }, [fetusId, week, metrics]);

  // Process the data for the chart when chartData changes
  useEffect(() => {
    if (!chartData || chartData.length === 0) return;

    const formattedData = chartData.map((item, index) => {
      // Extract metric info from the first data point to get name
      const firstDataPoint = item.data[0];
      const metricName = firstDataPoint ? firstDataPoint.name : item.metric?.name || 'Unknown';
      const unit = item.metric?.unit || '';

      // Find min, max and value data points
      const valueData = item.data.find(d => d.type === 'value');
      const minData = item.data.find(d => d.type === 'min');
      const maxData = item.data.find(d => d.type === 'max');

      const value = valueData ? valueData.value : null;
      const minValue = minData ? minData.value : null;
      const maxValue = maxData ? maxData.value : null;

      // Determine status
      let status = 'normal';
      let statusText = 'Normal';
      let statusColor = '#4caf50';

      if (value !== null && minValue !== null && maxValue !== null) {
        if (value < minValue) {
          status = 'low';
          statusText = 'Below normal';
          statusColor = '#ff5252';
        } else if (value > maxValue) {
          status = 'high';
          statusText = 'Above normal';
          statusColor = '#ff5252';
        }
      }

      return {
        id: `metric_${index}`,
        metricName,
        value,
        minValue,
        maxValue,
        unit,
        status,
        statusText,
        statusColor,
        color: COLORS[index % COLORS.length]
      };
    });

    setProcessedData(formattedData);
  }, [chartData]);

  // Render a single bar chart for one metric
  const renderMetricBarChart = (metric) => {
    // Create a comparative bar chart data structure
    const visualizationData = [
      {
        name: "Min",
        value: metric.minValue,
        fill: "#8884d8"
      },
      {
        name: "Current",
        value: metric.value,
        fill: metric.status === 'normal' ? '#4caf50' : '#ff5252'
      },
      {
        name: "Max",
        value: metric.maxValue,
        fill: "#82ca9d"
      }
    ];

    return (
      <Card
        title={metric.metricName}
        style={{ marginBottom: 16, borderRadius: 8 }}
        headStyle={{ backgroundColor: '#fafafa' }}
        bodyStyle={{ padding: '12px' }}
      >
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <Text strong>Value: {metric.value} {metric.unit}</Text>
          <Text style={{ color: metric.statusColor }}>{metric.statusText}</Text>
        </div>

        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={visualizationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value} ${metric.unit}`, ""]}
                labelFormatter={(label) => `${label} Value`}
              />
              <Bar
                dataKey="value"
                background={{ fill: '#eee' }}
                label={{
                  position: 'right',
                  formatter: (value) => `${value} ${metric.unit}`,
                  fontSize: 12
                }}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {metric.minValue !== null && metric.maxValue !== null
              ? `Normal range: ${metric.minValue} - ${metric.maxValue} ${metric.unit}`
              : 'Normal range not available'}
          </Text>
        </div>
      </Card>
    );
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}><Spin size="large" /></div>;
  }

  if (!processedData || processedData.length === 0) {
    return (
      <Card style={{ borderRadius: 8, textAlign: 'center', padding: 24 }}>
        <Empty description="No data available for the selected week" />
      </Card>
    );
  }

  return (
    <Card
      className="chart-card"
      style={{
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        background: 'white',
      }}
    >
      <Title level={4} style={{ textAlign: 'center', marginBottom: 16 }}>
        Baby Growth Metrics - Week {week}
      </Title>
      <Row
        gutter={[16, 16]}
        justify={processedData.length === 1 ? 'center' : 'start'}
      >
        {processedData.map((metric, index) => (
          <Col
            xs={24}
            sm={processedData.length === 1 ? 16 : 12}
            lg={processedData.length === 1 ? 12 : 8}
            key={index}
          >
            {renderMetricBarChart(metric)}
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default BarChart;