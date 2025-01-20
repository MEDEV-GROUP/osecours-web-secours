import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ToggleButton from "./togglebutton";
import CustomBreadcrumb from "../Breadcrumb";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
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

  const isLoginPage = location.pathname === "/";

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
        {!isLoginPage && (
          <header className="p-4 bg-white shadow-md">
            <ToggleButton
              isCollapsed={isSidebarCollapsed}
              onToggle={() =>
                isMobile
                  ? setIsMobileSidebarOpen(prev => !prev)
                  : setIsSidebarCollapsed(prev => !prev)
              }
            />
          </header>
        )}

        {/* Intégration du fil d'Ariane */}
        {!isLoginPage && (
          <div className=" bg-white border-b">
            
          </div>
        )}

        <main
          className={
            isLoginPage
              ? "w-full h-screen flex justify-center items-center"
              : "bg-gray-100 p-8 h-s"
          }
        ><CustomBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
