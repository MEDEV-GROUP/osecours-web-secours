import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, User, Clock, Clipboard, Phone, Info, Briefcase } from 'lucide-react';
import TimelineEvents from './TimelineEvents';
import AlertMediaViewer from '../AlertMediaViewer';
import { API_BASE_URL } from '../../api/config';

// Fonction pour formater une date
const formatDateTime = (dateString) => {
    if (!dateString) return "Non défini";
    try {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (error) {
        return "Date invalide";
    }
};

// Composant pour afficher un statut
const StatusBadge = ({ status }) => {
    const statusConfig = {
        EN_ROUTE: { label: "En route", bgColor: "bg-blue-100 text-blue-800" },
        SUR_PLACE: { label: "Sur place", bgColor: "bg-green-100 text-green-800" },
        EN_COURS: { label: "En cours", bgColor: "bg-yellow-100 text-yellow-800" },
        TERMINE: { label: "Terminé", bgColor: "bg-gray-100 text-gray-800" }
    };

    const config = statusConfig[status] || { label: status, bgColor: "bg-gray-100 text-gray-800" };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor}`}>
            {config.label}
        </span>
    );
};

// Mapping des catégories d'alertes avec leurs couleurs
const categoryColors = {
    "Accidents": "bg-red-500",
    "Incendies": "bg-yellow-500",
    "Inondations": "bg-blue-500",
    "Noyade": "bg-green-500",
    "Malaises": "bg-orange-500",
    "Autre": "bg-gray-500"
};

// Composant pour une section d'information
const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-4 gap-2">
            <Icon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {children}
    </div>
);

const InterventionDetails = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="grid gap-6 animate-pulse">
                <div className="bg-gray-100 h-12 rounded-lg"></div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 h-64 rounded-lg"></div>
                    <div className="bg-gray-100 h-64 rounded-lg"></div>
                </div>
                <div className="bg-gray-100 h-96 rounded-lg"></div>
            </div>
        );
    }

    if (!data || !data.intervention) {
        return (
            <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
                <p className="text-red-600">Impossible de récupérer les détails de l'intervention</p>
            </div>
        );
    }

    const { intervention, alert, rescueTeam, timeline } = data;

    return (
        <div className="space-y-6">
            {/* En-tête avec les informations principales */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            Intervention #{intervention.id.substring(0, 8)}
                        </h2>
                        <div className="flex items-center gap-3 text-gray-600">
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDateTime(intervention.startTime)}
                            </span>
                            {alert && (
                                <span className={`px-3 py-1 rounded-full text-white text-sm ${categoryColors[alert.category] || "bg-gray-500"}`}>
                                    {alert.category}
                                </span>
                            )}
                        </div>
                    </div>
                    <StatusBadge status={intervention.status} />
                </div>
            </div>

            {/* Contenu principal: détails et média */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Détails de l'alerte */}
                <InfoSection title="Détails de l'alerte" icon={Info}>
                    {alert && (
                        <div className="space-y-4">
                            {alert.media && alert.media.length > 0 && (
                                <div className="mb-4 rounded-lg overflow-hidden">
                                    <AlertMediaViewer media={alert.media} BASE_URL={API_BASE_URL} />
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Adresse</p>
                                        <p className="font-medium">{alert.address || "Non spécifiée"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Clipboard className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="font-medium">{alert.description || "Aucune description disponible"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Alerteur</p>
                                        <p className="font-medium">{alert.reporter?.name || "Non spécifié"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Téléphone</p>
                                        <p className="font-medium">{alert.reporter?.phoneNumber || "Non spécifié"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </InfoSection>

                {/* Détails de l'équipe de secours */}
                <InfoSection title="Équipe de secours" icon={Briefcase}>
                    {rescueTeam && rescueTeam.member ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                                    {rescueTeam.member.user?.photo && (
                                        <img
                                            src={`${API_BASE_URL}/${rescueTeam.member.user.photo}`}
                                            alt="Photo de l'agent"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-user.png'; // Image par défaut
                                            }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">{rescueTeam.member.user?.name || "Non spécifié"}</h4>
                                    <p className="text-gray-500">{rescueTeam.service?.name || "Service non spécifié"}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Briefcase className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Position</p>
                                        <p className="font-medium">{rescueTeam.member.position || "Non spécifiée"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Clipboard className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Badge</p>
                                        <p className="font-medium">{rescueTeam.member.badgeNumber || "Non spécifié"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Contact</p>
                                        <p className="font-medium">{rescueTeam.member.user?.phoneNumber || "Non spécifié"}</p>
                                    </div>
                                </div>

                                {rescueTeam.service && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h5 className="font-semibold mb-2">Service de secours</h5>
                                        <p className="text-sm text-gray-600 mb-2">{rescueTeam.service.name}</p>
                                        <p className="text-sm text-gray-600">{rescueTeam.service.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucune équipe assignée à cette intervention</p>
                    )}
                </InfoSection>
            </div>

            {/* Chronologie des événements */}
            <InfoSection title="Chronologie" icon={Clock}>
                <TimelineEvents events={timeline || []} />
            </InfoSection>

            {/* Notes et métriques */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Notes */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
                    <p className="text-gray-600">
                        {intervention.notes || "Aucune note disponible pour cette intervention"}
                    </p>
                </div>

                {/* Métriques */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Métriques</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Temps de réponse</p>
                            <p className="text-xl font-bold text-blue-600">
                                {intervention.metrics?.responseTime ? `${intervention.metrics.responseTime} min` : "N/A"}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Durée totale</p>
                            <p className="text-xl font-bold text-blue-600">
                                {intervention.metrics?.totalDuration ? `${intervention.metrics.totalDuration} min` : "En cours"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

InterventionDetails.propTypes = {
    data: PropTypes.shape({
        intervention: PropTypes.object,
        alert: PropTypes.object,
        rescueTeam: PropTypes.object,
        timeline: PropTypes.array
    }),
    loading: PropTypes.bool
};

export default InterventionDetails;