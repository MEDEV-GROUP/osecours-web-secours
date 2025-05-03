// src/components/map/MapLegend.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant de légende pour la carte montrant les filtres disponibles
 */
const MapLegend = ({
    filters,
    setFilters,
    categoryStats
}) => {
    // Catégories avec leurs couleurs et icônes
    const categories = [
        { id: "Accidents", emoji: "🚗", color: "#FF3333" },
        { id: "Incendies", emoji: "🔥", color: "#F1C01F" },
        { id: "Inondations", emoji: "🌊", color: "#189FFF" },
        { id: "Noyade", emoji: "🚤", color: "#43BE33" },
        { id: "Malaises", emoji: "🤕", color: "#FF6933" },
        { id: "Autre", emoji: "⚠️", color: "#717171" }
    ];

    // Fonction pour basculer tous les filtres
    const toggleAllFilters = () => {
        setFilters(prev => {
            const newAllState = !prev.All;

            // Si "Tous" est activé, on active toutes les catégories
            // Sinon, on conserve l'état de Last24Hours
            return Object.keys(prev).reduce((acc, key) => {
                acc[key] = key === 'Last24Hours' ? prev.Last24Hours : newAllState;
                return acc;
            }, {});
        });
    };

    // Fonction pour basculer un filtre spécifique
    const toggleFilter = (filter) => {
        if (filter === 'Last24Hours') {
            setFilters(prev => ({
                ...prev,
                Last24Hours: !prev.Last24Hours
            }));
        } else {
            setFilters(prev => {
                const newValue = !prev[filter];

                // Si on active un filtre spécifique, on désactive "Tous"
                return {
                    ...prev,
                    [filter]: newValue,
                    All: false
                };
            });
        }
    };

    return (
        <div className="absolute top-24 left-4 bg-gray-800/70 p-4 rounded-lg shadow-lg z-[1000]">
            <h3 className="text-white font-semibold mb-3">Filtres</h3>

            <ul className="list-none p-0 m-0 space-y-2">
                {/* Filtre des dernières 24h */}
                <li className="text-white p-2 bg-[#0C8F8F]/50 rounded flex items-center">
                    <input
                        type="checkbox"
                        checked={filters.Last24Hours}
                        onChange={() => toggleFilter('Last24Hours')}
                        className="mr-2 h-4 w-4"
                        id="filter-24h"
                    />
                    <label htmlFor="filter-24h" className="flex items-center cursor-pointer">
                        <span className="mr-2">🕒</span>
                        Dernières 24h
                    </label>
                </li>

                {/* Filtre "Toutes les alertes" */}
                <li className="text-white mb-1 flex items-center">
                    <input
                        type="checkbox"
                        checked={filters.All}
                        onChange={toggleAllFilters}
                        className="mr-2 h-4 w-4"
                        id="filter-all"
                    />
                    <label htmlFor="filter-all" className="cursor-pointer">
                        Toutes les alertes
                    </label>
                </li>

                {/* Ligne séparatrice */}
                <div className="border-t border-gray-600 my-2"></div>

                {/* Filtres par catégorie */}
                {categories.map(category => (
                    <li key={category.id} className="text-white mb-1 flex items-center">
                        <input
                            type="checkbox"
                            checked={filters[category.id]}
                            onChange={() => toggleFilter(category.id)}
                            className="mr-2 h-4 w-4"
                            id={`filter-${category.id}`}
                        />
                        <label
                            htmlFor={`filter-${category.id}`}
                            className="flex items-center justify-between w-full cursor-pointer"
                        >
                            <div className="flex items-center">
                                <span className="text-base mr-2">{category.emoji}</span>
                                <span>{category.id}</span>
                            </div>

                            {/* Afficher le nombre d'alertes par catégorie si disponible */}
                            {categoryStats && categoryStats[category.id] !== undefined && (
                                <span className="ml-2 bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    {categoryStats[category.id]}
                                </span>
                            )}
                        </label>
                    </li>
                ))}
            </ul>

            <div className="mt-3 text-xs text-gray-300 italic">
                Sélectionnez au moins une catégorie
            </div>
        </div>
    );
};

MapLegend.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    categoryStats: PropTypes.object
};

export default MapLegend;