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
            const response = await axiosClient.get(`/dashboard/column?fetusId=${fetusId}&metricId=${metric.metricId}&week=${week}`);

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
      // Extract metric info
      const metricName = item.metric.name;
      const unit = item.metric.unit;
      
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
      
      // Create a single data item for this metric's chart
      const chartData = [{
        name: metricName,
        value: value
      }];
      
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
        color: COLORS[index % COLORS.length],
        chartData
      };
    });
    
    setProcessedData(formattedData);
  }, [chartData]);

  // Render a single bar chart for one metric
  const renderMetricBarChart = (metric) => {
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
              data={[{ name: metric.metricName, value: metric.value }]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                domain={[
                  // Set domain to ensure min/max lines are visible
                  Math.min(metric.minValue * 0.9 || 0, metric.value * 0.9 || 0),
                  Math.max(metric.maxValue * 1.1 || 100, metric.value * 1.1 || 100)
                ]}
              />
              <Tooltip
                formatter={(value) => [`${value} ${metric.unit}`, metric.metricName]}
                labelFormatter={() => metric.metricName}
              />
              <Bar dataKey="value" fill={metric.color} name={metric.metricName} />
              
              {/* Add reference lines for min and max values */}
              {metric.minValue !== null && (
                <ReferenceLine 
                  y={metric.minValue} 
                  stroke="#666" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `Min: ${metric.minValue}`, 
                    position: 'insideLeft', 
                    fontSize: 10 
                  }} 
                />
              )}
              {metric.maxValue !== null && (
                <ReferenceLine 
                  y={metric.maxValue} 
                  stroke="#666" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `Max: ${metric.maxValue}`, 
                    position: 'insideLeft', 
                    fontSize: 10 
                  }} 
                />
              )}
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
        background: 'white'
      }}
    >
      <Title level={4} style={{ textAlign: 'center', marginBottom: 16 }}>
        Baby Growth Metrics - Week {week}
      </Title>
      
      <Row gutter={[16, 16]}>
        {processedData.map((metric, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            {renderMetricBarChart(metric)}
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: 16, padding: '0 16px' }}>
        <Text type="secondary">
          Each chart shows the measured value and normal range for a specific metric.
        </Text>
      </div>
    </Card>
  );
};

export default BarChart;