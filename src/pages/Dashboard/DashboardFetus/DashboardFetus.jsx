import { Col, Row, Skeleton } from "antd"
import './DashboardFetus.css'
import Title from "antd/es/typography/Title"
import { DollarCircleOutlined, LineChartOutlined, OrderedListOutlined, UserOutlined } from "@ant-design/icons"
function DashboardFetus() {
  return (
    <div>
      <Row gutter={[20, 20]}>
        <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-number">
            <div className="icon-wrapper">
              <DollarCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            </div>
            <div className="content-wrapper">
              <div className="title-dashboard">
                {/* {loading ? <Skeleton.Input active size="small" /> : `${revenue?.revenue.toLocaleString()}đ`} */}
              </div>
              <div className="description-dashboard">
                {/* {loading ? <Skeleton.Input active size="small" /> : `Revenue/${revenue?.month}`} */}
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-number">
            <div className="icon-wrapper">
              <LineChartOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
            </div>
            <div className="content-wrapper">
              <div className="title-dashboard">
                {/* {loading ? <Skeleton.Input active size="small" /> : `${profit?.profit.toLocaleString()}đ`} */}
              </div>
              <div className="description-dashboard">
                {/* {loading ? <Skeleton.Input active size="small" /> : `Profit/${profit?.month}`} */}
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-number">
            <div className="icon-wrapper">
              <OrderedListOutlined style={{ fontSize: '24px', color: '#faad14' }} />
            </div>
            <div className="content-wrapper">
              <div className="title-dashboard">
                {/* {loading ? <Skeleton.Input active size="small" /> : numTutor} */}
              </div>
              <div className="description-dashboard">Members</div>
            </div>
          </div>
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-number">
            <div className="icon-wrapper">
              <UserOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
            </div>
            <div className="content-wrapper">
              <div className="title-dashboard">
                {/* {loading ? <Skeleton.Input active size="small" /> : numStudent} */}
              </div>
              <div className="description-dashboard">Mom</div>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
        <Col xxl={15} xl={15} lg={15} md={24} sm={24} xs={24}>
          <div className="box">
            <Title level={5} style={{ color: '#ff7875' }}>Total Revenue</Title>
            {/* <Skeleton loading={loading} active>
              <LineChart />
            </Skeleton> */}
          </div>
        </Col>
        <Col xxl={9} xl={9} lg={9} md={24} sm={24} xs={24}>
          <div className="box">
            <Title level={5} style={{ color: '#ff7875' }}>Distribution of Baby</Title>
            {/* <Skeleton loading={loading} active /> */}
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
        <Col xxl={8} xl={8} lg={24} md={24} sm={24} xs={24}>
          <div className="box">
            <Title level={5} style={{ color: '#ff7875' }}>Revenue</Title>
            {/* <Skeleton loading={loading} active>
              <ColumnChart />
            </Skeleton> */}
          </div>
        </Col>
        <Col xxl={16} xl={16} lg={24} md={24} sm={24} xs={24}>
          <div className="box">
            <Title level={5} style={{ color: '#ff7875' }}>Top Members</Title>
            {/* <Skeleton active loading={loading}>
              <TopTutor />
            </Skeleton> */}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardFetus