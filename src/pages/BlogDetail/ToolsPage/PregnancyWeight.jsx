import { Typography, Layout, Skeleton } from "antd";
import { useEffect, useState } from "react";
import PregnancyCalculatorForm from "../../../components/PregnancyCalculatorForm";
import axiosClient from "../../../utils/apiCaller";

const { Title } = Typography;
const { Content } = Layout;

export default function PregnancyWeight() {
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
        <Title level={1}>Pregnancy Weight Gain Calculator</Title>
      </div>

      <div style={{ display: "flex" }}>
        <Content className="main-content">
          <div className="pregnancy-weight-content">

            <img className="iconImg weightGainEstimator" src="https://assets.babycenter.com/ims/2023/11/PregWeightGainCalc-nov-2023.svg" alt="Scale icon" />
            <div className="calculator-container">
              <PregnancyCalculatorForm />
            </div>
          </div>

          <h1 className="main-title">How much weight should I gain during pregnancy?</h1>

          <div className="intro-text">
            The amount of <a href="#" className="link">pregnancy weight</a> you &apos;re recommended to gain depends on where you started out:
            <a href="#" className="link"> underweight</a>, at a
            <a href="#" className="link"> healthy weight</a>,
            <a href="#" className="link"> overweight</a>, or
            <a href="#" className="link"> obese </a>
            (and whether you  &apos;re carrying <a href="#" className="link">twins</a> or multiples).
          </div>

          <div className="intro-text">
            This tool will calculate your pre-pregnancy BMI (body mass index), give you a recommendation for pregnancy weight gain, and generate a pregnancy weight gain chart to show how you  &apos;re tracking toward your target weight range.
          </div>

          <div className="intro-text">
            But keep in mind that your recommended weight gain may be different depending on your health status and any pregnancy complications. Especially if you  &apos;re overweight, obese, or underweight, it &apos;s important to talk to your doctor or midwife and use pregnancy weight gain information that &apos;s customized for you.
          </div>

          <h2 className="section-title">What moms say about pregnancy weight gain</h2>

          <div className="intro-text">
            Some moms stress about gaining too much, while others are anxious about gaining enough. It &apos;s normal to have questions and concerns as your body changes to support your pregnancy. Check in regularly with your doctor or midwife about pregnancy weight gain, but try not to worry too much. In the PregnanJoy Community, moms share their advice.
          </div>

          <ul className="advice-list">
            <li className="advice-item">
              <p className="advice-text">&quot;I have to remind myself that this is what our bodies are meant to do, and that all the changes are beautiful.&quot;</p>
              <p className="advice-author">– AshleyT97</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">&quot;Everyone &apos;s body is different in pregnancy and their weight-gain needs will be different too. It &apos;s okay to gain weight – you are still incredible!&quot;</p>
              <p className="advice-author">– Chapstick28</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">&quot;I lost weight in the first trimester because of nausea. I dealt with my first two pregnancies as well. When the nausea subsided, the weight came on.&quot;</p>
              <p className="advice-author">– Avhh</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">&quot;When I feel anxious about how I look, I remind myself that pregnant me is not the regular me.&quot;</p>
              <p className="advice-author">– KKaayyB</p>
            </li>

            <li className="advice-item">
              <p className="advice-text">&quot;Love yourself as unconditionally as you would your child. Eat well, exercise, get plenty of water and good rest. Just don &apos;t get obsessed with a number or a dress size.&quot;</p>
              <p className="advice-author">– rixie77</p>
            </li>
          </ul>

          <div className="important-notice">
            <p>IMPORTANT: The Pregnancy Weight Gain Calculator is a general educational aid only and should not be relied on as a substitute for the monitoring of your weight by your doctor, midwife, or other healthcare providers.</p>
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
  );
}
