import React from 'react';
import PropTypes from 'prop-types';

// Fonction pour formater une date
const formatDateTime = (dateString) => {
    if (!dateString) return "-";
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

const TimelineEvents = ({ events }) => {
    if (!events || events.length === 0) {
        return (
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Aucun événement disponible</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Ligne verticale de la timeline */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

            <ul className="space-y-6 pl-12 relative">
                {events.map((event, index) => (
                    <li key={index} className="relative">
                        {/* Point de la timeline */}
                        <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow"></div>

                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-semibold text-gray-800">{event.event}</h4>
                                <time className="text-sm text-gray-500">{formatDateTime(event.timestamp)}</time>
                            </div>
                            <p className="text-gray-600 text-sm">{event.description}</p>

                            {/* Afficher le statut si disponible */}
                            {event.status && (
                                <div className="mt-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${event.status === "SUCCESS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

TimelineEvents.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            event: PropTypes.string.isRequired,
            timestamp: PropTypes.string.isRequired,
            description: PropTypes.string,
            status: PropTypes.string,
            user: PropTypes.string
        })
    ).isRequired
};

export default TimelineEvents;