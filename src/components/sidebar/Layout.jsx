import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import ToggleButton from "./togglebutton";
import CustomBreadcrumb from "../Breadcrumb";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsSidebarCollapsed(true);
    }
  }, [location]);

  const isLoginPage = location.pathname === "/login";
  const isMapPage = location.pathname === "/maps"; // Vérifiez si c'est la page de la carte
  const isFollowMapPage = location.pathname.startsWith("/maps/follow-team/"); // Vérifiez si c'est la page de la carte

  return (
    <div className={`flex h-screen ${isLoginPage ? "login-page" : "app-layout"}`}>
      {!isLoginPage && (
        <>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            isMobile={isMobile}
            setMobileMenuOpen={setIsMobileSidebarOpen}
            isMobileOpen={isMobileSidebarOpen}
            onMenuItemClick={() => setIsSidebarCollapsed(true)}
          />
          {isMobile && isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            ></div>
          )}
        </>
      )}

      <div
        className={`flex-1 flex flex-col ${isLoginPage ? "" : "transition-all duration-300"}`}
        style={{
          marginLeft: isLoginPage
            ? "0"
            : isMobile
            ? "0"
            : isSidebarCollapsed
            ? "7rem"
            : "20rem",
        }}
      >
        {/* Exclusion du ToggleButton uniquement sur la page de la carte */}
        {!isLoginPage && !isMapPage && !isFollowMapPage &&(
          <header className="p-4 bg-white shadow-md">
            <ToggleButton
              isCollapsed={isSidebarCollapsed}
              onToggle={() =>
                isMobile
                  ? setIsMobileSidebarOpen((prev) => !prev)
                  : setIsSidebarCollapsed((prev) => !prev)
              }
            />
          </header>
        )}



        <main
          className={`${isLoginPage
              ? "w-full h-[100vh] flex justify-center items-center"
              : "bg-gray-100 p-8 min-h-[100vh]"  // Changement de h- à min-h-
            }`}
        >
          {!isMapPage && !isFollowMapPage &&<CustomBreadcrumb />}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
