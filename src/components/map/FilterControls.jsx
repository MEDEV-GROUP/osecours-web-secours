// src/components/map/FilterControls.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant pour les contrôles de filtrage par catégorie
 */
const FilterControls = ({
    activeCategory,
    setActiveCategory,
    categoryStats
}) => {
    // Liste des catégories avec leurs icônes et couleurs
    const categories = [
        { id: "Accidents", emoji: "🚗", color: "#FF3333" },
        { id: "Incendies", emoji: "🔥", color: "#F1C01F" },
        { id: "Inondations", emoji: "🌊", color: "#189FFF" },
        { id: "Noyade", emoji: "🚤", color: "#43BE33" },
        { id: "Malaises", emoji: "🤕", color: "#FF6933" },
        { id: "Autre", emoji: "⚠️", color: "#717171" }
    ];

    // Fonction pour obtenir la couleur de fond selon l'état actif
    const getButtonStyle = (category) => {
        const isActive = activeCategory === category.id;
        return {
            background: isActive ? category.color : "rgba(122, 120, 120, 0.70)",
            color: "white"
        };
    };

    return (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex gap-3 z-1000 overflow-x-auto max-w-[90vw] py-2 px-4">
            {/* Bouton "Tous" */}
            <button
                onClick={() => setActiveCategory(null)}
                style={{
                    background: !activeCategory ? "#333333" : "rgba(122, 120, 120, 0.70)",
                    color: "white"
                }}
                className="flex-shrink-0 px-4 py-2 rounded-lg shadow-md flex flex-col items-center justify-center gap-1 w-28 h-16 text-sm font-medium transition-all duration-200 hover:shadow-lg"
            >
                <span className="text-xl">🔍</span>
                <span>Toutes</span>
                {categoryStats && categoryStats.total && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {categoryStats.total}
                    </span>
                )}
            </button>

            {/* Boutons par catégorie */}
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    style={getButtonStyle(category)}
                    className="flex-shrink-0 px-4 py-2 rounded-lg shadow-md flex flex-col items-center justify-center gap-1 w-28 h-16 text-sm font-medium transition-all duration-200 hover:shadow-lg"
                >
                    <span className="text-xl">{category.emoji}</span>
                    <span>{category.id}</span>
                    {categoryStats && categoryStats[category.id] && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                            {categoryStats[category.id]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

FilterControls.propTypes = {
    activeCategory: PropTypes.string,
    setActiveCategory: PropTypes.func.isRequired,
    categoryStats: PropTypes.object
};

export default FilterControls;