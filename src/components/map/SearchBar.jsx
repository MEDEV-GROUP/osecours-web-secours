// src/components/map/SearchBar.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Composant de barre de recherche pour la carte
 */
const SearchBar = ({
    searchQuery,
    setSearchQuery,
    placeholder = "Rechercher une alerte par catégorie"
}) => {
    // État local pour gérer le focus de la barre de recherche
    const [isFocused, setIsFocused] = useState(false);

    // Effacer la recherche
    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className={`
      absolute top-4 left-1/2 -translate-x-1/2 
      bg-white px-4 py-2 rounded-full shadow-md 
      w-80 h-[45px] z-[1000] 
      flex items-center
      transition-all duration-200
      ${isFocused ? 'ring-2 ring-blue-500' : ''}
    `}>
            {/* Icône de recherche */}
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />

            {/* Champ de saisie */}
            <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="border-none outline-none w-full text-sm"
            />

            {/* Bouton de suppression uniquement visible si du texte est présent */}
            {searchQuery && (
                <button
                    onClick={clearSearch}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    aria-label="Effacer la recherche"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

export default SearchBar;