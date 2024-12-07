import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { AiOutlineBell, AiOutlineSetting } from "react-icons/ai";
import { MdAccountBox } from "react-icons/md";
import { BsCreditCard } from "react-icons/bs";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AlertDialog, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogContent } from "@/components/ui/alert-dialog";

const UserProfile = ({ isCollapsed }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout, user } = useAuth(); // Récupérer 'user' depuis AuthContext
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Rediriger vers la page de connexion après déconnexion
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Gestionnaire pour fermer le menu si on clique à l'extérieur
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    // Ajouter l'écouteur d'événements pour détecter les clics en dehors du menu
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Nettoyer l'écouteur d'événements
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Extraire les informations de l'utilisateur depuis le contexte
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
  const userEmail = user ? user.email : 'email@example.com';

  // Calculer les initiales de l'utilisateur
  const userInitials = userName.split(' ').map(name => name.charAt(0)).join('').toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Conteneur principal */}
      <div
        className={`flex ${isCollapsed ? "justify-center" : "justify-between"} items-center p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer`}
        onClick={toggleMenu}
      >
        {/* Avatar ou initiales */}
        {userInitials ? (
          <div className="w-10 h-10 bg-gray-300 text-white flex items-center justify-center rounded-full">
            {userInitials}
          </div>
        ) : (
          <img
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        )}
        {/* Masquer les informations en mode réduit */}
        {!isCollapsed && (
          <div className="flex flex-col ml-4">
            <span className="font-semibold text-sm text-gray-800">{userName}</span>
            <span className="text-xs text-gray-500">{userEmail}</span>
          </div>
        )}
        {/* Icône du menu */}
        {!isCollapsed && <FiChevronDown className="text-gray-500" size={20} />}
      </div>

      {/* Menu déroulant */}
      {isMenuOpen && (
        <div
          className={`absolute ${isCollapsed ? "top-14 left-1/2 transform -translate-x-1/2" : "top-0 left-full"} w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 transition-all duration-200 ease-in-out`}
          style={{
            transform: isCollapsed
              ? "translate(20%, -196px)" // Centré sous l'avatar en mode réduit
              : "translate(4%, -140px)", // À droite avec translation en mode étendu
          }}
        >
          <ul className="py-2">
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              <AiOutlineSetting size={18} className="text-gray-500" />
              Paramètres
            </li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              <MdAccountBox size={18} className="text-gray-500" />
              Mon Compte
            </li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              <BsCreditCard size={18} className="text-gray-500" />
              Facturation
            </li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              <AiOutlineBell size={18} className="text-gray-500" />
              Notifications
            </li>
            <hr className="my-2" />
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <FiLogOut size={18} className="text-gray-500" />
              Se déconnecter
            </li>
          </ul>
        </div>
      )}

      {/* AlertDialog pour la déconnexion */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirmation de déconnexion</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </AlertDialogDescription>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel onClick={() => setIsLogoutDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Confirmer</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

UserProfile.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

export default UserProfile;
