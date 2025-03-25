import  { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Statistic, Table, Spin, Typography, Divider 
} from 'antd';
import {
  BarChart, Bar,  PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { UserOutlined, DollarOutlined, ShoppingOutlined } from '@ant-design/icons';
import axiosClient from '../../../utils/apiCaller';
const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [membershipStats, setMembershipStats] = useState(null);
  const [membershipPurchases, setMembershipPurchases] = useState(null);
  const [planDistribution, setPlanDistribution] = useState(null);
  const [roleDistribution, setRoleDistribution] = useState(null);
  const [ageDistribution, setAgeDistribution] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [statsRes, purchasesRes, distRes, rolesRes, ageRes] = await Promise.all([
          axiosClient.get('/admin/dashboard/membership-plan-stats'),
          axiosClient.get('/admin/dashboard/membership-purchases'),
          axiosClient.get('/admin/dashboard/membership-plan-user-distribution'),
          axiosClient.get('/admin/dashboard/role-distribution'),
          axiosClient.get('/admin/dashboard/user-age-ranges')
        ]);
        
        setMembershipStats(statsRes.data);
        setMembershipPurchases(purchasesRes.data);
        setPlanDistribution(distRes.data);
        setRoleDistribution(rolesRes.data);
        setAgeDistribution(ageRes.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  console.log("membershipStats", membershipStats);
  console.log("membershipPurchases", membershipPurchases);
  console.log("planDistribution", planDistribution);
  console.log("roleDistribution", roleDistribution);
  console.log("ageDistribution", ageDistribution);

  // Transform role data for PieChart
  const prepareRoleData = () => {
    if (!roleDistribution) return [];
    
    return Object.entries(roleDistribution.roleCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  // Transform age range data for BarChart
  const prepareAgeData = () => {
    if (!ageDistribution) return [];
    
    return Object.entries(ageDistribution.ageRangeCounts).map(([range, count]) => ({
      range,
      count
    }));
  };

  // Transform plan distribution data for BarChart
  const preparePlanData = () => {
    if (!planDistribution) return [];
    return planDistribution.planDistribution.map(plan => ({
      name: plan.planName,
      purchases: plan.totalPurchases,
      users: plan.uniqueUsers,
      price: plan.price / 1000000  // Convert to millions for better display
    }));
  };

  // Columns for purchase history table
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Plan',
      dataIndex: 'planName',
      key: 'planName',
    },
    {
      title: 'Price',
      dataIndex: 'planPrice',
      key: 'planPrice',
      render: (price) => `${price.toLocaleString()} VND`
    },
    {
      title: 'Duration (months)',
      dataIndex: 'planDuration',
      key: 'planDuration',
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      <Divider />
      
      {/* Key Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Total Membership Purchases" 
              value={membershipStats?.totalPurchases || 0} 
              prefix={<ShoppingOutlined />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Total Revenue" 
              value={membershipStats?.totalRevenue || 0} 
              precision={0} 
              prefix={<DollarOutlined />} 
              suffix="VND"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Total Users" 
              value={roleDistribution?.totalUsers || 0} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="User Role Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareRoleData()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {prepareRoleData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="User Age Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareAgeData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                <Legend />
                <Bar dataKey="count" name="Users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Membership Plan Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={preparePlanData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  yAxisId="left" 
                  domain={[0, 'dataMax + 1']} 
                  tickCount={6}
                  label={{ value: "Number of Users/Purchases", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  domain={[0, 'dataMax']} 
                  tickFormatter={(value) => `${value}M`}
                  tickCount={6}
                  label={{ value: "Price (Million VND)", angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                />
                <Tooltip formatter={(value, name) => {
                  if (name === "Price (Million VND)") return [`${value} Million VND`, name];
                  return [value, name];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="purchases" name="Total Purchases" fill="#0088FE" />
                <Bar yAxisId="left" dataKey="users" name="Unique Users" fill="#00C49F" />
                <Bar yAxisId="right" dataKey="price" name="Price (Million VND)" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Purchases Table */}
      <Card title="Recent Membership Purchases" style={{ marginBottom: 24 }}>
        <Table 
          dataSource={membershipPurchases?.content || []} 
          columns={columns} 
          rowKey="orderId"
          pagination={{
            total: membershipPurchases?.totalElements,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`
          }}
        />
      </Card>
    </div>
  );
}

export default Dashboard;