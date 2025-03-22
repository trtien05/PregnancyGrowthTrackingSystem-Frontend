import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Carousel } from 'antd';
import './MomInfor.css';
import { useParams } from 'react-router-dom';
import { weeksImages } from './WeekImage';
import AddPregnancy from './AddPregnancy';
import axiosClient from '../../../utils/apiCaller';

const MomInfo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const scrollContainerRef = useRef(null);
  const { id } = useParams();

  const fetchGrowthMetricByWeek = async () => {
    const response = await axiosClient.get(`/fetus-metrics/fetus/${id}/weeks`);
    if (response.code === 200) {
      setWeeks(response.data);
    }
  }
  useEffect(() => {
    try {
      if (id) {

        fetchGrowthMetricByWeek();
      };
    } catch (error) {
      console.log("error", error);
    }
  }, [id]);
  console.log("weeks", weeks);


  const handleMouseDown = (e, index) => {
    if ((e.target).closest('.indiana-card')) {
      setIsDragging(true);
      setActiveIndex(index);
      setWeek(index + 1); // Update week when card is selected
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
        {[...Array(41)].map((_, index) => {
          const hasMetrics = weeks.some(week => week === index + 1);
          return (
            <div
              className={`indiana-card ${activeIndex === index ? 'active-card' : ''} ${hasMetrics ? 'active-card' : ''}`}
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
          );
        })}
      </div>

      <div className="content-box">
        <h2>Week {week} Details</h2>
        <Button onClick={() => setIsModalOpen(true)} className="content-button">
          Add Pregnancy Details
        </Button>
      </div>

      <div>
        {Array.isArray(metrics) && metrics.length > 2 ? (
          <ChartRadar week={week} id={id} metrics={metrics} />
        ) : (
          <div className="no-data-message">
            No sufficient data available for Week {week}. Chart requires at least 3 metrics.
          </div>
        )}
      </div>

      <AddPregnancy
        id={id || ''}
        week={week}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchAllGrowthMetricByWeek={fetchGrowthMetricByWeek}
      />
    </div>
  );
};

export default MomInfo;