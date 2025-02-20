import { Card, Row, Col, Typography, Pagination, Tag, Carousel } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import './Blogs.css';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const BlogPage = () => {
  const articles = [
    {
      id: 1,
      category: 'Health',
      title: 'Top 10 Foods Every Pregnant Mom Should Include in Her Diet',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKGvxtr7vmYvKw_dBgBPf98isHM4Cz6REorg&s',
      featured: true
    },
    {
      id: 2,
      category: 'Health',
      title: 'The Importance of Sleep for Moms and Babies: Tips to Rest Better',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKGvxtr7vmYvKw_dBgBPf98isHM4Cz6REorg&s',
      featured: true
    },
    {
      id: 3,
      category: 'Health',
      title: '5 Simple Prenatal Yoga Poses to Reduce Stress and Boost Energy',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKGvxtr7vmYvKw_dBgBPf98isHM4Cz6REorg&s',
      featured: true
    },
    {
      id: 4,
      category: 'Health',
      title: 'Pregnancy Warning Signs You Should Never Ignore',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKGvxtr7vmYvKw_dBgBPf98isHM4Cz6REorg&s',
      excerpt: 'By Texas Health and Human services: If you experience any of these symptoms during or after[...]'
    },
    {
      id: 5,
      category: 'Fun',
      title: 'Fun and Educational Games to Boost Your Baby\'s Brain Development',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKGvxtr7vmYvKw_dBgBPf98isHM4Cz6REorg&s',
      excerpt: 'For children, play is not just about having fun—it\'s crucial for developing critical[...]'
    },
    {
      id: 6,
      category: 'Health',
      title: 'Common Newborn Health Issues and How to Handle Them Like a Pro',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKGvxtr7vmYvKw_dBgBPf98isHM4Cz6REorg&s',
      excerpt: 'If you\'re a first-time parent, and even if you\'ve already been through it before[...]'
    }
  ];

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <div className="blog-container">
      {/* Carousel for Featured Articles */}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Carousel autoplay>
            {featuredArticles.map(article => (
              <div key={article.id} className="carousel-slide">
                <div className="featured-image-container">
                  <img
                    alt={article.title}
                    src={article.image}
                    className="featured-image"
                  />
                  <div className="featured-content">
                    <Tag color="blue" className="category-tag">
                      {article.category}
                    </Tag>
                    <Title level={2} className="featured-title">
                      {article.title}
                    </Title>
                    <button className="read-more-btn">
                      Read more <RightOutlined />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Col>

        {/* Regular Articles */}
        {regularArticles.map(article => (
          <Col xs={24} sm={12} lg={8} key={article.id}>
            <Card hoverable className="article-card">
              <div className="article-image-container">
                <img
                  alt={article.title}
                  src={article.image}
                  className="article-image"
                />
              </div>
              <div className="article-content">
                <Tag color="blue" className="category-tag">
                  {article.category}
                </Tag>
                <Title level={4} className="article-title">
                  {article.title}
                </Title>
                <Paragraph ellipsis={{ rows: 3 }} className="article-excerpt">
                  {article.excerpt}
                </Paragraph>
                <Link
                  to={`/blogs/${article.id}`}
                  className="read-more-link"
                >
                  Read more <RightOutlined />
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Row justify="center" className="pagination-container">
        <Col>
          <Pagination defaultCurrent={1} total={420} />
        </Col>
      </Row>
    </div>
  );
};

export default BlogPage;
