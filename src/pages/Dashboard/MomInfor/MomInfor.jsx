import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Carousel } from 'antd';
import './MomInfor.css';
import { useParams } from 'react-router-dom';
import { weeksImages } from './WeekImage';
import AddPregnancy from './AddPregnancy';
import axiosClient from '../../../utils/apiCaller';
import ColumnChart from '../../../components/ColumnChart';

const MomInfo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const scrollContainerRef = useRef(null);
  const [metrics, setMetrics] = useState([]);
  const [week, setWeek] = useState(1);

  useEffect(() => {
    const fetchMetric = async () => {
      try {
        const response = await axiosClient.get(`/metrics/week/${week}`);
        if (response.code === 200) {
          setMetrics(response.data);
          console.log(`Week ${week} metrics:`, response.data); // Debug metrics data
        }
      } catch (error) {
        console.error('Failed to fetch metric: ', error);
      }
    }
    fetchMetric();
  }, [week]);

  // Ensure activeIndex and week are synchronized
  useEffect(() => {
    setActiveIndex(week - 1);
  }, [week]);

  const handleMouseDown = (e, index) => {
    if ((e.target).closest('.indiana-card')) {
      setIsDragging(true);
      setActiveIndex(index);
      setWeek(index + 1); // Update week when card is selected
    }
  };
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
              onClick={() => setWeek(index + 1)}

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

      <div>
        <div>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            style={{ marginTop: '20px' }}
            className={'update-button-subscription'}
          >
            Add Pregnancy
          </Button>
        </div>

        {/* Display metrics data if available */}
        {metrics && metrics.length > 0 && (
          <div className="metrics-container" style={{ marginTop: '20px' }}>
            <h2>Week {week} Metrics</h2>
            <ColumnChart
              fetusId={id}
              week={week}
              metrics={metrics}
            />
          </div>
        )}
      </div>


      <AddPregnancy
        id={id || ''}
        week={activeIndex + 1}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchAllGrowthMetricByWeek={fetchGrowthMetricByWeek}
      />
    </div>
  );
};
export default MomInfo;