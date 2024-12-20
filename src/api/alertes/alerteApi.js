import axios from 'axios';
import { API_BASE_URL } from '../config';

export const publishMessage = async (data) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Utilisateur non authentifié.');
  }

  try {
    console.log('Envoi des données pour publier un message :', data);
    const response = await axios.post(`${API_BASE_URL}/admin/publish-message`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Message publié :', response.data);
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
    throw new Error('Erreur lors de la publication du message.');
  }
};

export const getAllMessages = async () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Utilisateur non authentifié.');
  }

  try {
    console.log('Récupération de tous les messages.');
    const response = await axios.get(`${API_BASE_URL}/admin/get-all-message`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Messages reçus :', response.data.data);
    return response.data.data || [];
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
    throw new Error('Erreur lors de la récupération des messages.');
  }
};


