import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import axiosClient from '../../utils/apiCaller';
import { Spin, Empty, Card, Tabs, Typography, Tag, Row, Col, Progress } from 'antd';
import { BarChartOutlined, TableOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Color palette for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#ff5252', '#00C49F', '#FFBB28'];

const ColumnChart = ({ fetusId, week, metrics }) => {
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

      // Calculate percentage within normal range
      let percentage = 50; // Default to middle
      let status = 'Không có đủ dữ liệu';
      let statusColor = '#8c8c8c';

      if (value !== null && minValue !== null && maxValue !== null) {
        const range = maxValue - minValue;
        if (range > 0) {
          percentage = Math.min(Math.max(((value - minValue) / range) * 100, 0), 100);
        }

        if (value < minValue) {
          status = 'Below normal';
          statusColor = '#ff5252';
        } else if (value > maxValue) {
          status = 'Above normal';
          statusColor = '#ff5252';
        } else {
          status = 'Normal';
          statusColor = '#4caf50';
        }
      }

      return {
        id: `metric_${index}`,
        metricName,
        value,
        minValue,
        maxValue,
        unit,
        percentage,
        status,
        statusColor,
        color: COLORS[index % COLORS.length]
      };
    });

    setProcessedData(formattedData);
  }, [chartData]);

  const renderMetricCard = (metric) => {
    // Prepare chart data
    const chartData = [{
      name: 'Giá trị',
      value: metric.value,
      min: metric.minValue,
      max: metric.maxValue
    }];

    // Set Y-axis domain
    const yDomain = [
      Math.min(metric.minValue * 0.9 || 0, metric.value * 0.9 || 0),
      Math.max(metric.maxValue * 1.1 || 100, metric.value * 1.1 || 100)
    ];

    return (
      <Card
        title={metric.metricName}
        className="metric-card"
        style={{ marginBottom: 16, height: '100%', overflow: 'hidden' }}
        size="small"
      >
        <div  style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {metric.value} {metric.unit}
          </Text>
          <Text style={{ color: metric.statusColor }}>{metric.status}</Text>
        </div>

        {/* Progress bar showing position within range */}
        {metric.minValue !== null && metric.maxValue !== null && (
          <div style={{ marginBottom: 16 }}>
            <Progress
              percent={metric.percentage}
              showInfo={false}
              strokeColor={metric.color}
              trailColor="#f0f0f0"
              size="small"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8c8c8c' }}>
              <span>{metric.minValue} {metric.unit}</span>
              <span>{metric.maxValue} {metric.unit}</span>
            </div>
          </div>
        )}

        {/* Bar chart */}
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={yDomain} />
              <Tooltip
                formatter={(value) => [`${value} ${metric.unit}`, metric.metricName]}
                labelFormatter={() => metric.metricName}
              />
              {metric.minValue !== null && (
                <ReferenceLine
                  y={metric.minValue}
                  stroke="#666"
                  strokeDasharray="3 3"
                  label={{ value: 'Min', position: 'insideBottomLeft', fontSize: 11 }}
                />
              )}
              {metric.maxValue !== null && (
                <ReferenceLine
                  y={metric.maxValue}
                  stroke="#666"
                  strokeDasharray="3 3"
                  label={{ value: 'Max', position: 'insideTopLeft', fontSize: 11 }}
                />
              )}
              <Bar dataKey="value" fill={metric.color} name={metric.metricName} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  };

  const renderCharts = () => (
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
          {renderMetricCard(metric)}
        </Col>
      ))}
    </Row>
  );

  const renderTable = () => (
    <div className="metrics-table" style={{ marginTop: 24 }}>
      {processedData.map((metric, index) => (
        <Card
          key={index}
          title={metric.metricName}
          style={{ marginBottom: 16 }}
          size="small"
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Value:</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  <Tag color={metric.statusColor} style={{ fontSize: '14px', padding: '4px 8px' }}>
                    {metric.value} {metric.unit}
                  </Tag>
                </td>
              </tr>
              {metric.minValue !== null && (
                <tr>
                  <td style={{ padding: '8px' }}>Minimum Range:</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>{metric.minValue} {metric.unit}</td>
                </tr>
              )}
              {metric.maxValue !== null && (
                <tr>
                  <td style={{ padding: '8px' }}>Maximum Range:</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>{metric.maxValue} {metric.unit}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '8px' }}>Status:</td>
                <td style={{ padding: '8px', textAlign: 'right', color: metric.statusColor }}>
                  {metric.status}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      ))}
    </div>
  );

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

      <Tabs defaultActiveKey="chart" centered>
        <TabPane
          tab={<span><BarChartOutlined /> Chart View</span>}
          key="chart"
        >
          <div style={{ padding: '12px' }}>
            {renderCharts()}
          </div>
        </TabPane>
        <TabPane
          tab={<span><TableOutlined /> Table View</span>}
          key="table"
        >
          {renderTable()}
        </TabPane>
      </Tabs>

      <div style={{ textAlign: 'center', marginTop: 16, padding: '0 16px' }}>
        <Text type="secondary">
          The chart shows fetal indices for week {week}.
          The colored bars represent measured values, the dashed lines represent normal limits.
        </Text>
      </div>
    </Card>
  );
};

export default ColumnChart;
