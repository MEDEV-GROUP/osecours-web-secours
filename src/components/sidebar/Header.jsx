import logo from '../../assets/sidebar/logo.svg';
import logo2 from '../../assets/sidebar/logo-2.svg';


import PropTypes from 'prop-types';

const Header = ({ isCollapsed }) => {
  return (
    <div className="flex justify-center rounded-lg shadow-sm">
      {/* Logo conditionnel */}
      <div className="flex items-center pt-6 pb-4">
        {isCollapsed ? (
          <img
            src={logo2} // Remplace par le chemin de ton nouveau logo
            alt="Logo réduit"
            className="w-10 h-10"
          />
        ) : (
          <img
            src={logo}// Remplace par le chemin de ton ancien logo
            alt="Logo principal"
            className="w-48 h-20"
          />
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

export default Header;
