// src/hooks/useMapState.js
import { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';

/**
 * Hook personnalisé pour gérer l'état de la carte et ses interactions
 * @param {Array} initialPosition - Position initiale [lat, lng]
 * @param {Number} initialZoom - Niveau de zoom initial
 * @returns {Object} - État et fonctions pour manipuler la carte
 */
const useMapState = (initialPosition = [5.347, -4.024], initialZoom = 13) => {
    // États de base de la carte
    const [mapCenter, setMapCenter] = useState(initialPosition);
    const [mapZoom, setMapZoom] = useState(initialZoom);
    const [mapBounds, setMapBounds] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    // État pour la gestion des alertes sélectionnées
    const [selectedAlertId, setSelectedAlertId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fonction pour définir les bounds de la carte à partir d'un tableau d'alertes
    const calculateBounds = useCallback((alerts) => {
        if (!alerts || alerts.length === 0) return null;

        // Initialiser avec les coordonnées de la première alerte
        let minLat = parseFloat(alerts[0].lat);
        let maxLat = parseFloat(alerts[0].lat);
        let minLon = parseFloat(alerts[0].lon);
        let maxLon = parseFloat(alerts[0].lon);

        // Calculer les coordonnées min/max pour tous les points
        alerts.forEach(alert => {
            const lat = parseFloat(alert.lat);
            const lon = parseFloat(alert.lon);

            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLon = Math.min(minLon, lon);
            maxLon = Math.max(maxLon, lon);
        });

        // Ajouter une marge pour que les marqueurs soient tous visibles
        const latMargin = (maxLat - minLat) * 0.1;
        const lonMargin = (maxLon - minLon) * 0.1;

        return [
            [minLat - latMargin, minLon - lonMargin],
            [maxLat + latMargin, maxLon + lonMargin]
        ];
    }, []);

    // Calculer la distance entre deux points
    const calculateDistance = useCallback((point1, point2) => {
        if (!point1 || !point2) return null;

        const latlng1 = L.latLng(point1[0], point1[1]);
        const latlng2 = L.latLng(point2[0], point2[1]);

        return latlng1.distanceTo(latlng2);
    }, []);

    // Formatage de la distance pour l'affichage
    const formatDistance = useCallback((distanceInMeters) => {
        if (!distanceInMeters) return 'N/A';

        if (distanceInMeters >= 1000) {
            return `${(distanceInMeters / 1000).toFixed(1)} km`;
        }
        return `${Math.round(distanceInMeters)} m`;
    }, []);

    // Gérer la sélection d'une alerte
    const handleAlertSelect = useCallback((alertId) => {
        setSelectedAlertId(alertId);
        setSidebarOpen(true);
    }, []);

    // Fermer le panneau latéral
    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
        setSelectedAlertId(null);
    }, []);

    // Lors de la sélection d'une nouvelle alerte, adapter la carte
    useEffect(() => {
        if (selectedAlertId && mapInstance) {
            // Si nécessaire, on pourrait ajuster la vue de la carte ici
            // Par exemple: mapInstance.panTo(new L.LatLng(lat, lng))
        }
    }, [selectedAlertId, mapInstance]);

    return {
        // États
        mapCenter,
        mapZoom,
        mapBounds,
        mapInstance,
        selectedAlertId,
        sidebarOpen,

        // Setters
        setMapCenter,
        setMapZoom,
        setMapBounds,
        setMapInstance,

        // Fonctions utilitaires
        calculateBounds,
        calculateDistance,
        formatDistance,
        handleAlertSelect,
        closeSidebar
    };
};

export default useMapState;