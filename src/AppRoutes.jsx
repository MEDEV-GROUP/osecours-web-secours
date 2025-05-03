// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from './components/sidebar/Layout';
import Dashboard from "./pages/DashboardPage";
import Helpers from "./pages/terrain-secours";
import Maps from "./pages/maps";
import LoginPage from "./pages/login/page";
import OperatorsPage from "./pages/Operators/OperatorsPage";
import CreateMemberPage from "./pages/Operators/CreateOperator";
import ProtectedRoute from './context/ProtectedRoute';
import NotFoundPage from "./pages/NotFoundPage";
import AlertTable from "./pages/alertes/alertePage";
import CreateAlertePage from "./pages/alertes/createAlerte";
import StatistiquePage from "./pages/ReportPage";
import FollowTeamMap from "./components/FollowTeamMap";
// Import de la nouvelle page d'interventions
import InterventionsPage from "./pages/interventions/InterventionsPage";

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
          <Route path="statistiques" element={<StatistiquePage />} />
          <Route path="secours-terrain" element={<Helpers />} />
          <Route path="maps" element={<Maps />} />
          <Route path="/maps/follow-team/:alertId" element={<FollowTeamMap />} />
          <Route path="operateurs">
            <Route index element={<OperatorsPage />} />
            <Route path="creer-un-nouvel-operateur" element={<CreateMemberPage />} />
          </Route>
          <Route path="alertes-emises">
            <Route index element={<AlertTable />} />
            <Route path="creer-une-alerte" element={<CreateAlertePage />} />
          </Route>
          {/* Nouvelles routes pour les interventions */}
          <Route path="interventions">
            <Route index element={<InterventionsPage />} />
            {/* Nous pourrions ajouter une route pour les détails d'une intervention plus tard */}
            {/* <Route path=":id" element={<InterventionDetailsPage />} /> */}
          </Route>
        </Route>

        {/* Route 404 sans layout, mais toujours protégée */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;