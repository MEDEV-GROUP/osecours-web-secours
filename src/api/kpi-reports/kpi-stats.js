// dashboardService.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Récupère le token d'authentification stocké dans le localStorage
 * @returns {string} Le token s'il existe
 */
const getAuthToken = () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Utilisateur non authentifié : aucun token disponible.');
  }
  return authToken;
};

/**
 * Gestion d’erreur générique pour les requêtes axios
 * @param {object} error 
 */
const handleRequestError = (error) => {
  // Gestion du cas d'erreur 401 (token invalide ou expiré)
  if (error.response?.status === 401) {
    console.error('Erreur 401 : Token invalide ou expiré.');
    // Optionnel : vider le localStorage ou rediriger l'utilisateur
    // localStorage.removeItem('authToken');
    // window.location.href = '/login'; 
  }

  // Log plus détaillé en cas d'erreur
  console.error(
    'Erreur lors de la récupération des données :',
    error.response?.data || error.message
  );

  // Lever une erreur pour que l'appelant puisse également la traiter
  throw new Error(
    error.response?.data?.message || 'Impossible de récupérer les données.'
  );
};

/**
 * Appel API 1 : /admin/basic-stats
 * Renvoie les statistiques basiques :
 * {
 *   "message": "Statistiques de base récupérées avec succès",
 *   "data": {
 *     "totalAlerts": 38,
 *     "totalInterventions": 6,
 *     "interventionRate": "15.79"
 *   }
 * }
 */
export const getBasicStats = async () => {
  const authToken = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/basic-stats`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response?.data ?? {};
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Appel API 2 : /admin/alerts-by-category
 * Renvoie la répartition des alertes par catégorie :
 * {
 *   "message": "Statistiques des alertes par catégorie récupérées avec succès",
 *   "data": {
 *     "year": 2025,
 *     "monthlyData": [ ... ],
 *     "categories": [ ... ],
 *     "totalsByCategory": { ... },
 *     "grandTotal": 14,
 *     "averageByCategory": { ... }
 *   }
 * }
 */
export const getAlertsByCategory = async () => {
  const authToken = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/alerts-by-category`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response?.data ?? {};
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Appel API 3 : /admin/alerts-by-commune
 * Renvoie la répartition des alertes par commune :
 * {
 *   "message": "Statistiques des alertes par commune récupérées avec succès",
 *   "data": {
 *     "mostAffectedCommune": { ... },
 *     "totalAlerts": 38,
 *     "averageAlertsPerCommune": "6.33",
 *     "allCommunes": [ ... ],
 *     "totalCommunes": 6
 *   }
 * }
 */
export const getAlertsByCommune = async () => {
  const authToken = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/alerts-by-commune`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response?.data ?? {};
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Appel API 4 : /admin/active-users
 * Renvoie les statistiques sur les utilisateurs actifs :
 * {
 *   "message": "Statistiques des utilisateurs actifs récupérées avec succès",
 *   "data": {
 *     "totalRegisteredUsers": 13,
 *     "activatedUsers": 9,
 *     "activeUsersWithValidToken": 12,
 *     "statistics": {
 *       "activationRate": "69.23",
 *       "activeTokenRate": "133.33",
 *       "overallActiveRate": "92.31"
 *     }
 *   }
 * }
 */
export const getActiveUsers = async () => {
  const authToken = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/active-users`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response?.data ?? {};
  } catch (error) {
    handleRequestError(error);
  }
};

/**
 * Exemple : appel en parallèle des 4 endpoints pour récupérer toutes les données.
 * 
 * Cette fonction renvoie un objet contenant la réponse de chaque endpoint :
 * {
 *   basicStats: {...},
 *   alertsByCategory: {...},
 *   alertsByCommune: {...},
 *   activeUsers: {...}
 * }
 */
export const getAllKpi = async () => {
  const [
    basicStats,
    alertsByCategory,
    alertsByCommune,
    activeUsers
  ] = await Promise.all([
    getBasicStats(),
    getAlertsByCategory(),
    getAlertsByCommune(),
    getActiveUsers()
  ]);

  return {
    basicStats: basicStats?.data,
    alertsByCategory: alertsByCategory?.data,
    alertsByCommune: alertsByCommune?.data,
    activeUsers: activeUsers?.data,
  };
};
