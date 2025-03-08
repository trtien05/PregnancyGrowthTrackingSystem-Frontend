import { useEffect, useState } from 'react'
import { Typography, Layout, Skeleton } from 'antd'
import DueDateCalculatorForm from '../../../components/DueDateCalculatorForm/DueDateCalculatorForm'
import axiosClient from '../../../utils/apiCaller'

const { Title } = Typography
const { Content } = Layout
function DueDateCalculator() {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)

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
            <Title level={1}>Pregnancy Due Date Calculator</Title>
          </div>
    
          <div style={{ display: 'flex' }}>
            <Content className="main-content">
              <div className="pregnancy-weight-content">
                <img
                  className="iconImg weightGainEstimator"
                  src="https://assets.babycenter.com/ims/2023/11/PregWeightGainCalc-nov-2023.svg"
                  alt="Scale icon"
                />
                <div className="calculator-container">
                  <DueDateCalculatorForm />
                </div>
              </div>
    
              <h1 className="main-title">How your fertile days are calculated</h1>
    
              <div className="intro-text">
                The Ovulation Calculator estimates when you&apos;ll ovulate by counting back 14 days from the day you expect your next period.
                (If your cycle is 28 days long, your next period should start 28 days from the first day of your last period.)
              </div>
    
              <div className="intro-text">
                Your fertile window includes the day you ovulate and the five days before, but keep in mind that you&apos;re much more likely to
                get pregnant during the last three days of this time frame.
              </div>
    
              {/* Rest of the content remains the same */}
              
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

export default DueDateCalculator