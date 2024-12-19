import PropTypes from 'prop-types';
import { FiSidebar } from "react-icons/fi";

const ToggleButton = ({ isCollapsed , onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white-100"
    >
      {/* Conteneur du ToggleButton */}
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className="text-gray-600 p-2 rounded-md hover:bg-gray-200"
          
        >
          {isCollapsed ? (
            <FiSidebar size={20} /> // Icône pour ouvrir
          ) : (
            <FiSidebar size={20} /> // Icône pour fermer
          )}
        </button>
      </div>

      {/* Conteneur indépendant pour le Header */}
      <header className="flex justify-between items-center  p-4"
      >

        <div className="flex items-center space-x-1"
        >
          <span className="font-medium text-gray-600">Bienvenue,</span>
          <span className="text-[#ff3333] text-600 font-black">GSPM Marcory</span>
          <div className="w-8 h-8 bg-purple-500 rounded-full text-white flex justify-center items-center font-bold">
            L
          </div>
        </div>
      </header>
    </div>
  );
};

ToggleButton.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ToggleButton;
