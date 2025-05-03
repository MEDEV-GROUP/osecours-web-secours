// src/components/map/RescueTeamMarker.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

/**
 * Composant qui affiche un marqueur d'équipe de secours sur la carte
 */
const RescueTeamMarker = ({
    team,
    position,
    alertPosition,
    interventionId
}) => {
    // Création d'une icône personnalisée pour l'équipe de secours
    const rescueIcon = L.divIcon({
        html: `<div style="
      font-size: 28px;
      color: #d90429;
      text-align: center;
      line-height: 28px;
    ">🚑</div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });

    // Calcul de la distance entre l'équipe et l'alerte si les deux positions sont disponibles
    const distance = alertPosition && position
        ? L.latLng(position[0], position[1]).distanceTo(L.latLng(alertPosition[0], alertPosition[1]))
        : null;

    // Formatage de la distance pour l'affichage
    const formatDistance = (distanceInMeters) => {
        if (!distanceInMeters) return 'N/A';

        if (distanceInMeters >= 1000) {
            return `${(distanceInMeters / 1000).toFixed(1)} km`;
        }
        return `${Math.round(distanceInMeters)} m`;
    };

    // Estimation du temps d'arrivée
    const estimateArrivalTime = (distanceInMeters, speed = 40) => {
        if (!distanceInMeters) return 'N/A';

        // Vitesse en km/h, distance en mètres
        const timeInHours = distanceInMeters / 1000 / speed;
        const timeInMinutes = Math.round(timeInHours * 60);

        return timeInMinutes;
    };

    return (
        <Marker
            position={position}
            icon={rescueIcon}
        >
            <Popup>
                <div className="p-3">
                    <h4 className="font-bold text-base mb-2">Équipe de secours</h4>

                    {team && (
                        <div className="text-sm mb-2">
                            <p><span className="font-semibold">Membre:</span> {team.user?.firstName} {team.user?.lastName}</p>
                            <p><span className="font-semibold">Position:</span> {team.position || 'Non spécifiée'}</p>
                            <p><span className="font-semibold">Badge:</span> {team.badgeNumber || 'Non spécifié'}</p>
                        </div>
                    )}

                    {distance && (
                        <div className="mt-3 bg-gray-100 p-2 rounded">
                            <p className="text-sm"><span className="font-semibold">Distance de l'alerte:</span> {formatDistance(distance)}</p>
                            <p className="text-sm"><span className="font-semibold">Temps estimé:</span> {estimateArrivalTime(distance)} min</p>
                        </div>
                    )}

                    {interventionId && (
                        <button
                            onClick={() => window.location.href = `/maps/follow-team/${interventionId}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm mt-3 w-full"
                        >
                            Suivre en temps réel
                        </button>
                    )}
                </div>
            </Popup>
        </Marker>
    );
};

RescueTeamMarker.propTypes = {
    team: PropTypes.shape({
        id: PropTypes.string.isRequired,
        position: PropTypes.string,
        badgeNumber: PropTypes.string,
        user: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            // autres propriétés d'utilisateur...
        })
    }),
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    alertPosition: PropTypes.arrayOf(PropTypes.number),
    interventionId: PropTypes.string
};

export default RescueTeamMarker;