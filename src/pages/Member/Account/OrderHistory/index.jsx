import  { useEffect, useState } from 'react'
import axiosClient from '../../../../utils/apiCaller'
import { Table, Tag, Empty } from 'antd'
import './OderHistory.css'

function OrderHistoryPage() {
  const [order, setOrder] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get('/orders/my-orders');
        if (response.code === 200) {
          setOrder(response.data)
        }
      } catch (error) {
        console.log("Failed to fetch order: ", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [])

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency with commas and VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(amount)
      .replace('₫', 'VND');
  };

  // Define table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Payment Method',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider) => provider ? provider.toUpperCase() : '-',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (id) => id || '-',
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date) => formatDate(date),
    },
    {
      title: 'Membership Period',
      key: 'membershipPeriod',
      render: (record) => (
        <span>
          {formatDate(record['startDate'])} - {formatDate(record.endDate)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (!status) return <Tag color="default">UNKNOWN</Tag>;
        
        let color = 'green';
        
        if (status === 'PENDING') {
          color = 'orange';
        } else if (status === 'FAILED') {
          color = 'red';
        }
        
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Transaction History</h2>
      <Table
        className="ant-order-table"
        columns={columns}
        dataSource={order}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: <Empty description="No transaction history found" />
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default OrderHistoryPage