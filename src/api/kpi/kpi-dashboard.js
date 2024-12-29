import axios from 'axios';
import { API_BASE_URL } from '../config';

export const getAllKpi = async () => {
  // Récupération du token depuis le localStorage
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Utilisateur non authentifié : aucun token disponible.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Récupération des données. Si elles sont absentes, renvoyer un objet vide
    return response?.data?.data ?? {};
  } catch (error) {
    // Gestion du cas d'erreur 401 (token invalide ou expiré)
    if (error.response?.status === 401) {
      console.error('Erreur 401 : Token invalide ou expiré.');
      // Optionnel : vider le localStorage ou rediriger l'utilisateur
      // localStorage.removeItem('authToken');
      // window.location.href = '/login'; 
    }

    // Log plus détaillé en cas d'erreur
    console.error(
      'Erreur lors de la récupération des données du tableau de bord :',
      error.response?.data || error.message
    );
    
    throw new Error('Impossible de récupérer les données du tableau de bord.');
  }
};
