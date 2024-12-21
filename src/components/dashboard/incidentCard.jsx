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
  
  // ----- FONCTION QUI RETOURNE LES DONNÉES SELON LE FILTRE -----
  const getIncidentsData = (filter) => {
    // Exemple de données fictives :
    const dataJour = [
      {
        title: "Accidents",
        count: 2,
        change: 10,
        icon: Car,
        color: "bg-red-500",
        rectColor: "#ef4444",
      },
      {
        title: "Incendies",
        count: 1,
        change: 0,
        icon: Flame,
        color: "bg-yellow-500",
        rectColor: "#eab308",
      },
      {
        title: "Inondations",
        count: 0,
        change: 0,
        icon: Droplets,
        color: "bg-blue-500",
        rectColor: "#3b82f6",
      },
      {
        title: "Malaises",
        count: 3,
        change: 5,
        icon: Phone,
        color: "bg-orange-500",
        rectColor: "#f97316",
      },
      {
        title: "Noyades",
        count: 1,
        change: -10,
        icon: Droplets,
        color: "bg-green-500",
        rectColor: "#22c55e",
      },
      {
        title: "Autres",
        count: 2,
        change: 0,
        icon: MoreHorizontal,
        color: "bg-gray-500",
        rectColor: "#6b7280",
      },
    ];
  
    const dataSemaine = [
      {
        title: "Accidents",
        count: 12,
        change: 40,
        icon: Car,
        color: "bg-red-500",
        rectColor: "#ef4444",
      },
      {
        title: "Incendies",
        count: 15,
        change: 22,
        icon: Flame,
        color: "bg-yellow-500",
        rectColor: "#eab308",
      },
      {
        title: "Inondations",
        count: 5,
        change: 0,
        icon: Droplets,
        color: "bg-blue-500",
        rectColor: "#3b82f6",
      },
      {
        title: "Malaises",
        count: 23,
        change: -20,
        icon: Phone,
        color: "bg-orange-500",
        rectColor: "#f97316",
      },
      {
        title: "Noyades",
        count: 5,
        change: 5,
        icon: Droplets,
        color: "bg-green-500",
        rectColor: "#22c55e",
      },
      {
        title: "Autres",
        count: 18,
        change: 10,
        icon: MoreHorizontal,
        color: "bg-gray-500",
        rectColor: "#6b7280",
      },
    ];
  
    const dataMois = [
      {
        title: "Accidents",
        count: 50,
        change: -5,
        icon: Car,
        color: "bg-red-500",
        rectColor: "#ef4444",
      },
      {
        title: "Incendies",
        count: 92,
        change: 10,
        icon: Flame,
        color: "bg-yellow-500",
        rectColor: "#eab308",
      },
      {
        title: "Inondations",
        count: 15,
        change: -10,
        icon: Droplets,
        color: "bg-blue-500",
        rectColor: "#3b82f6",
      },
      {
        title: "Malaises",
        count: 300,
        change: 8,
        icon: Phone,
        color: "bg-orange-500",
        rectColor: "#f97316",
      },
      {
        title: "Noyades",
        count: 9,
        change: 5,
        icon: Droplets,
        color: "bg-green-500",
        rectColor: "#22c55e",
      },
      {
        title: "Autres",
        count: 20,
        change: 0,
        icon: MoreHorizontal,
        color: "bg-gray-500",
        rectColor: "#6b7280",
      },
    ];
  
    // Choix du tableau en fonction du filtre
    switch (filter) {
      case "jour":
        return dataJour;
      case "semaine":
        return dataSemaine;
      case "mois":
        return dataMois;
      default:
        return dataJour; // fallback
    }
  };
  
  // ----- COMPOSANT DE LA CARTE INDIVIDUELLE -----
  const IncidentCard = ({ title, count, change, icon: Icon, color, rectColor }) => {
    const isIncrease = change > 0;
    const absChange = Math.abs(change);
  
    return (
      <div className="relative bg-white rounded-lg p-8 shadow">
        {/* Petite bande colorée à gauche */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 rounded-r-full"
          style={{ backgroundColor: rectColor }}
        />
  
        {/* Entête (titre + icône) */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-black font-medium text-lg">{title}</span>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
        </div>
  
        {/* Nombre principal */}
        <div className="text-7xl font-bold mb-2" style={{ color: rectColor }}>
          {count.toString().padStart(2, "0")}
        </div>
  
        {/* Variation (flèche haut/bas) */}
        <div className="flex items-center text-sm">
          <div className={`bg-${isIncrease ? "red" : "green"}-100 p-1 rounded-sm`}>
            {isIncrease ? (
              <ArrowUp size={16} className="text-red-500" />
            ) : (
              <ArrowDown size={16} className="text-green-500" />
            )}
          </div>
          <span className={`ml-1 ${isIncrease ? "text-red-500" : "text-green-500"}`}>
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
  };
  
  // ----- COMPOSANT PRINCIPAL POUR AFFICHER TOUTES LES CARTES -----
  const IncidentDashboard = ({ filter }) => {
    // Récupère les données correspondantes
    const incidents = getIncidentsData(filter);
  
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.title} {...incident} />
          ))}
        </div>
      </div>
    );
  };
  
  IncidentDashboard.propTypes = {
    filter: PropTypes.string.isRequired,
  };
  
  export default IncidentDashboard;
  