import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      const confirmLogin = window.confirm("Vous devez être connecté pour accéder à cette page. Voulez-vous vous connecter ?");
      if (confirmLogin) {
        navigate('/login');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate]);
};

export default useRequireAuth; 