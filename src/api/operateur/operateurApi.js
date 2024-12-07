import axios from 'axios';
import { API_BASE_URL } from '../config';

export const getAllRescueMembers = async () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Utilisateur non authentifié.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/admin/all-rescue-members`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Données des opérateurs reçues :', response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des opérateurs :', error.response?.data || error.message);
    throw new Error('Erreur lors de la récupération des opérateurs.');
  }
};

export const createRescueMember = async (data) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Utilisateur non authentifié.');
  }

  try {
    console.log('Envoi des données pour créer un opérateur :', data);
    const response = await axios.post(`${API_BASE_URL}/admin/create-rescue-member`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Opérateur créé :', response.data.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Erreur avec réponse du serveur
      console.error('Erreur réponse du serveur :', error.response.data);
    } else if (error.request) {
      // Requête faite mais aucune réponse reçue
      console.error('Erreur requête :', error.request);
    } else {
      // Autre erreur
      console.error('Erreur :', error.message);
    }
    throw new Error('Erreur lors de la création de l\'opérateur.');
  }
};
