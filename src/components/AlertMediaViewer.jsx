import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Play, ExternalLink } from 'lucide-react';

const AlertMediaViewer = ({ media, BASE_URL }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef(null);

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPlaying(false);
    setImageError(false); // Réinitialiser l'état d'erreur lors du changement
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
    setImageError(false); // Réinitialiser l'état d'erreur lors du changement
  };

  const handleMediaClick = () => {
    if (!imageError) {
      setShowModal(true);
    }
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

  // Fonction pour gérer les URL de média
  const getMediaUrl = (mediaUrl) => {
    if (!mediaUrl) return '/placeholder-image.png';

    // Vérifier si c'est déjà une URL complète
    if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
      return mediaUrl;
    }

    // Sinon, ajouter BASE_URL
    return `${BASE_URL}/${mediaUrl}`;
  };

  // Nouvelle fonction pour ouvrir le média dans un nouvel onglet
  const openMediaInNewTab = (e) => {
    e.stopPropagation();
    if (!media || !media[currentIndex] || !media[currentIndex].media_url) return;

    const url = getMediaUrl(media[currentIndex].media_url);
    window.open(url, '_blank');
  };

  const getCurrentMedia = () => {
    if (!media || media.length === 0 || currentIndex >= media.length) {
      console.error('Media array is empty or index out of bounds');
      return (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          Aucun média disponible
        </div>
      );
    }

    const currentMedia = media[currentIndex];
    console.log('Current media:', currentMedia);

    if (!currentMedia || !currentMedia.media_url) {
      console.error('Invalid media item or missing media_url');
      return (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          Ce média n'est pas reconnu comme une inondation.
        </div>
      );
    }

    const url = getMediaUrl(currentMedia.media_url);
    console.log('Media URL:', url);

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
            onError={(e) => {
              console.error('Video loading error:', url, e);
              setImageError(true);
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!showModal && !imageError) handleMediaClick();
            }}
          />
          {!isPlaying && !imageError && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer"
              onClick={handlePlayClick}
            >
              <Play className="w-12 h-12 text-white" />
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <span className="text-3xl mb-2">🎬</span>
              <p className="mb-2">Médias non reconnus comme une inondation.</p>
              <button
                onClick={openMediaInNewTab}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ouvrir dans un nouvel onglet</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    // Si c'est une image ou un type non spécifié
    if (imageError) {
      return (
        <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <span className="text-3xl mb-2">🖼️</span>
          <p className="mb-2">Médias non reconnus comme une inondation.</p>
          <button
            onClick={openMediaInNewTab}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ouvrir dans un nouvel onglet</span>
          </button>
        </div>
      );
    }

    return (
      <img
        src={url}
        alt={`Media ${currentIndex + 1}`}
        className="w-full h-64 object-cover cursor-pointer"
        onClick={handleMediaClick}
        onError={(e) => {
          console.error('Image loading error:', url);
          e.target.onError = null; // Éviter les boucles infinies
          setImageError(true);
        }}
      />
    );
  };

  return (
    <>
      <div className="relative">
        {getCurrentMedia()}

        {media && media.length > 1 && (
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
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && !imageError && (
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
                  src={getMediaUrl(media[currentIndex].media_url)}
                  className="max-w-full max-h-[80vh]"
                  controls
                  onClick={(e) => e.stopPropagation()}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onError={(e) => {
                    console.error('Modal video loading error:', e);
                    handleCloseModal(e);
                    setImageError(true);
                  }}
                />
              </div>
            ) : (
              <img
                src={getMediaUrl(media[currentIndex].media_url)}
                alt={`Media ${currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  console.error('Modal image loading error');
                  handleCloseModal(e);
                  setImageError(true);
                }}
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
                      setImageError(false);
                    }}
                    className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
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