// src/pages/maps.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import "leaflet/dist/leaflet.css";

// Hooks personnalisés
import useMapState from "../hooks/useMapState";
import useAlerts from "../hooks/useAlerts";
import useRescueTeams from "../hooks/useRescueTeams";

// Composants
import MapView from "../components/map/MapView";
import SidePanel from "../components/map/SidePanel";

const MapPage = () => {
  const navigate = useNavigate();

  // Utilisation du hook pour gérer l'état de la carte
  const {
    mapCenter,
    mapZoom,
    mapBounds,
    mapInstance,
    selectedAlertId,
    sidebarOpen,
    setMapCenter,
    setMapZoom,
    setMapBounds,
    setMapInstance,
    calculateBounds,
    calculateDistance,
    formatDistance,
    handleAlertSelect,
    closeSidebar
  } = useMapState();

  // Utilisation du hook pour gérer les alertes
  const {
    alerts,
    filteredAlerts,
    loading: alertsLoading,
    error: alertsError,
    filters,
    searchQuery,
    alertStates,
    categoryStats,
    setFilters,
    setSearchQuery,
    fetchAlerts,
    updateAlertState,
    resetFilters
  } = useAlerts();

  // Utilisation du hook pour gérer les équipes de secours
  const {
    rescueMembers,
    selectedMember,
    loadingMembers,
    error: rescueError,
    activeInterventions,
    setSelectedMember,
    fetchAvailableMembers,
    assignTeamToAlert,
    getInterventionStatus,
    followTeam
  } = useRescueTeams();

  // État pour le filtrage par catégorie
  const [activeCategory, setActiveCategory] = useState(null);

  // Sélectionner une alerte et ouvrir le panneau latéral
  const handleSelectAlert = (alertId) => {
    handleAlertSelect(alertId);
    setSelectedMember(null); // Réinitialiser la sélection de membre

    // Charger les membres disponibles si le panneau est ouvert
    if (alertId) {
      fetchAvailableMembers();
    }

    // Adapter la vue de la carte si nécessaire
    if (alertId && mapInstance) {
      const selectedAlert = filteredAlerts.find(a => a.id === alertId);
      if (selectedAlert) {
        // Centrer la carte sur l'alerte sélectionnée avec un léger décalage
        // pour que l'alerte ne soit pas cachée par le panneau latéral
        const currentBounds = mapInstance.getBounds();
        const alertPos = [selectedAlert.lat, selectedAlert.lon];

        // Ajuster le centre pour éviter que le marqueur soit sous le panneau
        const adjustedCenter = [
          alertPos[0],
          currentBounds.getCenter().lng - 0.05 // Décalage vers la gauche
        ];

        setMapCenter(adjustedCenter);
        setMapZoom(15); // Zoom plus proche pour voir les détails
      }
    }
  };

  // Gérer l'attribution d'une équipe à une alerte
  const handleAssignTeam = async (alertId, memberId) => {
    if (!alertId || !memberId) return;

    // Mettre à jour l'état local pour feedback immédiat
    updateAlertState(alertId, { loading: true });

    // Appeler l'API pour assigner l'équipe
    const result = await assignTeamToAlert(alertId, memberId);

    // Mettre à jour l'état local selon le résultat
    if (result.success) {
      updateAlertState(alertId, {
        loading: false,
        isBack: true,
        interventionId: result.interventionId
      });

      // Fermer le panneau latéral après un court délai
      setTimeout(() => {
        closeSidebar();
        // Rafraîchir les alertes pour mettre à jour les statuts
        fetchAlerts();
      }, 1500);
    } else {
      updateAlertState(alertId, {
        loading: false,
        error: result.error
      });
    }
  };

  // Gérer le suivi d'une équipe de secours
  const handleFollowTeam = (alertId) => {
    if (!alertId) return;
    navigate(`/maps/follow-team/${alertId}`);
  };

  // Filtrer les alertes en fonction de la catégorie active
  useEffect(() => {
    if (activeCategory !== null) {
      setFilters(prev => ({
        ...prev,
        All: false,
        [activeCategory]: true
      }));

      // Réinitialiser les autres catégories
      Object.keys(filters)
        .filter(key => key !== 'Last24Hours' && key !== 'All' && key !== activeCategory)
        .forEach(key => {
          setFilters(prev => ({
            ...prev,
            [key]: false
          }));
        });
    } else {
      // Si aucune catégorie n'est sélectionnée, activer toutes les catégories
      resetFilters();
    }
  }, [activeCategory, resetFilters]);

  // Obtenir l'alerte sélectionnée
  const selectedAlert = selectedAlertId
    ? filteredAlerts.find(alert => alert.id === selectedAlertId)
    : null;



  // Mettre à jour les limites de la carte lors de la recherche
  useEffect(() => {
    if (filteredAlerts.length > 0) {
      const bounds = calculateBounds(filteredAlerts);
      setMapBounds(bounds);
    }
  }, [filteredAlerts, calculateBounds, setMapBounds]);

  return (
    <div className="h-screen w-full relative">
      {/* Afficher un message de chargement si nécessaire */}
      {alertsLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/80">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700">Chargement des alertes...</p>
          </div>
        </div>
      )}

      {/* Afficher un message d'erreur si nécessaire */}
      {alertsError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p>{alertsError}</p>
        </div>
      )}

      {/* Vue principale de la carte */}
      <MapView
        // État de la carte
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        mapBounds={mapBounds}
        setMapCenter={setMapCenter}
        setMapZoom={setMapZoom}
        setMapInstance={setMapInstance}
        userPosition={mapCenter} // Utiliser la position de l'utilisateur

        // Alertes
        alerts={filteredAlerts}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryStats={categoryStats}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}

        // Gestion des interventions
        onAlertSelect={handleSelectAlert}
        getInterventionStatus={getInterventionStatus}
        selectedAlertId={selectedAlertId}

        // Équipes de secours
        rescueTeams={[]} // À implémenter si nécessaire
        followTeam={handleFollowTeam}
      />

      {/* Panneau latéral pour les détails de l'alerte */}
      <SidePanel
        alert={selectedAlert}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        userPosition={mapCenter}
        interventionStatus={selectedAlertId ? getInterventionStatus(selectedAlertId) : null}
        rescueMembers={rescueMembers}
        selectedMember={selectedMember}
        onSelectMember={setSelectedMember}
        onAssignTeam={handleAssignTeam}
        isLoadingMembers={loadingMembers}
        isLoadingAssignment={selectedAlertId ? alertStates[selectedAlertId]?.loading : false}
        error={rescueError}
        onFollowTeam={handleFollowTeam}
        formatDistance={(lat1, lon1, lat2, lon2) => formatDistance(calculateDistance([lat1, lon1], [lat2, lon2]))}
      />

      {/* Styles supplémentaires pour les personnalisations Leaflet */}
      <style jsx>{`
        /* Styles pour les marqueurs, popups et autres éléments de la carte */
        .leaflet-div-icon {
          background: transparent;
          border: none;
        }
        
        .leaflet-control-zoom {
          margin-bottom: 40px !important;
        }

.leaflet-pane,
.leaflet-control,
.leaflet-marker-pane,
.leaflet-tooltip-pane,
.leaflet-popup-pane,
.leaflet-overlay-pane,
.leaflet-shadow-pane,
.leaflet-marker-shadow,
.leaflet-map-pane {
  z-index: 200 !important; /* Valeur inférieure à celle du panneau latéral */
}
      `}</style>
    </div>
  );
};

export default MapPage;