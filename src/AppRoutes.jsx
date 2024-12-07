import { Routes, Route, Navigate } from "react-router-dom";
import Layout from './components/sidebar/Layout';
import Dashboard from "./pages/DashboardPage";
import Helpers from "./pages/terrain-secours";
import Maps from "./pages/maps";
import LoginPage from "./pages/LoginPage";
import OperatorsPage from "./pages/Operators/OperatorsPage";
import CreateMemberPage from "./pages/Operators/CreateOperator";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes accessibles sans protection */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/secours-terrain" element={<Helpers />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/operateurs" element={<OperatorsPage />} />
        <Route path="/operateurs/creer-un-nouvel-operateur" element={<CreateMemberPage />} />
        <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
