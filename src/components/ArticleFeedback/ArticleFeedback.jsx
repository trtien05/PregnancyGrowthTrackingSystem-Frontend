import { useState } from 'react'
import './ArticleFeedback.css';
import { MehFilled, SmileFilled } from '@ant-design/icons';

const ArticleFeedback = () => {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (isHelpful) => {
    setFeedback(isHelpful);
    // Here you could add API call to save feedback
  };

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
