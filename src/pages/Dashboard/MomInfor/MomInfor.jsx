import React, { useState } from 'react';
import { Card, Carousel } from 'antd';
import './MomInfor.css';

const MomInfo = () => {
  const weeks = [
    { week: 2, image: '☀️', description: 'weeks pregnant' },
    { week: 3, image: '🟠', description: 'weeks pregnant' },
    { week: 4, image: '🪨', description: 'weeks pregnant' },
    { week: 5, image: '🥚', description: 'weeks pregnant' },
    { week: 6, image: '🟡', description: 'weeks pregnant' },
    { week: 7, image: '🔵', description: 'weeks pregnant' },
    { week: 8, image: '🍇', description: 'weeks pregnant' },
    { week: 9, image: '🥝', description: 'weeks pregnant' },
    { week: 10, image: '🍉', description: 'weeks pregnant' },
    // Add more weeks as needed
  ];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="mom-info-container">
      <h1 className="pregnancy-title">My pregnancy week by week</h1>

      <div className="week-slider">
        <Carousel {...settings}>
          {weeks.map((item) => (
            <div key={item.week} className="week-card-wrapper">
              <Card className="week-card">
                <div className="week-number">{item.week}</div>
                <div className="week-image">{item.image}</div>
                <div className="week-description">{item.description}</div>
              </Card>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MomInfo;