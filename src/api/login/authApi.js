import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Fonction pour effectuer la connexion d'un utilisateur.
 * @param {string} email - L'email de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Promise<Object>} - Les données de la réponse de l'API ou une erreur.
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/login`,
      { email, password },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    // Stocker le jeton dans localStorage après une connexion réussie
   
    return response.data.data;
  } catch (error) {
    if (error.response) {
      console.error('Erreur côté serveur :', error.response.data);
      throw new Error(error.response.data.message || 'Erreur de connexion');
    } else if (error.request) {
      console.error('Erreur réseau :', error.request);
      throw new Error('Impossible de contacter le serveur. Veuillez réessayer.');
    } else {
      console.error('Erreur inattendue :', error.message);
      throw new Error('Une erreur inattendue s’est produite.');
    }
  }
};

export const logoutApi = async () => {
  // Si vous avez un endpoint pour la déconnexion, assurez-vous qu'il est correct
  const response = await fetch('/api/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la déconnexion');
  }
};
