import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { getAllKpi } from "../../api/kpi/kpi-dashboard";

// ----- Composant Skeleton -----
function CommuneChartSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-5xl animate-pulse">
      <div className="mb-6 flex justify-between items-center">
        {/* Barre grise pour le titre */}
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        {/* Simule 3 boutons gris */}
        <div className="flex gap-4">
          <div className="bg-gray-100 w-20 h-8 rounded-full" />
          <div className="bg-gray-100 w-20 h-8 rounded-full" />
          <div className="bg-gray-100 w-20 h-8 rounded-full" />
        </div>
      </div>
      {/* Zone grise pour simuler le chart */}
      <div className="h-80 bg-gray-200 rounded" />
    </div>
  );
}

// ----- Liste des mois -----
const ALL_MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aout",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

// ----- Couleurs pour chaque commune -----
const COLORS = ["#EF4444", "#3B82F6", "#10B981"];

const CommuneSinistreChart = () => {
  const [data, setData] = useState([]);
  const [selectedCommunes, setSelectedCommunes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllKpi();
        const communes = response?.dashboard?.communes?.data || [];

        // Récupère les 3 communes les plus sinistrées
        const topCommunes = communes
          .sort((a, b) => b.monthly_incidents[0]?.count - a.monthly_incidents[0]?.count)
          .slice(0, 3);

        // Formate les données pour Recharts
        const formattedData = ALL_MONTHS.map((month) => {
          const monthData = { month };
          topCommunes.forEach((commune, index) => {
            const communeIncident = commune.monthly_incidents.find(
              (incident) => incident.month === month
            );
            monthData[commune.name] = communeIncident ? communeIncident.count : 0;
          });
          return monthData;
        });

        // Par défaut, on active TOUTES les communes
        const initialSelection = topCommunes.reduce((acc, commune, index) => {
          acc[commune.name] = {
            active: true,
            color: COLORS[index]
          };
          return acc;
        }, {});

        setData(formattedData);
        setSelectedCommunes(initialSelection);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCommune = (clickedCommune) => {
    setSelectedCommunes((prev) => {
      // Crée une copie de l'état précédent
      const updated = { ...prev };
      
      // Si la commune cliquée était déjà la seule active
      const activeCommunes = Object.entries(prev).filter(([_, info]) => info.active);
      const wasOnlyActiveCommune = activeCommunes.length === 1 && prev[clickedCommune]?.active;

      if (wasOnlyActiveCommune) {
        // Réactiver toutes les communes
        Object.keys(updated).forEach((key) => {
          updated[key] = { ...updated[key], active: true };
        });
      } else {
        // Désactiver toutes les communes sauf celle cliquée
        Object.keys(updated).forEach((key) => {
          updated[key] = { 
            ...updated[key], 
            active: key === clickedCommune 
          };
        });
      }

      return updated;
    });
  };

  // ----- Affichage du Squelette si en cours de chargement -----
  if (loading) {
    return <CommuneChartSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-5xl">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg mb-4">Les communes les plus sinistrées</h2>
        <div className="flex gap-4">
          {Object.entries(selectedCommunes).map(([commune, info]) => {
            const { active, color } = info;
            const buttonStyle = {
              backgroundColor: active ? `${color}19` : '', // 19 en hexa = 10% d'opacité
              color: active ? color : '',
            };
            const dotStyle = {
              backgroundColor: active ? color : '#D1D5DB', // gray-300 pour l'état inactif
            };
            
            return (
              <button
                key={commune}
                onClick={() => toggleCommune(commune)}
                className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                  active ? '' : 'bg-gray-100 text-gray-400'
                }`}
                style={buttonStyle}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={dotStyle}
                />
                {commune}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF" }}
              domain={[0, 40]}
              ticks={[0, 20, 40]}
            />
            {Object.entries(selectedCommunes).map(([commune, info]) =>
              info.active ? (
                <Bar
                  key={commune}
                  dataKey={commune}
                  fill={info.color}
                  radius={[4, 4, 0, 0]}
                />
              ) : null
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommuneSinistreChart;