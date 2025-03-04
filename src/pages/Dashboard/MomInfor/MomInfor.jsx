import React, { useRef, useState } from 'react';
import { Button, Card, Carousel } from 'antd';
import './MomInfor.css';
import { useParams } from 'react-router-dom';
import { weeksImages } from './WeekImage';

const MomInfo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  // const dispatch = useAppDispatch();
  const { id } = useParams();
  // const growthMetricsByWeek = useAppSelector((state: RootState) => state.fetus.growthMetricsByWeek);

  // useEffect(() => {
  //   try {
  //     if (id) {
  //       dispatch(fetchGrowthMetricByWeek(id))
  //     };

  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }, [dispatch, id]);


  const handleMouseDown = (e, index) => {
    if ((e.target).closest('.indiana-card')) {
      setIsDragging(true);
      setActiveIndex(index);

    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    scrollContainerRef.current.scrollLeft -= e.movementX;
  };

  return (
    <div className="pregnancy-container">
      <h1 className="pregnancy-title">My pregnancy week by week</h1>


      <div
        ref={scrollContainerRef}
        className={`scrollContainerTimeline indiana-scroll-container ${isDragging ? 'indiana-scroll-container--dragging' : ''}`}

      >
        {[...Array(41)].map((_, index) => (
          <div
            className={`indiana-card ${activeIndex === index ? 'active-card' : ''
              } `}
            style={{ display: 'flex' }}
            key={index}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
          >
            <div className="left-card">
              <div className="week-number">{index + 1}</div>
              <span className="week-text"> weeks pregnant</span>
            </div>
            <div className="right-card-week">
              <img
                alt="Fertilization illustration"
                src={weeksImages[index]}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="content-box">

        <h2>Week {activeIndex + 1} Details</h2>


        <Button onClick={() => setIsModalOpen(true)} className="content-button">
          Add Pregnancy Details
        </Button>


      </div>
      <div>
        <p>This is the content for week {activeIndex + 1}.</p>
      </div>
      {/* <AddPregnancy
        id={id || ''}
        week={activeIndex + 1}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </div>
  );
};

export default MomInfo;