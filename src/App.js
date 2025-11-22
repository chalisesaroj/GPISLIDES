import React, { useState, useEffect } from 'react';
import SlideContainer from './components/SlideContainer';
import slides from './data/slides';
import './App.css';

function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showSlideNavigator, setShowSlideNavigator] = useState(true);

  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;

  // Reset reveal index when slide changes
  useEffect(() => {
    setCurrentRevealIndex(-1);
  }, [currentSlideIndex]);

  const handleNext = () => {
    const totalItems = (currentSlide.leftColumn?.length || 0) + (currentSlide.rightColumn?.length || 0);
    
    if (currentRevealIndex < totalItems - 1) {
      // Reveal next item
      setCurrentRevealIndex(prev => prev + 1);
    } else {
      // Move to next slide
      if (currentSlideIndex < totalSlides - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentRevealIndex > -1) {
      // Hide last revealed item
      setCurrentRevealIndex(prev => prev - 1);
    } else if (currentSlideIndex > 0) {
      // Move to previous slide
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        handleNext();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlePrev();
        break;
      case 'f':
      case 'F11':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'n':
      case 'N':
        e.preventDefault();
        setShowNavigation(prev => !prev);
        break;
      case 's':
      case 'S':
        e.preventDefault();
        setShowSlideNavigator(prev => !prev);
        break;
      case 'Escape':
        if (isFullscreen) {
          exitFullscreen();
        }
        break;
      default:
        break;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
    }
  };

  const toggleNavigation = () => {
    setShowNavigation(prev => !prev);
  };

  const toggleSlideNavigator = () => {
    setShowSlideNavigator(prev => !prev);
  };

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlideIndex, currentRevealIndex]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`app ${isFullscreen ? 'fullscreen' : ''}`}>
      <SlideContainer
        slide={currentSlide}
        slideNumber={currentSlideIndex + 1}
        totalSlides={totalSlides}
        onNext={handleNext}
        onPrev={handlePrev}
        currentRevealIndex={currentRevealIndex}
      />
      
      {/* Slide Navigator */}
      {showSlideNavigator && (
        <div className="slide-navigator">
          <div className="navigator-header">
            <span>Slides</span>
            <button 
              className="close-navigator" 
              onClick={toggleSlideNavigator}
              title="Hide Slide Navigator (S)"
            >
              ×
            </button>
          </div>
          <div className="slide-thumbnails">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide-thumb ${index === currentSlideIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                <div className="thumb-number">{index + 1}</div>
                <div className="thumb-title">{slide.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="control-buttons">
        {/* Fullscreen Toggle */}
        <button 
          className="control-button" 
          onClick={toggleFullscreen}
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? '⤢' : '⤡'}
        </button>

        {/* Navigation Toggle */}
        <button 
          className="control-button" 
          onClick={toggleNavigation}
          title="Toggle Navigation (N)"
        >
          {showNavigation ? '👁️' : '👁️‍🗨️'}
        </button>

        {/* Slide Navigator Toggle */}
        <button 
          className="control-button" 
          onClick={toggleSlideNavigator}
          title="Toggle Slide Navigator (S)"
        >
          {showSlideNavigator ? '📑' : '📖'}
        </button>
      </div>

      {/* Quick Controls */}
      {showNavigation && (
        <div className="quick-controls">
          <button 
            className="control-btn" 
            onClick={handlePrev} 
            disabled={currentSlideIndex === 0 && currentRevealIndex === -1}
          >
            ← Previous
          </button>
          <span className="slide-indicator">
            {currentSlideIndex + 1} / {totalSlides}
          </span>
          <button 
            className="control-btn" 
            onClick={handleNext} 
            disabled={currentSlideIndex === totalSlides - 1 && currentRevealIndex === ((currentSlide.leftColumn?.length || 0) + (currentSlide.rightColumn?.length || 0)) - 1}
          >
            Next →
          </button>
        </div>
      )}

      {/* Hidden Navigation Toggle for mobile */}
      {!showNavigation && (
        <button 
          className="navigation-toggle-mobile"
          onClick={toggleNavigation}
        >
          ☰
        </button>
      )}
    </div>
  );
}

export default App;