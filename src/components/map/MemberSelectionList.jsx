// src/components/map/MemberSelectionList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '../ui/spinner'; // Importation du composant de chargement

/**
 * Composant qui affiche une liste des membres d'équipe de secours disponibles
 * pour les attribuer à une alerte
 */
const MemberSelectionList = ({
    members = [],
    selectedMember,
    onSelectMember,
    onAssign,
    alertId,
    isLoading = false,
    isLoadingMembers = false,
    error = null
}) => {
    // Si les membres sont en cours de chargement
    if (isLoadingMembers) {
        return (
            <div className="flex flex-col items-center justify-center py-6">
                <Spinner className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm text-gray-500">Chargement des équipes disponibles...</p>
            </div>
        );
    }

    // Si une erreur s'est produite
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    // Si aucun membre n'est disponible
    if (members.length === 0) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                <p className="text-sm text-amber-600">
                    Aucune équipe de secours disponible actuellement.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Titre */}
            <h3 className="text-lg font-bold mb-4">Sélectionner une équipe de secours</h3>

            {/* Liste des membres */}
            <div className="overflow-x-auto rounded-md border border-gray-200 mb-4">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 w-10"></th>
                            <th className="p-3 text-left">Photo</th>
                            <th className="p-3 text-left">Nom</th>
                            <th className="p-3 text-left">Prénom</th>
                            <th className="p-3 text-left">Téléphone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr
                                key={member.id}
                                className={`border-b cursor-pointer hover:bg-gray-50 transition-colors
                  ${selectedMember?.id === member.id ? 'bg-gray-100' : ''}`}
                                onClick={() => onSelectMember(member)}
                            >
                                <td className="p-3 text-center">
                                    <input
                                        type="radio"
                                        name="selected-member"
                                        checked={selectedMember?.id === member.id}
                                        onChange={() => onSelectMember(member)}
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                    />
                                </td>
                                <td className="p-3">
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL}/${member.user.photo}`}
                                        alt="Photo de profil"
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-user.png'; // Image par défaut en cas d'erreur
                                        }}
                                    />
                                </td>
                                <td className="p-3">{member.user.lastName}</td>
                                <td className="p-3">{member.user.firstName}</td>
                                <td className="p-3">{member.user.phoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bouton d'attribution */}
            <button
                onClick={() => onAssign(alertId, selectedMember?.id)}
                disabled={!selectedMember || isLoading}
                className={`w-full flex justify-center items-center px-4 py-3 rounded-lg text-white
          ${!selectedMember || isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90 cursor-pointer'}
        `}
            >
                {isLoading ? (
                    <>
                        <Spinner className="w-5 h-5 mr-2" />
                        Attribution en cours...
                    </>
                ) : (
                    "Envoyer l'équipe sélectionnée"
                )}
            </button>
        </div>
    );
};

MemberSelectionList.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            user: PropTypes.shape({
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired,
                phoneNumber: PropTypes.string,
                photo: PropTypes.string
            }).isRequired
        })
    ),
    selectedMember: PropTypes.object,
    onSelectMember: PropTypes.func.isRequired,
    onAssign: PropTypes.func.isRequired,
    alertId: PropTypes.string,
    isLoading: PropTypes.bool,
    isLoadingMembers: PropTypes.bool,
    error: PropTypes.string
};

export default MemberSelectionList;