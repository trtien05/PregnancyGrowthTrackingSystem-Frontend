import { Skeleton, Typography } from 'antd'
import { Content } from 'antd/es/layout/layout'
const { Title } = Typography
import birthDate from '../../../assets/images/banner-birthdate.jpg'
import { useEffect, useState } from 'react'

import axiosClient from '../../../utils/apiCaller'

function BirthPlanWorksheet() {
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/blog-posts?page=0&size=3`);
        setRelatedArticles(response.data.content);
      } catch (error) {
        console.error("Failed to fetch related articles: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, []);
  return (
    <div className="layout-container">
      <div className="article-header">
        <Title level={1}>Here&apos;s what to include in your birth plan, and a template to use</Title>
      </div>

      <div style={{ display: 'flex' }}>
        <Content className="main-content">
          <div className="hero-image">
            <img src={birthDate} alt="Birthdate" />
          </div>

          <div className="birth-plan-content">
            <div className='intro-text'>
              <h2>What is a birth plan?</h2>
              <p>
                A birth plan is a document (usually a page or two long) that lets your medical team know your expectations and preferences while giving birth. It typically includes everything from how you want to manage labor pain to what kind of atmosphere you want in the delivery room.
              </p>

              <p>
                Of course, you can&apos;t control every aspect of labor and delivery, and you&apos;ll need to be flexible if something comes up that requires your birth team to depart from your plan. (And if you want to change things up in the moment, that&apos;s fine too.) A healthy mom and baby are the most important parts of the process.
              </p>
            </div>


            <div className="expert-quote intro-text">
              <p>
                &quot;Remember that the plan is a &apos;Plan A,&apos;&quot; says Shannon Smith, M.D., an ob-gyn at Brigham Faulkner Ob/Gyn Associates in Boston and member of the BabyCenter Medical Advisory Board. &quot;Unfortunately, for labor and delivery not everyone gets plan A, so keeping an open mind is a must.&quot;
              </p>
              <span className="author">- Dr. Shannon Smith</span>
            </div>

            <p className='intro-text'>
              Most hospitals and birth centers provide a birth plan template or brochure to explain their policies and philosophy of childbirth, and to let you know which options are available. That information can be helpful in guiding you and your provider in a discussion about your preferences.
            </p>

            <h2>Do I need to make a birth plan?</h2>
            <p className='intro-text'>
              Birth plans aren&apos;t required, but they&apos;re nice to have, especially if you have specific desires and want a place to make your wishes clear. Plus, the process of making a birth plan may help you get more comfortable with and prepared for having your baby.
            </p>

            <p className='intro-text'>
              Going over your plan with your doctor or midwife well ahead of time will also help you iron out any questions you have and avoid disappointment later. You might learn that your hospital doesn&apos;t allow filming of births, for example, or that you can&apos;t have as many people as you&apos;d like in the delivery room.
            </p>

            <div className="template-section">
              <h2>Use our free, printable birth plan template</h2>
              <p>
                Here&apos;s our handy <a href="https://assets.babycenter.com/ims/2024/04/babycenter-birth-plan-apr-2024.pdf" className="link">birth plan template</a> – you can download it, print it, and fill it out. Be sure to give a completed copy of your birth plan to your provider well before your due date, and pack another copy in your hospital bag for when you go into labor.
              </p>

              <h2>How to create a birth plan</h2>
              <p>
                Wondering what all your options are? Read on for information to help you understand your choices and decide on your birth plan.
              </p>
            </div>
          </div>
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

export default BirthPlanWorksheet
