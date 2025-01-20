import axios from 'axios';
import { API_BASE_URL } from '../config';

// Récupérer les deux dernières alertes
export const fetchLatestAlerts = async () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Utilisateur non authentifié.');
  }

  try {
    console.log('Récupération des dernières alertes...');
    const response = await axios.get(`${API_BASE_URL}/admin/last-two-alerts`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.data) {
      console.log('Dernières alertes récupérées:', response.data.data);
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    if (error.response) {
      console.error('Erreur réponse du serveur :', error.response.data);
      throw new Error(error.response.data.message || 'Erreur lors de la récupération des alertes.');
    } else if (error.request) {
      console.error('Erreur requête :', error.request);
      throw new Error('Erreur de connexion au serveur.');
    } else {
      console.error('Erreur :', error.message);
      throw new Error('Erreur lors de la récupération des alertes.');
    }
  }
};