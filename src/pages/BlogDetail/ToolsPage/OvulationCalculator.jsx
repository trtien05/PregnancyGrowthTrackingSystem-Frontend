import { useEffect, useState } from 'react'
import { Typography, Layout, Skeleton } from 'antd'
import OvulationCalculatorForm from '../../../components/OvulationCalculatorForm/OvulationCalculatorForm'
import OvulationCycleResult from '../../../components/OvulationCycleResult/OvulationCycleResult'
import axiosClient from '../../../utils/apiCaller'

const { Title } = Typography
const { Content } = Layout

export default function OvulationCaculator() {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showResult, setShowResult] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  const handleShowResult = (date, length) => {
    setStartDate(date);
    setCycleLength(length);
    setShowResult(true);
  };

  const handleStartOver = () => {
    setShowResult(false);
  };

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
        <Title level={1}>Ovulation Calculator</Title>
      </div>

      <div className="intro-text">
        Use our ovulation calculator to predict when you might ovulate and boost your chances of getting pregnant. This tool helps you
        pinpoint your likely ovulation date and your most fertile window to set you up for baby-making success!
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
              <main>
                {!showResult ? (
                  <OvulationCalculatorForm onShowResult={handleShowResult} />
                ) : (
                  <OvulationCycleResult startDate={startDate} cycleLength={cycleLength} onStartOver={handleStartOver} />
                )}
              </main>
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

          <div className="intro-text">
            See other ways to pinpoint your fertile days and increase your chances of becoming pregnant. Find out how to use an
            <a href="#" className="link">
              {' '}
              an ovulation predictor kit
            </a>
            , chart your basal body temperature, and pay attention to
            <a href="#" className="link">
              {' '}
              changes in cervical mucus
            </a>
            .
          </div>

          <h2 className="section-title">Signs of ovulation</h2>

          <ul className="advice-list">
            <li className="advice-item">
              <p className="advice-text">Rise in basal body temperature</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">Cervical mucus is the texture of egg whites</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                <a href="#" className="link">
                  Breast tenderness
                </a>
              </p>
            </li>

            <li className="advice-item">
              <p className="advice-text">Mild cramps or twinges in the abdomen</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                <a href="#" className="link">
                  Very mild spotting
                </a>
              </p>
            </li>

            <li className="advice-item">
              <p className="advice-text">Heightened sense of smell</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">Increased sex drive</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">Changes in appetite or mood</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                <a href="#" className="link">
                  Bloating
                </a>
              </p>
            </li>
          </ul>

          <h2 className="section-title">Tips for getting pregnant</h2>

          <ul className="advice-list">
            <li className="advice-item">
              <p className="advice-text">
                Find out when you&apos;ll ovulate using our calculator or an ovulation predictor kit, or by
                <a href="#" className="link">
                  {' '}
                  tracking your symptoms
                </a>
                .
              </p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                Have
                <a href="#" className="link">
                  {' '}
                  sex{' '}
                </a>
                every other day around the time of ovulation.
              </p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                Start taking a prenatal vitamin with
                <a href="#" className="link">
                  {' '}
                  folic acid{' '}
                </a>
                at least one month before you start trying (6 months is ideal).
              </p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                See your healthcare provider and make sure they&apos;re managing any pre-existing health conditions you may have. Staying
                up-to-date with
                <a href="#" className="link">
                  {' '}
                  vaccinations{' '}
                </a>
                and regular check-ups and testing can lower the risk of complications during pregnancy.
              </p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                Take good care of yourself. You&apos;ll want to kick unhealthy habits like
                <a href="#" className="link">
                  {' '}
                  smoking{' '}
                </a>
                and start incorporating
                <a href="#" className="link">
                  {' '}
                  regular exercise{' '}
                </a>
                into your routine if you aren&apos;t exercising already. Eating a healthy, nutrient-dense diet can help, too.
              </p>
            </li>
          </ul>

          <h2 className="section-title">How moms calculate ovulation</h2>
          <div className="intro-text">
            In addition to using an ovulation calculator, here are ways that moms in the BabyCenter Community know they’re ovulating.
          </div>

          <ul className="advice-list">
            <li className="advice-item">
              <p className="advice-text">&quot;I usually get ovulation cramping or pain on my left side&quot;</p>
              <p className="advice-author">– mommy1johnson</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                &quot;My ovulation signs are cervical mucus that looks like egg whites; occasional, very mild, one-sided ovarian discomfort;
                a higher sex drive; and increased appetite.&quot;
              </p>
              <p className="advice-author">– krt1987</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">&quot;I get bloated and my lower abdomen feels very sore.&quot;</p>
              <p className="advice-author">– Kmarvin91</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                &quot;My BBT typically rises incrementally over three days, for a total rise of .8 or .9 over pre-ovulation
                temperatures.&quot;
              </p>
              <p className="advice-author">– Rikkubug</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                &quot;I woke up in the middle of the night and had an increase in body temperature and lower back pain on the left
                side.&quot;
              </p>
              <p className="advice-author">– Newwifelife</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">
                &quot;I have slight bloating, increased appetite, and light cramps like the ones I get before my period. Plus, I’m in a
                great mood.&quot;
              </p>
              <p className="advice-author">– NadiaFlower</p>
            </li>
          </ul>
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
