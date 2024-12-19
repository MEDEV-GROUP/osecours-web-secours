// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from './components/sidebar/Layout';
import Dashboard from "./pages/DashboardPage";
import Helpers from "./pages/terrain-secours";
import Maps from "./pages/maps";
import LoginPage from "./pages/LoginPage";
import OperatorsPage from "./pages/Operators/OperatorsPage";
import CreateMemberPage from "./pages/Operators/CreateOperator";
import ProtectedRoute from './context/ProtectedRoute';
import NotFoundPage from "./pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route publique (non protégée) */}
      <Route path="/" element={<LoginPage />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        {/* Routes avec layout */}
        <Route element={<Layout />}>
          <Route path="tableau-de-bord" element={<Dashboard />} />
          <Route path="secours-terrain" element={<Helpers />} />
          <Route path="maps" element={<Maps />} />
          <Route path="operateurs">
            <Route index element={<OperatorsPage />} />
            <Route path="creer-un-nouvel-operateur" element={<CreateMemberPage />} />
          </Route>
        </Route>

        {/* Route 404 sans layout, mais toujours protégée */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
