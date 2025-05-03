// src/components/map/SidePanel.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import MemberSelectionList from './MemberSelectionList';
import AlertMediaViewer from '../AlertMediaViewer';
import { API_BASE_URL } from '../../api/config';

/**
 * Composant de panneau latéral pour afficher les détails d'une alerte et gérer
 * l'attribution d'équipes de secours
 */
const SidePanel = ({
    alert,
    isOpen,
    onClose,
    userPosition,
    interventionStatus,
    rescueMembers = [],
    selectedMember,
    onSelectMember,
    onAssignTeam,
    isLoadingMembers,
    isLoadingAssignment,
    error,
    onFollowTeam,
    formatDistance,
}) => {
    // Si le panneau n'est pas ouvert, ne rien afficher
    if (!isOpen || !alert) return null;

    // Déterminer si une intervention est en cours pour cette alerte
    const hasActiveIntervention = interventionStatus &&
        (interventionStatus.success || interventionStatus.loading);

    // Formater un champ d'adresse
    const formatAddressField = useCallback((icon, label, value) => (
        <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 mt-1">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    ), []);

    // Calculer la distance depuis l'utilisateur si disponible
    const distance = userPosition && alert ?
        formatDistance(alert.lat, alert.lon, userPosition[0], userPosition[1]) : null;

    // Déterminer la couleur selon le type d'alerte
    const getColorForType = (type) => {
        const colors = {
            "Accidents": "#FF3333",
            "Incendies": "#F1C01F",
            "Inondations": "#189FFF",
            "Noyade": "#43BE33",
            "Malaises": "#FF6933",
            "Autre": "#717171"
        };
        return colors[type] || "#717171";
    };

    const alertColor = getColorForType(alert.type);

    return (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg z-[1000] overflow-y-auto">
            {/* En-tête du panneau */}
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold">Détails de l'alerte</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Fermer"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Contenu du panneau */}
            <div className="p-4">
                {/* Média de l'alerte */}
                {alert.media && alert.media.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                        <AlertMediaViewer media={alert.media} BASE_URL={API_BASE_URL} />
                    </div>
                )}

                {/* Type d'alerte */}
                <div className="mb-4">
                    <span
                        className="text-sm px-4 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: alertColor }}
                    >
                        {alert.type}
                    </span>
                </div>

                {/* Description de l'alerte */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{alert.description}</p>
                </div>

                {/* Informations de l'alerte */}
                <div className="mb-6 border-b border-gray-200 pb-6">
                    <h3 className="font-semibold mb-3">Informations</h3>
                    {formatAddressField(
                        <MapPin className="h-5 w-5 text-gray-400" />,
                        "Distance",
                        distance || "Non disponible"
                    )}
                    {formatAddressField(
                        <Phone className="h-5 w-5 text-gray-400" />,
                        "Alerteur",
                        alert.alerteurName
                    )}
                    {formatAddressField(
                        <Phone className="h-5 w-5 text-gray-400" />,
                        "Numéro",
                        alert.numero
                    )}
                    {formatAddressField(
                        <Clock className="h-5 w-5 text-gray-400" />,
                        "Heure d'émission",
                        alert.heureEmissionFormatted
                    )}
                </div>

                {/* Section pour l'attribution d'équipe ou le suivi */}
                {hasActiveIntervention ? (
                    // Affichage si une équipe est déjà assignée
                    <div className="text-center py-4">
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                            <p className="text-green-700 font-medium mb-2">Équipe assignée</p>
                            <p className="text-sm text-green-600 mb-4">
                                Une équipe de secours a été envoyée sur place.
                            </p>
                            <button
                                onClick={() => onFollowTeam(alert.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full flex items-center justify-center"
                            >
                                <span>Suivre l'équipe</span>
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                ) : (
                    // Affichage de la liste des membres pour attribution
                    <MemberSelectionList
                        members={rescueMembers}
                        selectedMember={selectedMember}
                        onSelectMember={onSelectMember}
                        onAssign={onAssignTeam}
                        alertId={alert.id}
                        isLoading={isLoadingAssignment}
                        isLoadingMembers={isLoadingMembers}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
};

SidePanel.propTypes = {
    alert: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
        description: PropTypes.string,
        alerteurName: PropTypes.string,
        numero: PropTypes.string,
        heureEmission: PropTypes.string,
        heureEmissionFormatted: PropTypes.string,
        media: PropTypes.array,
        imageAlerteur: PropTypes.string,
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userPosition: PropTypes.arrayOf(PropTypes.number),
    interventionStatus: PropTypes.object,
    rescueMembers: PropTypes.array,
    selectedMember: PropTypes.object,
    onSelectMember: PropTypes.func.isRequired,
    onAssignTeam: PropTypes.func.isRequired,
    isLoadingMembers: PropTypes.bool,
    isLoadingAssignment: PropTypes.bool,
    error: PropTypes.string,
    onFollowTeam: PropTypes.func.isRequired,
    formatDistance: PropTypes.func.isRequired,
};

export default SidePanel;