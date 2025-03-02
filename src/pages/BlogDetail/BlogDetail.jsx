import { Typography, Layout, Tag, Skeleton } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import './BlogDetail.css'
import { useEffect, useState } from 'react'

import ArticleFeedback from '../../components/ArticleFeedback'
import useAuth from '../../hooks/useAuth'
import axiosClient from '../../utils/apiCaller'

const { Title, Text } = Typography
const { Content } = Layout

export default function BlogDetail() {
  const { user } = useAuth();
  const id = parseInt(window.location.pathname.split('/').pop())
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/blog-posts/${id}`)

        setArticle(response.data)
      } catch (error) {
        console.error('Failed to fetch article: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/blog-posts?page=0&size=3`)
        setRelatedArticles(response.data.content)
      } catch (error) {
        console.error('Failed to fetch related articles: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedArticles()
  }, [])

  return (
    <div className="layout-container">
      <div className="article-header">
        {loading ? <Skeleton active paragraph={{ rows: 0 }} /> : <Title level={1}>{article.pageTitle}</Title>}
      </div>

      <div style={{ display: 'flex' }}>
        <Content className="main-content">
          <div className="date-tag">
            <Tag color="blue">Pregnancy</Tag>
            <div>
              <CalendarOutlined /> August 20, 2022
            </div>
          </div>

          <div className="hero-image">
            {loading ? <Skeleton.Image className="hero-image" /> : <img src={article.featuredImageUrl} alt={article.pageTitle} />}
          </div>

          <div className="article-content">
            {loading ? <Skeleton active paragraph={{ rows: 5 }} /> : <Text className="intro-text">{article.content}</Text>}
          </div>
          {user && <ArticleFeedback blogPostId={id} userId={user.id} role={user.role} />}
        </Content>

        <div className="keep-reading-container">
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
        </div>
      </div>
    </div>
  )
}
