import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';

const AlertMediaViewer = ({ media, BASE_URL }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const handleMediaClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setShowModal(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const getCurrentMedia = () => {
    const currentMedia = media[currentIndex];
    const url = `${BASE_URL}/${currentMedia.media_url}`;

    if (currentMedia.media_type === 'VIDEO') {
      return (
        <div className="relative w-full h-64">
          <video 
            ref={videoRef}
            src={url}
            className="w-full h-full object-cover"
            controls={isPlaying}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onClick={(e) => {
              e.stopPropagation();
              if (!showModal) handleMediaClick();
            }}
          />
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer"
              onClick={handlePlayClick}
            >
              <Play className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
      );
    }
    
    return (
      <img 
        src={url} 
        alt={`Media ${currentIndex + 1}`}
        className="w-full h-64 object-cover cursor-pointer"
        onClick={handleMediaClick}
      />
    );
  };

  return (
    <>
      <div className="relative">
        {getCurrentMedia()}
        
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {media.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {media[currentIndex].media_type === 'VIDEO' ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={`${BASE_URL}/${media[currentIndex].media_url}`}
                  className="max-w-full max-h-[80vh]"
                  controls
                  onClick={(e) => e.stopPropagation()}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              </div>
            ) : (
              <img
                src={`${BASE_URL}/${media[currentIndex].media_url}`}
                alt={`Media ${currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {media.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {media.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                      setIsPlaying(false);
                    }}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AlertMediaViewer;