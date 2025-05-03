// src/components/map/MapView.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    MapContainer,
    TileLayer,
    useMap,
    LayersControl,
    ZoomControl
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AlertMarker from './AlertMarker';
import RescueTeamMarker from './RescueTeamMarker';
import SearchBar from './SearchBar';
import FilterControls from './FilterControls';
import MapLegend from './MapLegend';

// Composant interne pour mettre à jour la vue de la carte
const MapUpdater = ({ center, zoom, bounds }) => {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        } else if (center) {
            map.setView(center, zoom || map.getZoom());
        }
    }, [map, center, zoom, bounds]);

    return null;
};

// Composant interne pour la localisation de l'utilisateur
const LocationMarker = ({ setPosition }) => {
    const map = useMap();

    useEffect(() => {
        map.locate({
            setView: false,
            maxZoom: 16,
            enableHighAccuracy: true,
            watch: true
        });

        const onLocationFound = (e) => {
            setPosition([e.latlng.lat, e.latlng.lng]);
        };

        const onLocationError = (e) => {
            console.error("Erreur de géolocalisation:", e.message);
        };

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        return () => {
            map.off('locationfound', onLocationFound);
            map.off('locationerror', onLocationError);
            map.stopLocate();
        };
    }, [map, setPosition]);

    return null;
};

// URLs pour les différents types de cartes Google
const GOOGLE_MAPS = {
    roads: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    satellite: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    hybrid: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
};

/**
 * Composant principal de la carte
 */
const MapView = ({
    // État de la carte
    mapCenter,
    mapZoom,
    mapBounds,
    setMapCenter,
    setMapZoom,
    setMapInstance,
    userPosition,

    // Alertes
    alerts,
    activeCategory,
    setActiveCategory,
    categoryStats,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,

    // Gestion des interventions
    onAlertSelect,
    getInterventionStatus,
    selectedAlertId,

    // Équipes de secours
    rescueTeams,
    followTeam,
}) => {
    const mapRef = useRef(null);

    // Effet pour enregistrer l'instance de la carte
    useEffect(() => {
        if (mapRef.current) {
            setMapInstance(mapRef.current);
        }
    }, [mapRef, setMapInstance]);

    return (
        <div className="h-full w-full relative">
            {/* Barre de recherche */}
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Rechercher une alerte par type, lieu..."
            />

            {/* Contrôles de filtrage par catégorie */}
            <FilterControls
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categoryStats={categoryStats}
            />

            {/* Légende et filtres avancés */}
            <MapLegend
                filters={filters}
                setFilters={setFilters}
                categoryStats={categoryStats}
            />

            {/* Carte Leaflet */}
            <MapContainer
                ref={mapRef}
                center={mapCenter || [5.347, -4.024]}
                zoom={mapZoom || 13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
            >
                {/* Contrôles de zoom (position personnalisée) */}
                <ZoomControl position="bottomright" />

                {/* Composants internes pour la mise à jour de la carte */}
                <MapUpdater center={mapCenter} zoom={mapZoom} bounds={mapBounds} />
                <LocationMarker setPosition={setMapCenter} />

                {/* Couches de carte (OpenStreetMap, Google Maps, etc.) */}
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maxZoom={19}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Google Roadmap">
                        <TileLayer
                            url={GOOGLE_MAPS.roads}
                            maxZoom={19}
                            attribution='&copy; <a href="https://maps.google.com/">Google</a>'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Google Satellite">
                        <TileLayer
                            url={GOOGLE_MAPS.satellite}
                            maxZoom={19}
                            attribution='&copy; <a href="https://maps.google.com/">Google</a>'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Google Hybrid">
                        <TileLayer
                            url={GOOGLE_MAPS.hybrid}
                            maxZoom={19}
                            attribution='&copy; <a href="https://maps.google.com/">Google</a>'
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {/* Marqueurs pour les alertes */}
                {alerts.map((alert) => (
                    <AlertMarker
                        key={alert.id}
                        alert={alert}
                        position={[alert.lat, alert.lon]}
                        onMarkerClick={onAlertSelect}
                        interventionStatus={getInterventionStatus(alert.id)}
                        userPosition={userPosition}
                        isSelected={selectedAlertId === alert.id}
                    />
                ))}

                {/* Marqueurs pour les équipes de secours */}
                {rescueTeams && rescueTeams.map((team) => {
                    if (team.position) {
                        // Trouver l'alerte associée à cette équipe (si disponible)
                        const alertId = team.alertId;
                        const alert = alerts.find(a => a.id === alertId);
                        const alertPosition = alert ? [alert.lat, alert.lon] : null;

                        return (
                            <RescueTeamMarker
                                key={team.id}
                                team={team}
                                position={team.position}
                                alertPosition={alertPosition}
                                interventionId={team.interventionId}
                            />
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};

MapView.propTypes = {
    // État de la carte
    mapCenter: PropTypes.arrayOf(PropTypes.number),
    mapZoom: PropTypes.number,
    mapBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    setMapCenter: PropTypes.func.isRequired,
    setMapZoom: PropTypes.func.isRequired,
    setMapInstance: PropTypes.func.isRequired,
    userPosition: PropTypes.arrayOf(PropTypes.number),

    // Alertes
    alerts: PropTypes.array.isRequired,
    activeCategory: PropTypes.string,
    setActiveCategory: PropTypes.func.isRequired,
    categoryStats: PropTypes.object,
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,

    // Gestion des interventions
    onAlertSelect: PropTypes.func.isRequired,
    getInterventionStatus: PropTypes.func.isRequired,
    selectedAlertId: PropTypes.string,

    // Équipes de secours
    rescueTeams: PropTypes.array,
    followTeam: PropTypes.func.isRequired,
};

MapUpdater.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
};

LocationMarker.propTypes = {
    setPosition: PropTypes.func.isRequired
};

export default MapView;