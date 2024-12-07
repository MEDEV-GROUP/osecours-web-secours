import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const match = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(match);
    };

    // Vérification initiale
    checkMobile();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobile]);

  if (isMobile) {
    return {
      isMobile,
      mobileMessage: (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000">
          <div className="bg-white w-full h-full flex flex-col items-center justify-center">
            <img src="/src/assets/sidebar/logo.svg" alt="Logo" className="mb-4" />
            <div className="p-6 max-w-sm text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Version Mobile Non Supportée
              </h2>
              <p className="text-gray-700">
                Cette plateforme est optimisée pour une utilisation sur ordinateur. 
                Veuillez y accéder depuis un navigateur web desktop.
              </p>
            </div>
          </div>
        </div>
      )
    };
  }

  return { isMobile, mobileMessage: null };
}; 