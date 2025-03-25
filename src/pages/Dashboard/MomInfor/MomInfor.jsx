import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Carousel, Typography } from 'antd';
import './MomInfor.css';
import { useParams, useLocation } from 'react-router-dom';
import { weeksImages } from './WeekImage';
import AddPregnancy from './AddPregnancy';
import BlogModal from './BlogModal';
import axiosClient from '../../../utils/apiCaller';
import ColumnChart from '../../../components/ColumnChart/ColumnChart';
import BarChart from '../../../components/BarChart/BarChart';
import { weeklyBlogs } from './WeeklyBlogData';
import MetricExplanationModal from './MetricExplanationModal';

const { Title, Paragraph } = Typography;

const MomInfo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const scrollContainerRef = useRef(null);
  const [metrics, setMetrics] = useState([]);
  const [week, setWeek] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [pregnancy, setPregnancy] = useState(null);
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pregnancyId = queryParams.get('pregnancyId');

  // Fetch pregnancy data to get dueDate
  useEffect(() => {
    const fetchPregnancy = async () => {
      if (!pregnancyId) return;
      
      try {
        const response = await axiosClient.get(`/pregnancies/${pregnancyId}`);
        if (response.code === 200) {
          setPregnancy(response.data);
          
          // Calculate current week based on dueDate
          if (response.data && response.data.dueDate) {
            const dueDate = new Date(response.data.dueDate);
            const today = new Date();
            const totalWeeksPregnancy = 40; // Standard pregnancy length
            
            // Time difference in milliseconds
            const timeDiff = dueDate - today;
            
            // Convert to weeks
            const weeksLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
            
            // Calculate current week (40 - weeks left)
            const calculatedCurrentWeek = Math.min(Math.max(totalWeeksPregnancy - weeksLeft, 1), 40);
            setCurrentWeek(calculatedCurrentWeek);
            
            // Set active week to current week
            setWeek(calculatedCurrentWeek);
            setActiveIndex(calculatedCurrentWeek - 1);
          }
        }
      } catch (error) {
        console.error('Failed to fetch pregnancy: ', error);
      }
    };
    
    fetchPregnancy();
  }, [pregnancyId]);

  useEffect(() => {
    const fetchMetric = async () => {
      try {
        const response = await axiosClient.get(`/metrics/week/${week}`);
        if (response.code === 200) {
          setMetrics(response.data);
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

  // Add a check to ensure id is valid
  useEffect(() => {
    if (!id) {
      console.error('No fetus ID found in URL parameters');
    }
  }, [id]);

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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    scrollContainerRef.current.scrollLeft -= e.movementX;
  };

  // Get blog data for current week
  const getBlogDataForWeek = (weekNumber) => {
    return weeklyBlogs.find(blog => blog.week === weekNumber) || {
      week: weekNumber,
      title: `Week ${weekNumber}`,
      content: "Information for this week will be coming soon. Stay tuned!"
    };
  };

  // Check if a week's data can be added (if week <= currentWeek)
  const canAddDataForWeek = (weekNum) => {
    return currentWeek > 0 && weekNum <= currentWeek;
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
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'space-between' }}>
          {canAddDataForWeek(week) && (
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              className={'update-button-subscription'}
            >
              Add Pregnancy
            </Button>
          )}
          <div style={{ display: 'flex', gap: '10px', marginLeft: canAddDataForWeek(week) ? '0' : 'auto' }}>
            <Button
              type="default"
              onClick={() => setIsBlogModalOpen(true)}
              className={'blog-button'}
            >
              Week {week} Tips
            </Button>
            <Button
              type="default"
              onClick={() => setIsMetricModalOpen(true)}
              className={'blog-button'}
            >
              Metrics Guide
            </Button>
          </div>
        </div>

        {/* Display metrics data if available and week is in weeks array */}
        {metrics && metrics.length > 0 && id && weeks.includes(week) ? (
          <div className="metrics-container" style={{ marginTop: '20px' }}>
            <h2>Week {week} Metrics</h2>
            <ColumnChart
              fetusId={id}
              week={week}
              metrics={metrics}
            />
            <div style={{ marginTop: '20px' }}>
              <BarChart
                fetusId={id}
                week={week}
                metrics={metrics}
              />
            </div>
          </div>
        ) : (
          /* Display weekly blog content when no metrics are available */
          <div className="blog-content-container" style={{
            marginTop: '20px',
            paddingTop: '20px',
            paddingBottom: '20px',
            borderRadius: '8px',
          }}>
            {/* Get blog data for this week */}
            {(() => {
              const blogData = getBlogDataForWeek(week);
              return (
                <div>
                  <Title level={3}>Week {week}: {blogData.title}</Title>
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    {blogData.content}
                  </Paragraph>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <AddPregnancy
        id={id || ''}
        week={activeIndex + 1}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchGrowthMetricByWeek();
        }}
        fetchAllGrowthMetricByWeek={fetchGrowthMetricByWeek}
      />

      <BlogModal
        week={week}
        open={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
      />

      {/* New Metric Explanation Modal */}
      <MetricExplanationModal
        open={isMetricModalOpen}
        onClose={() => setIsMetricModalOpen(false)}
      />
    </div>
  );
};
export default MomInfo;