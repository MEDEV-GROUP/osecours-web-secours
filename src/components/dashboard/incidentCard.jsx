import { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Car,
  Flame,
  Droplets,
  Phone,
  MoreHorizontal,
} from "lucide-react";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import { getAllKpi } from "../../api/kpi/kpi-dashboard";

// ---------- FILTRES FR -> EN ----------
const getFilterKey = (frenchFilter) => {
  switch (frenchFilter) {
    case "jour":
      return "daily";
    case "semaine":
      return "weekly";
    case "mois":
      return "monthly";
    default:
      return "daily";
  }
};

// ---------- CATEGORIES PAR DÉFAUT ----------
const DEFAULT_CATEGORIES = [
  "malaises",
  "accidents",
  "inondations",
  "incendies",
  "noyade",
  "autre",
];

// ---------- ICONES PAR CATÉGORIE ----------
const iconMap = {
  malaises: Phone,
  accidents: Car,
  inondations: Droplets,
  incendies: Flame,
  noyade: Droplets,
  autre: MoreHorizontal,
};

// ---------- COULEURS PAR CATÉGORIE ----------
const categoryColors = {
  malaises: {
    color: "bg-orange-500",
    rectColor: "#f97316",
  },
  accidents: {
    color: "bg-red-500",
    rectColor: "#ef4444",
  },
  inondations: {
    color: "bg-blue-500",
    rectColor: "#3b82f6",
  },
  incendies: {
    color: "bg-yellow-500",
    rectColor: "#eab308",
  },
  noyade: {
    color: "bg-green-500",
    rectColor: "#22c55e",
  },
  autre: {
    color: "bg-gray-500",
    rectColor: "#6b7280",
  },
};

// ---------- COMPOSANT SKELETON ----------
const IncidentCardSkeleton = () => {
  return (
    <div className="relative bg-white rounded-lg p-8 shadow animate-pulse">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 rounded-r-full bg-gray-300" />
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-8 w-8 bg-gray-300 rounded" />
      </div>
      <div className="h-14 bg-gray-300 rounded mb-2 w-1/3" />
      <div className="flex items-center space-x-2 text-sm">
        <div className="h-4 w-4 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );
};

// ---------- CONSTRUCTION DES INCIDENTS ----------
const getIncidentsData = (filter, dashboardData) => {
  if (!dashboardData?.statistics) return [];

  const englishFilter = getFilterKey(filter);
  const breakdown = dashboardData.statistics[englishFilter]?.breakdown || {};

  return DEFAULT_CATEGORIES.map((key) => {
    const incident = breakdown[key] || {
      count: 0,
      variation: 0,
      variation_type: "increase", // ou "decrease"
    };
    const count = incident.count;
    const change = incident.variation;
    const isIncrease = incident.variation_type === "increase";

    const colors = categoryColors[key] || {
      color: "bg-gray-500",
      rectColor: "#6b7280",
    };

    return {
      title: key.charAt(0).toUpperCase() + key.slice(1),
      count,
      change,
      icon: iconMap[key] || MoreHorizontal,
      color: colors.color,
      rectColor: colors.rectColor,
      isIncrease,
    };
  });
};

// ---------- COMPOSANT CARTE ----------
const IncidentCard = ({
  title,
  count,
  change,
  icon: Icon,
  color,
  rectColor,
  isIncrease,
}) => {
  const absChange = Math.abs(change);

  return (
    <div className="relative bg-white rounded-lg p-8 shadow transition-all duration-500">
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 rounded-r-full transition-all duration-500"
        style={{ backgroundColor: rectColor }}
      />
      <div className="flex justify-between items-start mb-2">
        <span className="text-black font-medium text-lg">{title}</span>
        <div className={`p-2 rounded-lg ${color} transition-all duration-500`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div
        className="text-7xl font-bold mb-2 transition-colors duration-500"
        style={{ color: rectColor }}
      >
        <CountUp start={0} end={count} duration={0.8} separator=" " />
      </div>
      <div className="flex items-center text-sm">
        <div
          className={`p-1 rounded-sm ${
            isIncrease ? "bg-red-100" : "bg-green-100"
          } transition-all duration-500`}
        >
          {isIncrease ? (
            <ArrowUp size={16} className="text-red-500" />
          ) : (
            <ArrowDown size={16} className="text-green-500" />
          )}
        </div>
        <span
          className={`ml-1 ${
            isIncrease ? "text-red-500" : "text-green-500"
          } transition-colors duration-500`}
        >
          <span className="font-extrabold text-base">{absChange}%</span>
          <span className="text-black">
            {" "}
            {isIncrease ? "de plus" : "de moins"} par rapport à hier
          </span>
        </span>
      </div>
    </div>
  );
};

IncidentCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  change: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  rectColor: PropTypes.string.isRequired,
  isIncrease: PropTypes.bool.isRequired,
};

// ---------- COMPOSANT PRINCIPAL ----------
const IncidentDashboard = ({ filter }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getAllKpi();
      setDashboardData(data.dashboard);
    } catch (error) {
      console.error("Erreur lors de la récupération des données du tableau de bord :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!dashboardData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_CATEGORIES.map((cat) => (
          <IncidentCardSkeleton key={cat} />
        ))}
      </div>
    );
  }

  const incidents = getIncidentsData(filter, dashboardData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {incidents.map((incident) => (
        <IncidentCard key={incident.title} {...incident} />
      ))}
    </div>
  );
};

IncidentDashboard.propTypes = {
  filter: PropTypes.string.isRequired,
};

export default IncidentDashboard;
