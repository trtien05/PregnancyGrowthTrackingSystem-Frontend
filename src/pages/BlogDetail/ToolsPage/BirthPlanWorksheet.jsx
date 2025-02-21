import { CalendarOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'
import { Content } from 'antd/es/layout/layout'
const { Title } = Typography;
const { Text } = Typography;


function BirthPlanWorksheet() {
  return (
    <div className="layout-container">
      <div className="article-header">
        <Title level={1}>BirthPlanWorksheet</Title>
      </div>

      <div style={{ display: "flex" }}>
        <Content className="main-content">
          <div className="date-tag">
            <Tag color="blue">Pregnancy</Tag>
            <div>
              <CalendarOutlined /> August 20, 2022
            </div>
          </div>


          <div className="article-content">

            <Text className="intro-text">123</Text>
          </div>
        </Content>

        {/* <div className="keep-reading-container">
          <h2 className="keep-reading-header">KEEP READING</h2>

          <div className="article-list">
            {loading ? (
              <>
                <Skeleton active paragraph={{ rows: 5 }} />
              </>
            ) : (
              relatedArticles.map((article, index) => (
                <a key={index} href={`/blogs/${article.id}`} className="article-item">
                  <img src={article.featuredImageUrl} alt={article.pageTitle} className="article-image-read" />
                  <h3 className="article-title-read">{article.pageTitle}</h3>
                </a>
              ))
            )}
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default BirthPlanWorksheet