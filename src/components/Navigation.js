import React from 'react';

const Navigation = ({ currentSlide, totalSlides, goToSlide }) => {
  return (
    <div className="navigation">
    
      <div className="nav-dots">
        {Array.from({ length: totalSlides }, (_, index) => (
          <div
            key={index}
            className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            title={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Navigation;