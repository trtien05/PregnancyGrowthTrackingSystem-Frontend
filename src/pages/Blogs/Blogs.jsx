import { Card, Row, Col, Typography, Pagination, Carousel, Skeleton } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import './Blogs.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

const { Title, Paragraph } = Typography

const tools = [
  {
    name: 'Ovulation Calculator',
    icon: 'https://assets.babycenter.com/ims/2023/11/Ovulation-Calculator-nov-2023.svg',
    path: 'tool-ovulation'
  },
  {
    name: 'Due Date Calculator',
    icon: 'https://assets.babycenter.com/ims/2023/11/DueDateCalculator-nov-2023.svg',
    path: 'tool-due-date'
  },
  {
    name: 'Pregnancy Weight Gain Calculator',
    icon: 'https://assets.babycenter.com/ims/2023/11/PregWeightGainCalc-nov-2023.svg',
    path: 'tool-preg-weight'
  },
  {
    name: 'Birth Plan Worksheet',
    icon: 'https://assets.babycenter.com/ims/2023/11/BirthPlanWorksheet-nov-2023.svg',
    path: 'tool-worksheet'
  }
]

const BlogPage = () => {
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const limit = 6
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8080/api/v1/blog-posts?page=${page}&size=${limit}`)
        setArticles(response.data.data.content)
        setTotalElements(response.data.data.totalElements)
      } catch (error) {
        console.error('Failed to fetch articles: ', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [page])

  return (
    <div className="blog-container">
      {/* Danh sách bài viết */}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <Carousel autoplay>
              {articles.map((article) => (
                <div key={article.id} className="carousel-slide">
                  <div className="featured-image-container">
                    <img alt={article.pageTitle} src={article.featuredImageUrl} className="featured-image" />
                    <div className="featured-content">
                      <Title level={2} className="featured-title">
                        {article.pageTitle}
                      </Title>
                      <button className="read-more-btn">
                        Read more <RightOutlined />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        </Col>
      </Row>

      {/* Danh sách công cụ */}
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={24}>
          <Title className="tools-title">Popular tools</Title>
        </Col>
        {tools.map((tool, index) => (
          <Col xs={12} sm={8} md={6} lg={4} key={index}>
            <Link to={tool.path}>
              <Card hoverable className="tool-card">
                <img src={tool.icon} alt={tool.name} className="tool-icon" />
                <Title level={5} className="tool-name">
                  {tool.name}
                </Title>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {loading ? (
        [...Array(6)].map((_, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card hoverable className="article-card">
              <Skeleton active />
            </Card>
          </Col>
        ))
      ) : (
        <Row gutter={[16, 16]} justify="center">
          <Col span={24}>
            <Title className="tools-title">Blog Post</Title>
          </Col>
          {articles.map((article) => (
            <Col xs={24} sm={12} lg={8} key={article.id}>
              <Link to={`/blogs/${article.id}`} className="read-more-link">
                <Card hoverable className="article-card">
                  <div className="article-image-container">
                    <img alt={article.pageTitle} src={article.featuredImageUrl} className="article-image" />
                  </div>
                  <div className="article-content">
                    <Title level={4} className="article-title">
                      {article.pageTitle}
                    </Title>
                    <Paragraph ellipsis={{ rows: 3 }} className="article-excerpt">
                      {article.shortDescription}
                    </Paragraph>
                    <Link to={`/blogs/${article.id}`} className="read-more-link">
                      Read more <RightOutlined />
                    </Link>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      <Row justify="center" className="pagination-container">
        <Col>
          <Pagination total={totalElements} onChange={(page) => setPage(page - 1)} />
        </Col>
      </Row>
    </div>
  )
}

export default BlogPage
