// src/hooks/useAlerts.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

/**
 * Hook personnalisé pour gérer la récupération et le filtrage des alertes
 * @returns {Object} État et fonctions pour la gestion des alertes
 */
const useAlerts = () => {
    // États pour les alertes et les filtres
    const [alerts, setAlerts] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour les filtres
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        All: true,
        Last24Hours: true,
        Accidents: true,
        Incendies: true,
        Inondations: true,
        Noyade: true,
        Malaises: true,
        Autre: true,
    });

    // État pour suivre les interventions précédemment assignées
    const [alertStates, setAlertStates] = useState({});

    // Vérifier si une date est dans les dernières 24h
    const isWithinLast24Hours = useCallback((dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        return diffInHours <= 24;
    }, []);

    // Récupérer les alertes depuis l'API
    // Dans le hook useAlerts.js, modifiez la fonction fetchAlerts:
    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Token d'authentification non trouvé");
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/admin/all-alerts`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Correction: vérifiez response.data.data au lieu de response.ok
            if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
                const alertsData = response.data.data.data;
                console.log("Données d'alertes trouvées:", alertsData.length);

                const formattedAlerts = alertsData.map((alert) => ({
                    id: alert.id,
                    type: alert.category,
                    lat: parseFloat(alert.location_lat),
                    lon: parseFloat(alert.location_lng),
                    description: alert.description,
                    alerteurName: alert.reporter ? `${alert.reporter.first_name || ''} ${alert.reporter.last_name || ''}`.trim() : 'Non spécifié',
                    numero: alert.reporter?.phone_number || 'Non spécifié',
                    heureEmission: alert.createdAt,
                    heureEmissionFormatted: new Date(alert.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    media: alert.media || [],
                    imageAlerteur: alert.reporter?.photos?.length > 0
                        ? `${API_BASE_URL}/${alert.reporter.photos[0].photo_url}`
                        : "https://via.placeholder.com/100x100",
                }));

                console.log("Alertes formatées:", formattedAlerts);
                setAlerts(formattedAlerts);
            } else {
                console.error("Format de données inattendu:", response.data);
                setError("Format de données incorrect");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des alertes:", error);
            setError("Erreur lors de la récupération des alertes");
        } finally {
            setLoading(false);
        }
    }, []);

    // Charger l'état des alertes depuis le localStorage
    useEffect(() => {
        const savedAlertStates = localStorage.getItem('alertStates');
        if (savedAlertStates) {
            setAlertStates(JSON.parse(savedAlertStates));
        }
    }, []);

    // Récupérer les alertes au chargement
    useEffect(() => {
        fetchAlerts();

        // Rafraîchir les alertes périodiquement (optionnel)
        // const interval = setInterval(fetchAlerts, 60000); // Toutes les minutes
        // return () => clearInterval(interval);
    }, [fetchAlerts]);

    // Mettre à jour les alertes filtrées lorsque les filtres changent
    useEffect(() => {
        if (!alerts.length) {
            setFilteredAlerts([]);
            return;
        }

        const filtered = alerts.filter((alert) => {
            // Filtrer par Last24Hours si activé
            if (filters.Last24Hours && !isWithinLast24Hours(alert.heureEmission)) {
                return false;
            }

            // Recherche textuelle
            const typeLower = alert.type?.toLowerCase() ?? '';
            const queryLower = searchQuery.toLowerCase();

            if (queryLower.trim()) {
                if (!typeLower.includes(queryLower)) {
                    return false;
                }
            }

            // Filtrer par catégorie
            if (!filters.All && !filters[alert.type]) {
                return false;
            }

            return true;
        });

        setFilteredAlerts(filtered);
    }, [alerts, filters, searchQuery, isWithinLast24Hours]);

    // Mettre à jour l'état d'une alerte (lors de l'assignation d'une équipe)
    const updateAlertState = useCallback((alertId, stateUpdate) => {
        setAlertStates(prev => {
            const newState = {
                ...prev,
                [alertId]: { ...prev[alertId], ...stateUpdate }
            };

            // Sauvegarder dans localStorage pour persistance
            localStorage.setItem('alertStates', JSON.stringify(newState));

            return newState;
        });
    }, []);

    // Réinitialiser les filtres
    const resetFilters = useCallback(() => {
        setFilters({
            All: true,
            Last24Hours: true,
            Accidents: true,
            Incendies: true,
            Inondations: true,
            Noyade: true,
            Malaises: true,
            Autre: true,
        });
        setSearchQuery('');
    }, []);

    // Valeurs dérivées pour optimisation
    const categoryStats = useMemo(() => {
        const stats = {};
        filters.All && filters.Last24Hours
            ? alerts.forEach(alert => {
                if (!stats[alert.type]) stats[alert.type] = 0;
                stats[alert.type]++;
            })
            : filteredAlerts.forEach(alert => {
                if (!stats[alert.type]) stats[alert.type] = 0;
                stats[alert.type]++;
            });
        return stats;
    }, [alerts, filteredAlerts, filters.All, filters.Last24Hours]);

    return {
        // États
        alerts,
        filteredAlerts,
        loading,
        error,
        filters,
        searchQuery,
        alertStates,
        categoryStats,

        // Setters et fonctions
        setFilters,
        setSearchQuery,
        fetchAlerts,
        updateAlertState,
        resetFilters,
        isWithinLast24Hours
    };
};

export default useAlerts;