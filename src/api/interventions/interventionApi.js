import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Récupère la liste des interventions avec pagination
 * @param {number} page - Numéro de la page à récupérer
 * @param {number} limit - Nombre d'interventions par page
 * @returns {Promise<Object>} - Les données de la réponse de l'API
 */
export const getAllInterventions = async (page = 1, limit = 10) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        throw new Error('Utilisateur non authentifié.');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/intervention/list`, {
            params: { page, limit },
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Données des interventions reçues :', response.data);
        return response.data.data || { interventions: [], pagination: {} };
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
        throw new Error('Erreur lors de la récupération des interventions.');
    }
};

/**
 * Récupère les détails d'une intervention spécifique
 * @param {string} id - Identifiant de l'intervention
 * @returns {Promise<Object>} - Les données de la réponse de l'API
 */
export const getInterventionById = async (id) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        throw new Error('Utilisateur non authentifié.');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/intervention/details/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.data || {};
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'intervention :', error);
        throw new Error('Erreur lors de la récupération de l\'intervention.');
    }
};