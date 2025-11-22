import React from 'react';

const SlideContainer = ({ 
  slide, 
  slideNumber, 
  totalSlides, 
  onNext, 
  onPrev, 
  currentRevealIndex
}) => {

  // Function to extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
      /youtube\.com\/watch\?.*v=([^&?#]+)/,
      /youtu\.be\/([^&?#]+)/,
      /youtube\.com\/embed\/([^&?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Function to check if a URL is a YouTube link
  const isYouTubeLink = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const formatContent = (content, type) => {
    if (!content) return null;

    // Handle tables
    if (type === 'table' && typeof content === 'string') {
      const rows = content.trim().split('\n').filter(Boolean);
      return (
        <table className="slide-table">
          <tbody>
            {rows.map((row, rowIndex) => {
              const cells = row.split('|').map(cell => cell.trim());
              const isHeader = rowIndex === 0;
              return (
                <tr key={rowIndex}>
                  {cells.map((cell, cellIndex) =>
                    isHeader ? <th key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    // Handle bullet points
    if (typeof content === 'string' && content.includes('•')) {
      const lines = content.split('\n');
      return (
        <ul className="slide-points">
          {lines.map((line, index) => {
            if (line.trim().startsWith('•')) {
              return <li key={index}>{line.trim().substring(1).trim()}</li>;
            }
            return null;
          }).filter(Boolean)}
        </ul>
      );
    }

    // Handle clickable links and auto-embed YouTube videos
    if (typeof content === 'string' && content.includes('http')) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = content.split(urlRegex);
      
      return (
        <div className="box-content">
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              // Check if it's a YouTube link that should be embedded
              if (isYouTubeLink(part)) {
                const videoId = getYouTubeVideoId(part);
                if (videoId) {
                  return (
                    <div key={index} className="youtube-embed-auto">
                      <div className="media-container video-container">
                        <div className="video-wrapper">
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="video-source">
                          <a 
                            href={part} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="video-original-link"
                          >
                            Watch on YouTube
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
              
              // Regular link for non-YouTube URLs
              return (
                <a 
                  key={index}
                  href={part} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="content-link"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </div>
      );
    }

    // Default: plain text
    return <div className="box-content">{content}</div>;
  };

  const renderMedia = (media) => {
    if (!media) return null;

    switch (media.type) {
      case 'image':
        return (
          <div className="media-container image-container">
            <img 
              src={media.url} 
              alt={media.alt || 'Slide image'}
              className="slide-image"
            />
            {media.caption && (
              <div className="media-caption">{media.caption}</div>
            )}
          </div>
        );

      case 'youtube':
        // Support both direct video ID and full URL
        const videoId = media.videoId || getYouTubeVideoId(media.url);
        const embedUrl = media.embedUrl || 
          (videoId ? `https://www.youtube.com/embed/${videoId}` : null) ||
          (media.url && isYouTubeLink(media.url) ? `https://www.youtube.com/embed/${getYouTubeVideoId(media.url)}` : null);

        if (!embedUrl) {
          console.warn('Invalid YouTube media configuration:', media);
          return (
            <div className="media-container error-container">
              <p>Invalid YouTube configuration</p>
              {media.url && (
                <a href={media.url} target="_blank" rel="noopener noreferrer">
                  Open YouTube Link
                </a>
              )}
            </div>
          );
        }

        return (
          <div className="media-container video-container">
            <div className="video-wrapper">
              <iframe
                width="100%"
                height="315"
                src={embedUrl}
                title={media.title || 'YouTube video'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {media.caption && (
              <div className="media-caption">{media.caption}</div>
            )}
            {media.description && (
              <div className="media-description">{media.description}</div>
            )}
            {media.url && (
              <div className="video-source">
                <a 
                  href={media.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="video-original-link"
                >
                  Watch on YouTube
                </a>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="media-container video-container">
            <video controls className="slide-video">
              <source src={media.url} type={media.format || 'video/mp4'} />
              Your browser does not support the video tag.
            </video>
            {media.caption && (
              <div className="media-caption">{media.caption}</div>
            )}
          </div>
        );

      case 'link':
        // Auto-detect and embed YouTube links in case links
        if (media.url && isYouTubeLink(media.url)) {
          const videoId = getYouTubeVideoId(media.url);
          if (videoId) {
            return (
              <div className="media-container video-container">
                <div className="video-wrapper">
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={media.title || 'YouTube video'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {media.caption && (
                  <div className="media-caption">{media.caption}</div>
                )}
                {media.description && (
                  <div className="media-description">{media.description}</div>
                )}
                <div className="video-source">
                  <a 
                    href={media.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="video-original-link"
                  >
                    {media.title || 'Watch on YouTube'}
                  </a>
                </div>
              </div>
            );
          }
        }

        // Regular link for non-YouTube URLs
        return (
          <div className="media-container link-container">
            <a 
              href={media.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              <div className="link-preview">
                <span className="link-icon">🔗</span>
                <span className="link-title">{media.title || 'External Link'}</span>
              </div>
            </a>
            {media.description && (
              <div className="link-description">{media.description}</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderProcess = (process) => {
    if (!process || !process.type || !Array.isArray(process.steps)) return null;

    switch (process.type) {
      case 'timeline':
        return (
          <div className="process-container">
            {process.title && <div className="process-title">{process.title}</div>}
            <div className="process-timeline">
              {process.steps.map((step, index) => (
                <div key={index} className="timeline-step">
                  <div className="timeline-step-header">
                    <span className="timeline-step-icon">{step.icon || '📌'}</span>
                    <span className="timeline-step-title">{step.title}</span>
                  </div>
                  <div className="timeline-step-description">{step.description}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'flow':
        return (
          <div className="process-container">
            {process.title && <div className="process-title">{process.title}</div>}
            <div className="process-flow">
              {process.steps.map((step, index) => (
                <div key={index} className="flow-step">
                  <div className="flow-step-icon">{step.icon || '⚙️'}</div>
                  <div className="flow-step-title">{step.title}</div>
                  <div className="flow-step-description">{step.description}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'steps':
        return (
          <div className="process-container">
            {process.title && <div className="process-title">{process.title}</div>}
            <div className={`process-steps ${process.layout || ''} ${process.connectors ? 'with-connectors' : ''}`}>
              {process.steps.map((step, index) => (
                <div key={index} className="process-step">
                  <div className="process-step-number">{index + 1}</div>
                  <div className="process-step-content">
                    <div className="process-step-title">{step.title}</div>
                    <div className="process-step-description">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'compact':
        return (
          <div className="process-compact">
            {process.title && <div className="box-title">{process.title}</div>}
            <div className="process-compact-steps">
              {process.steps.map((step, index) => (
                <div key={index} className="process-compact-step">
                  <div className="process-compact-bullet">•</div>
                  <div className="process-compact-content">
                    <strong>{step.title}:</strong> {step.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isRevealed = (itemIndex) => {
    return itemIndex <= currentRevealIndex;
  };

  const getTotalItems = () => {
    return (slide.leftColumn?.length || 0) + (slide.rightColumn?.length || 0);
  };

  const renderColumnItem = (item, globalIndex) => {
    const revealed = isRevealed(globalIndex);

    return (
      <div
        key={globalIndex}
        className={`content-box ${item.type || ''} ${revealed ? 'revealed' : 'hidden'}`}
      >
        <div className="box-content-wrapper">
          <div className="box-title">
            {item.icon && <span>{item.icon}</span>}
            {item.title}
          </div>
          
          {/* Render media if present */}
          {item.media && renderMedia(item.media)}
          
          {/* Render content or process */}
          {item.process ? renderProcess(item.process) : formatContent(item.content, item.type)}
        </div>

        {!revealed && (
          <div className="reveal-overlay">
            <div className="reveal-pulse"></div>
          </div>
        )}
      </div>
    );
  };

  const totalItems = getTotalItems();
  const revealedCount = currentRevealIndex + 1;

  return (
    <div className="slide-container">
      <div className="slide">
        <div className="slide-header">
          <div className="slide-title">{slide.title}</div>
          {slide.subtitle && <div className="slide-subtitle">{slide.subtitle}</div>}
        </div>

        <div className="slide-content-wrapper">
          <div className="slide-content">
            {/* Left Column */}
            <div className="slide-column">
              {slide.leftColumn?.map((item, index) => renderColumnItem(item, index))}
            </div>

            {/* Right Column */}
            <div className="slide-column">
              {slide.rightColumn?.map((item, index) =>
                renderColumnItem(item, index + (slide.leftColumn?.length || 0))
              )}
            </div>
          </div>
        </div>

        <div className="controls-container">
          <button className="control-btn prev-btn" onClick={onPrev}>
            ← Previous
          </button>

          <div className="slide-progress">
            <span className="slide-number">Slide {slideNumber} of {totalSlides}</span>
            {totalItems > 0 && (
              <span className="step-progress">Step {revealedCount} of {totalItems}</span>
            )}
          </div>

          <button className="control-btn next-btn" onClick={onNext}>
            {revealedCount < totalItems ? 'Next →' : 'Next Slide →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideContainer;