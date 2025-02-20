import { Typography, Layout, List, Tag } from "antd"
import { CalendarOutlined } from "@ant-design/icons"
import "./BlogDetail.css"

const { Title, Text } = Typography
const { Content } = Layout

const relatedArticles = [
  {
    title: "The Importance of Sleep for Moms and Babies: Tips to Rest Better",
    image: "https://s3.gomedia.ws/wp-content/uploads/sites/72/2021/09/17191023/cute-baby-scaled.jpeg",
  },
  {
    title: 'The Ultimate Guide to Babyproofing Your Home that "Keep Your Baby Safe"',
    image: "https://s3.gomedia.ws/wp-content/uploads/sites/72/2021/09/17191023/cute-baby-scaled.jpeg",
  },
  {
    title: "Common Newborn Health Issues and How to Handle Them Like a Pro",
    image: "https://s3.gomedia.ws/wp-content/uploads/sites/72/2021/09/17191023/cute-baby-scaled.jpeg",
  },
]

const foods = [
  {
    title: "Leafy Greens (Spinach, Kale)",
    description:
      "Rich in folic acid, vitamin C, and iron, leafy greens support the development of your baby's brain and spine while keeping you energized. You can add spinach to smoothies or salads for a nutrient boost.",
  },
  {
    title: "Greek Yogurt",
    description:
      "A great source of calcium, which is essential for the development of your baby's bones and teeth. You can enjoy it with fresh fruit and honey for a healthy snack.",
  },
]

export default function BlogDetail() {
  return (
    <div className="layout-container">
      <div className="article-header">
        <Title level={1}>Top 10 Foods Every Pregnant Mom Should Include in Her Diet</Title>

      </div>
      <div style={{ display: "flex" }}>

        <Content className="main-content">
          <div className="date-tag">
            <Tag color="blue">Pregnancy</Tag>
            <div>
              <CalendarOutlined /> August 20, 2022

            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://s3.gomedia.ws/wp-content/uploads/sites/72/2021/09/17191023/cute-baby-scaled.jpeg"
              alt="Healthy salad with spinach and sweet potatoes"
            />
          </div>

          <div className="article-content">
            <Text className="intro-text">
              Pregnancy is a time when your body requires additional nutrients to support both your health and your baby&apos;s
              development. A well-balanced diet can help reduce risks of complications, boost energy levels, and ensure
              the baby receives essential nutrients for proper growth.
            </Text>

            <Title level={2}>Top 10 Superfoods for Pregnant Moms</Title>
            <List
              itemLayout="vertical"
              dataSource={foods}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={item.title} description={item.description} />
                </List.Item>
              )}
            />
          </div>
        </Content>


        <div className="keep-reading-container">
          <h2 className="keep-reading-header">
            KEEP READING
          </h2>

          <div className="articles-list">
            {relatedArticles.map((article, index) => (
              <a
                key={index}
                href={article.link}
                className="article-item"
              >
                <img
                  src={article.image}
                  alt={article.alt}
                  className="article-image-read"
                />
                <h3 className="article-title-read">
                  {article.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

