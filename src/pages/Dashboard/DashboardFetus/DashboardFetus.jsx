import { Col, Row, Skeleton } from "antd"
import './DashboardFetus.css'
import Title from "antd/es/typography/Title"
import { useState } from "react";

function DashboardFetus() {
  const [metrics, setMetrics] = useState([]);
  const { id } = useParams();


  return (
    <div className="pregnancy-container">
      <h1 >My pregnancy week by week</h1>
    </div>
  )
}

export default DashboardFetus