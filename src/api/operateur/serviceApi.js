import axios from 'axios';
import { API_BASE_URL } from '../config';

export const getAllRescueServices = async () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Utilisateur non authentifié.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/admin/all-rescue-services`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    //console.log('Données des services reçues :', response.data.data);
    return response.data.data || []; // Fallback à un tableau vide
  } catch (error) {
    console.error('Erreur lors de la récupération des services :', error);
    throw new Error('Erreur lors de la récupération des services.');
  }
};
