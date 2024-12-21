import { useState } from "react";
import IncidentDashboard from "../components/dashboard/incidentCard";
import CommuneSinistreChart from "../components/dashboard/CommuneSinistreChart;";

const DashboardPage = () => {
  const [filter, setFilter] = useState("jour");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-3xl font-bold mb-6">Total d&apos;alertes reçues</h1>
        <div>
          <div className="flex items-center text-base space-x-1">
            <span
              onClick={() => setFilter("jour")}
              className={`cursor-pointer ${
                filter === "jour"
                  ? "font-bold text-black"
                  : "font-normal text-gray-500"
              }`}
            >
              Jour
            </span>
            <span>/</span>
            <span
              onClick={() => setFilter("semaine")}
              className={`cursor-pointer ${
                filter === "semaine"
                  ? "font-bold text-black"
                  : "font-normal text-gray-500"
              }`}
            >
              Semaine
            </span>
            <span>/</span>
            <span
              onClick={() => setFilter("mois")}
              className={`cursor-pointer ${
                filter === "mois"
                  ? "font-bold text-black"
                  : "font-normal text-gray-500"
              }`}
            >
              Mois
            </span>
          </div>
        </div>
      </div>

      {/* Filtres sous forme de texte "Jour / Semaine / Mois" */}

      {/* Votre composant d’incidents avec le filtre en prop */}
      <IncidentDashboard filter={filter} />
      <div className="mt-6">
        <CommuneSinistreChart />
      </div>
    </div>
  );
};

export default DashboardPage;
