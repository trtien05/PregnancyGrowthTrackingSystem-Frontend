import { useState } from 'react'
import './ArticleFeedback.css';
import { MehFilled, SmileFilled } from '@ant-design/icons';
import axiosClient from '../../utils/apiCaller';

const ArticleFeedback = (props) => {
  // eslint-disable-next-line react/prop-types
  const { blogPostId, userId } = props;

  const [feedback, setFeedback] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedback = async (isHelpful) => {
    try {
      setFeedback(isHelpful);
      setIsSubmitted(true);
      const response = await axiosClient.post('/blog-likes', {
        blogPostId,
        userId,
      });
      console.log('Feedback submitted: ', response);
    } catch (error) {
      console.log('Failed to submit feedback: ', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="feedback-container">
        <span className="thank-you-text">Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <span className="feedback-text">Was this article helpful?</span>

      <button
        onClick={() => handleFeedback(true)}
        className={`feedback-button ${feedback === true ? 'active-yes' : ''}`}
      >
        <SmileFilled className={`feedback-icon ${feedback === true ? 'active' : ''}`} />
        <span>Yes</span>
      </button>

      <button
        onClick={() => handleFeedback(false)}
        className={`feedback-button ${feedback === false ? 'active-no' : ''}`}
      >
        <MehFilled className={`feedback-icon ${feedback === false ? 'active' : ''}`} />
        <span>No</span>
      </button>
    </div>
  );
};

export default ArticleFeedback;
