import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';
import {
  MdDashboard,
  MdOutlineDashboard,
  MdOutlineMap,
  MdMap,
  MdOutlineReport,
  MdReport,
  MdPeople,
  MdOutlinePeople,
} from "react-icons/md";
import { AiOutlineMessage, AiFillMessage } from "react-icons/ai";
import { HiOutlineBell, HiBell } from "react-icons/hi";
import UserProfile from "./profile";
import Header from "./Header";

const Sidebar = ({ isCollapsed = false, isMobile, setMobileMenuOpen, isMobileOpen, onMenuItemClick }) => {
  const menuItems = [
    { icon: { active: <MdDashboard />, inactive: <MdOutlineDashboard /> }, label: "Tableau de bord", link: "/tableau-de-bord" },
    { icon: { active: <MdMap />, inactive: <MdOutlineMap /> }, label: "Carte interactive", link: "/maps" },
    { icon: { active: <MdReport />, inactive: <MdOutlineReport /> }, label: "Reporting & Statistiques", link: "/reports" },
    { icon: { active: <HiBell />, inactive: <HiOutlineBell /> }, label: "Alertes émises", link: "/alertes-emises" },
    { icon: { active: <AiFillMessage />, inactive: <AiOutlineMessage /> }, label: "Messages", link: "/messages" },
    { icon: { active: <MdPeople />, inactive: <MdOutlinePeople /> }, label: "Nos Opérateurs Terrains", link: "/operateurs" },
  ];

  return (
    <>
      {isMobile && isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 transition-transform duration-300 ${
          isMobile ? (isMobileOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full") : isCollapsed ? "w-28" : "w-80"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Header isCollapsed={isCollapsed} />
          </div>
          <div className="mt-4 flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-y-6">
              {menuItems.map((item, index) => (
                <li key={index} className="relative group">
                  <NavLink
                    to={item.link}
                    onClick={() => {
                      onMenuItemClick();
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center ${
                        isCollapsed ? "justify-center" : "gap-4 pl-12 py-4"
                      } py-2 ${
                        isActive
                          ? "font-bold text-[#FF3333] bg-gradient-to-r from-red-100 via-red-100 to-white"
                          : "text-gray-600 hover:text-[#FF3333] group-hover:bg-gradient-to-r group-hover:from-red-100 group-hover:via-red-100 group-hover:to-white"
                      }`
                    }
                  >
                    <span className="text-2xl">{item.icon.inactive}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4">
            <UserProfile isCollapsed={isCollapsed} />
          </div>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  setMobileMenuOpen: PropTypes.func.isRequired,
  isMobileOpen: PropTypes.bool.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
};

export default Sidebar;
