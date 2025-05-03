// src/hooks/useRescueTeams.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

/**
 * Hook personnalisé pour gérer les équipes de secours
 * @returns {Object} État et fonctions pour la gestion des équipes de secours
 */
const useRescueTeams = () => {
    // États pour les équipes de secours
    const [rescueMembers, setRescueMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [error, setError] = useState(null);

    // État pour suivre les interventions en cours
    const [activeInterventions, setActiveInterventions] = useState({});

    // Récupérer les membres disponibles depuis l'API
    const fetchAvailableMembers = useCallback(async () => {
        setLoadingMembers(true);
        setError(null);

        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Token d'authentification non trouvé");
                return [];
            }

            const response = await axios.get(`${API_BASE_URL}/admin/available-rescue-members`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data?.data) {
                setRescueMembers(response.data.data || []);
                return response.data.data || [];
            } else {
                console.error("Format de données inattendu:", response.data);
                setError("Format de données incorrect");
                return [];
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des membres:", error);
            setError("Erreur lors de la récupération des membres");
            return [];
        } finally {
            setLoadingMembers(false);
        }
    }, []);

    // Assigner une équipe à une alerte
    const assignTeamToAlert = useCallback(async (alertId, rescueMemberId) => {
        if (!alertId || !rescueMemberId) {
            return { success: false, error: "Identifiants manquants" };
        }

        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                return { success: false, error: "Token d'authentification non trouvé" };
            }

            // Mettre à jour l'état local pour feedback immédiat
            setActiveInterventions(prev => ({
                ...prev,
                [alertId]: {
                    loading: true,
                    memberId: rescueMemberId
                }
            }));

            const response = await axios.post(
                `${API_BASE_URL}/intervention/create`,
                {
                    alertId: alertId,
                    rescueMemberId: rescueMemberId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                // Mise à jour réussie
                setActiveInterventions(prev => ({
                    ...prev,
                    [alertId]: {
                        loading: false,
                        memberId: rescueMemberId,
                        success: true,
                        interventionId: response.data?.data?.id || null
                    }
                }));

                return {
                    success: true,
                    interventionId: response.data?.data?.id || null
                };
            } else {
                // Échec de la mise à jour
                setActiveInterventions(prev => ({
                    ...prev,
                    [alertId]: {
                        loading: false,
                        error: response.data?.message || "Erreur lors de la création de l'intervention"
                    }
                }));

                return {
                    success: false,
                    error: response.data?.message || "Erreur lors de la création de l'intervention"
                };
            }
        } catch (error) {
            console.error('Erreur lors de l\'assignation de l\'équipe:', error);

            setActiveInterventions(prev => ({
                ...prev,
                [alertId]: {
                    loading: false,
                    error: error.message || "Erreur lors de la création de l'intervention"
                }
            }));

            return {
                success: false,
                error: error.message || "Erreur lors de la création de l'intervention"
            };
        }
    }, []);

    // Récupérer le statut d'une intervention
    const getInterventionStatus = useCallback((alertId) => {
        return activeInterventions[alertId] || null;
    }, [activeInterventions]);

    // Suivre une équipe sur la carte
    const followTeam = useCallback((alertId) => {
        if (!alertId) return;

        // Redirection vers la page de suivi
        window.location.href = `/maps/follow-team/${alertId}`;
    }, []);

    return {
        // États
        rescueMembers,
        selectedMember,
        loadingMembers,
        error,
        activeInterventions,

        // Setters
        setSelectedMember,

        // Fonctions
        fetchAvailableMembers,
        assignTeamToAlert,
        getInterventionStatus,
        followTeam
    };
};

export default useRescueTeams;