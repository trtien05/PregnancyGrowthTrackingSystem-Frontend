import { useEffect, useState } from "react"
import './Pregnancy.css'
import { Table, Tag, Empty } from 'antd'
import axiosClient from "../../../../utils/apiCaller";
import Fetus from "./Fetus";

function PregnancyPage() {
  const [pregnancy, setPregnancy] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    const fetchPregnancy = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/pregnancies/me');
        if (response.code === 200) {
          setPregnancy(response.data);
          // If API returns paginated data structure, update accordingly
          if (response.data.content) {
            setPregnancy(response.data.content);
            setTotalElements(response.data.totalElements);
          } else {
            setPregnancy(response.data);
            setTotalElements(response.data.length);
          }
        }
      } catch (error) {
        console.log('Failed to fetch pregnancy: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPregnancy();
  }, [currentPage]);
  console.log("pregnancy", pregnancy);
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Define table columns
  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 70,
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
    },
    {
      title: 'Start Date',
      dataIndex: 'pregnancyStartDate',
      key: 'pregnancyStartDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'Not yet delivered',
    },
    {
      title: 'Maternal Age',
      dataIndex: 'maternalAge',
      key: 'maternalAge',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record) => {
        const today = new Date();
        const dueDate = new Date(record.dueDate);

        if (record.deliveryDate) {
          return <Tag color="green">Delivered</Tag>;
        } else if (today > dueDate) {
          return <Tag color="red">Overdue</Tag>;
        } else {
          return <Tag color="blue">Ongoing</Tag>;
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Fetus id={record.id} />
      ),
    }
  ];

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Pregnancy Management</h2>
      <Table
        className="ant-order-table"
        columns={columns}
        dataSource={pregnancy}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 5,
          total: totalElements,
          current: currentPage,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: <Empty description="No pregnancy records found" />
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default PregnancyPage