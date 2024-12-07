import PropTypes from 'prop-types';
import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi } from '../api/login/authApi';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      if (token) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);

      const data = await loginApi(email, password);
      const { token, email: userEmail, firstName, lastName, role } = data;

      localStorage.setItem('authToken', token);
      localStorage.setItem(
        'user',
        JSON.stringify({ email: userEmail, firstName, lastName, role })
      );

      setIsAuthenticated(true);
      setUser({ email: userEmail, firstName, lastName, role });

      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur de connexion';
      setError(errorMessage);
      console.error('Erreur lors de la connexion :', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);

    const randomString = Math.random().toString(36).substring(2);
    navigate(`/login?logout=${randomString}`, { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        error,
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
