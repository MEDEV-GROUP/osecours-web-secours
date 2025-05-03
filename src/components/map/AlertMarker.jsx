// src/components/map/AlertMarker.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

/**
 * Composant qui affiche un marqueur d'alerte sur la carte
 */
const AlertMarker = ({
    alert,
    position,
    onMarkerClick,
    interventionStatus,
    userPosition
}) => {
    // Émojis par catégorie
    const categoryEmojis = {
        Accidents: "🚗",
        Incendies: "🔥",
        Inondations: "🌊",
        Noyade: "🚤",
        Malaises: "🤕",
        Autre: "⚠️",
    };

    // Fonction pour obtenir l'icône selon le type
    const getIcon = (type) => {
        return L.divIcon({
            html: `<div style="
        font-size: 24px;
        text-align: center;
        line-height: 24px;
      ">${categoryEmojis[type] || "❓"}</div>`,
            className: "",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        });
    };

    // Détermine si une intervention est en cours
    const isIntervening = interventionStatus &&
        (interventionStatus.success || interventionStatus.loading);

    // Gestionnaire d'événement pour le clic sur le marqueur
    const handleMarkerClick = (e) => {
        // Empêche la propagation de l'événement pour éviter le comportement par défaut
        e.originalEvent.stopPropagation();

        // Si une intervention est en cours, ne pas permettre la sélection
        if (!isIntervening) {
            onMarkerClick(alert.id);
        }
    };

    // Calcul de la distance entre l'utilisateur et l'alerte
    const distance = userPosition ? L.latLng(userPosition[0], userPosition[1])
        .distanceTo(L.latLng(position[0], position[1])) : null;

    // Formatage de la distance pour l'affichage
    const formatDistance = (distanceInMeters) => {
        if (!distanceInMeters) return '';

        if (distanceInMeters >= 1000) {
            return `${(distanceInMeters / 1000).toFixed(1)} km`;
        }
        return `${Math.round(distanceInMeters)} m`;
    };

    return (
        <Marker
            position={position}
            icon={getIcon(alert.type)}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        >
            {/* Ce Popup ne s'affichera que si nous n'intervenons pas avec le panneau latéral */}
            {isIntervening && (
                <Popup>
                    <div className="flex flex-col items-center p-2 w-48">
                        <div className="font-bold text-center mb-2">
                            Équipe assignée à cette alerte
                        </div>
                        <p className="text-sm mb-2">Une équipe de secours a été assignée à cette alerte.</p>
                        {interventionStatus && interventionStatus.interventionId && (
                            <button
                                onClick={() => window.location.href = `/maps/follow-team/${alert.id}`}
                                className="bg-blue-500 text-white px-4 py-1 rounded text-sm mt-2 w-full"
                            >
                                Suivre l'équipe
                            </button>
                        )}
                    </div>
                </Popup>
            )}
        </Marker>
    );
};

AlertMarker.propTypes = {
    alert: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        description: PropTypes.string,
        // autres propriétés d'alerte...
    }).isRequired,
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    onMarkerClick: PropTypes.func.isRequired,
    interventionStatus: PropTypes.object,
    userPosition: PropTypes.arrayOf(PropTypes.number)
};

export default AlertMarker;