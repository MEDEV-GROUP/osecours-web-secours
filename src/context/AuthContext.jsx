import PropTypes from 'prop-types';
import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi } from '../api/login/authApi';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Erreur générale
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' }); // Erreurs spécifiques aux champs
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setFieldErrors({ email: '', password: '' });
      setIsLoading(true);
      const data = await loginApi(email, password);
      const { token, email: userEmail, firstName, lastName, role } = data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({ email: userEmail, firstName, lastName, role }));
      setIsAuthenticated(true);
      setUser({ email: userEmail, firstName, lastName, role });
      navigate('/tableau-de-bord', { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur de connexion';
      console.error('Erreur lors de la connexion :', errorMessage);

      // Réinitialiser les erreurs spécifiques aux champs
      setFieldErrors({ email: '', password: '' });

      // Déterminer quelle erreur est survenue
      if (errorMessage.toLowerCase().includes('email')) {
        setFieldErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('mot de passe')) {
        setFieldErrors(prev => ({ ...prev, password: errorMessage }));
      } else {
        setError(errorMessage); // Erreur générale
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate(`/`, { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        error,
        fieldErrors,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
