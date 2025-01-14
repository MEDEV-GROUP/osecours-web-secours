import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import AlertMediaViewer from '../components/AlertMediaViewer';

const BASE_URL = "http://46.202.170.228:3000";

// Fonction pour formater la distance
const formatDistance = (distanceInMeters) => {
  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(distanceInMeters)} m`;
};

// Composant pour la géolocalisation
const LocationMarker = ({ setPosition }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 13,
      enableHighAccuracy: true
    });

    map.on('locationfound', (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.setView(e.latlng, 13);
    });

    map.on('locationerror', (e) => {
      console.error("Erreur de géolocalisation:", e);
      setPosition([5.347, -4.024]); // Position par défaut
    });

    return () => {
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map, setPosition]);

  return null;
};

// Fonction pour vérifier si une date est dans les dernières 24h
const isWithinLast24Hours = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

// Configuration des icônes Leaflet
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const MemberSelectionPopup = ({ members, selectedMember, onSelect, onSend, alertId, isLoading, isLoadingMembers }) => (
  <div className="p-5 w-[1000px] max-w-full">
    <h3 className="text-lg font-bold mb-4">Sélectionner une équipe de secours</h3>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3"></th>
            <th className="p-3 text-left">Photo</th>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Prénom</th>
            <th className="p-3 text-left">Téléphone</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr 
              key={member.id}
              className={`border-b cursor-pointer hover:bg-gray-50 ${
                selectedMember?.id === member.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => onSelect(member)}
            >
              <td className="p-3">
                <input 
                  type="checkbox" 
                  checked={selectedMember?.id === member.id}
                  readOnly
                />
              </td>
              <td className="p-3">
                <img
                  src={`${BASE_URL}/${member.user.photo}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="p-3">{member.user.lastName}</td>
              <td className="p-3">{member.user.firstName}</td>
              <td className="p-3">{member.user.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <button
      onClick={() => onSend(alertId)}
      disabled={!selectedMember || isLoading}
      className={`w-full flex justify-center items-center px-4 py-3 mt-4 rounded-lg text-white
        ${!selectedMember || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1A1919] cursor-pointer'}`}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : "Envoyer l'équipe sélectionnée"}
    </button>
  </div>
);

// Fonction pour calculer les bounds
const getBounds = (alerts) => {
  if (!alerts || alerts.length === 0) return null;
  
  let minLat = alerts[0].lat;
  let maxLat = alerts[0].lat;
  let minLon = alerts[0].lon;
  let maxLon = alerts[0].lon;
  
  alerts.forEach(alert => {
    minLat = Math.min(minLat, alert.lat);
    maxLat = Math.max(maxLat, alert.lat);
    minLon = Math.min(minLon, alert.lon);
    maxLon = Math.max(maxLon, alert.lon);
  });
  
  const latMargin = (maxLat - minLat) * 0.1;
  const lonMargin = (maxLon - minLon) * 0.1;
  
  return [
    [minLat - latMargin, minLon - lonMargin],
    [maxLat + latMargin, maxLon + lonMargin]
  ];
};

// Composant pour recentrer la carte
const RecenterMap = ({ center, zoom, bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    } else if (center && zoom) {
      map.setView(center, zoom);
    } else if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, zoom, bounds, map]);
  
  return null;
};

// Composant Legend
const Legend = ({ filters, setFilters }) => (
  <div className="absolute top-24 left-4 bg-gray-800/70 p-4 rounded-lg shadow-lg z-[1000]">
    <ul className="list-none p-0 m-0">
      <li className="text-white mb-3 p-2 bg-[#0C8F8F]/50 rounded flex items-center">
        <input
          type="checkbox"
          checked={filters.Last24Hours}
          onChange={() => setFilters(prev => ({...prev, Last24Hours: !prev.Last24Hours}))}
          className="mr-2"
        />
        <div className="flex items-center">
          <span className="mr-2">🕒</span>
          Dernières 24h
        </div>
      </li>

      <li className="text-white mb-2 flex items-center">
        <input
          type="checkbox"
          checked={filters.All}
          onChange={() => {
            const newFilters = Object.keys(filters).reduce((acc, key) => {
              acc[key] = key === 'Last24Hours' ? filters.Last24Hours : !filters.All;
              return acc;
            }, {});
            setFilters(newFilters);
          }}
          className="mr-2"
        />
        <div className="flex items-center">
          Toutes les alertes
        </div>
      </li>

      {Object.entries(filters)
        .filter(([key]) => !['All', 'Last24Hours'].includes(key))
        .map(([key, value]) => (
          <li key={key} className="text-white mb-2 flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={() => setFilters(prev => ({...prev, [key]: !prev[key], All: false}))}
              className="mr-2"
            />
            <div className="flex items-center justify-between w-full">
              <span className="min-w-[100px] mr-2">{key}</span>
              <span className="text-base">
                {key === "Accidents" && "🚗"}
                {key === "Incendies" && "🔥"}
                {key === "Inondations" && "🌊"}
                {key === "Noyade" && "🚤"}
                {key === "Malaises" && "🤕"}
                {key === "Autre" && "⚠️"}
              </span>
            </div>
          </li>
        ))}
    </ul>
  </div>
);

// Composant SearchBar
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md w-80 h-[45px] z-[1000] flex items-center">
    <span className="text-base mr-2">🔍</span>
    <input
      type="text"
      placeholder="Rechercher une alerte par catégorie"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border-none outline-none w-full text-sm"
    />
  </div>
);

// Fonction pour obtenir la couleur selon le type
const getColorByType = (type) => {
  const colors = {
    Accidents: "#FF3333",
    Incendies: "#F1C01F",
    Inondations: "#189FFF",
    Noyade: "#43BE33",
    Malaises: "#FF6933",
    Autre: "#717171"
  };
  return colors[type] || "#717171";
};

// Fonction pour obtenir l'icône selon le type
const getIcon = (type) => {
  const emojiMap = {
    Accidents: "🚗",
    Incendies: "🔥",
    Inondations: "🌊",
    Noyade: "🚤",
    Malaises: "🤕",
    Autre: "⚠️"
  };

  return L.divIcon({
    html: `<div style="font-size: 24px; text-align: center; line-height: 24px;">
      ${emojiMap[type] || "❓"}
    </div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// URLs Google Maps
const googleRoads = "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
const googleSatellite = "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
const googleHybrid = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";

const { BaseLayer } = LayersControl;

// Composant principal App
const App = () => {
  const mapRef = useRef(null);
  const [position, setPosition] = useState([5.347, -4.024]);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({
    All: true,
    Last24Hours: true,
    Accidents: true,
    Incendies: true,
    Inondations: true,
    Noyade: true,
    Malaises: true,
    Autre: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState(position);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapBounds, setMapBounds] = useState(null);
  const [alertStates, setAlertStates] = useState({});
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [showMemberSelection, setShowMemberSelection] = useState(false);
  const navigate = useNavigate();

  // Récupération des alertes
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${BASE_URL}/admin/all-alerts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.data && Array.isArray(result.data.data)) {
          const formattedAlerts = result.data.data.map((alert) => ({
            id: alert.id,
            type: alert.category,
            lat: alert.location_lat,
            lon: alert.location_lng,
            description: alert.description,
            alerteurName: `${alert.reporter.first_name} ${alert.reporter.last_name}`,
            numero: alert.reporter.phone_number,
            heureEmission: alert.createdAt,
            heureEmissionFormatted: new Date(alert.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            media: alert.media,
            imageAlerteur: alert.reporter.photos.length > 0
              ? `${BASE_URL}/${alert.reporter.photos[0].photo_url}`
              : "https://via.placeholder.com/100x100",
          }));
          setAlerts(formattedAlerts);
        } else {
          console.error("Format de données inattendu:", result);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des alertes:", error);
      }
    };

    fetchAlerts();
  }, []);

  // Récupération des membres disponibles
  const fetchAvailableMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/admin/available-rescue-members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setAvailableMembers(result.data || []);
      } else {
        console.error("Erreur lors de la récupération des membres:", result);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Filtrage des alertes
  const filteredAlerts = alerts.filter((alert) => {
    if (filters.Last24Hours && !isWithinLast24Hours(alert.heureEmission)) {
      return false;
    }

    const typeLower = alert.type?.toLowerCase() ?? "";
    const queryLower = searchQuery.toLowerCase();

    if (!queryLower.trim()) {
      if (filters.All) {
        return true;
      } else {
        return !!filters[alert.type];
      }
    }

    if (filters.All) {
      return typeLower.includes(queryLower);
    } else {
      return !!filters[alert.type] && typeLower.includes(queryLower);
    }
  });

  // Mise à jour des bounds de la carte
  useEffect(() => {
    if (searchQuery.trim().length > 0 && filteredAlerts.length > 0) {
      if (filteredAlerts.length === 1) {
        setMapCenter([filteredAlerts[0].lat, filteredAlerts[0].lon]);
        setMapZoom(16);
        setMapBounds(null);
      } else {
        const bounds = getBounds(filteredAlerts);
        setMapBounds(bounds);
        setMapCenter(null);
        setMapZoom(null);
      }
    } else {
      setMapCenter(position);
      setMapZoom(13);
      setMapBounds(null);
    }
  }, [searchQuery, filteredAlerts, position]);

  // Gestion des actions sur les alertes
  const handleSendHelp = (alertId) => {
    setShowMemberSelection(true);
    fetchAvailableMembers();
  };

// Ajout d'un useEffect pour vérifier le localStorage au chargement
useEffect(() => {
  const savedAlertStates = localStorage.getItem('alertStates');
  if (savedAlertStates) {
    setAlertStates(JSON.parse(savedAlertStates));
  }
}, []);

// Modification de handleFinalSend
const handleFinalSend = (alertId) => {
  if (!selectedMember) return;
  
  const newAlertStates = {
    ...alertStates,
    [alertId]: { loading: true }
  };
  setAlertStates(newAlertStates);

  setTimeout(() => {
    const finalState = {
      ...alertStates,
      [alertId]: { loading: false, isBack: true }
    };
    setAlertStates(finalState);
    localStorage.setItem('alertStates', JSON.stringify(finalState));
    setShowMemberSelection(false);
    setSelectedMember(null);
  }, 2000);
};

  const handleFollowTeam = (alertId) => {
    navigate(`/maps/follow-team/${alertId}`);
  };

  return (
    <div className="h-full w-full relative">
      <Legend filters={filters} setFilters={setFilters} />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <MapContainer
        ref={mapRef}
        center={mapCenter || position}
        zoom={mapZoom}
        minZoom={1}
        maxZoom={200}
        className="h-full w-full"
      >
        <LocationMarker setPosition={setPosition} />
        
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={30}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </BaseLayer>

          <BaseLayer name="Google Roadmap">
            <TileLayer
              url={googleRoads}
              maxZoom={30}
              attribution='&copy; <a href="https://maps.google.com/">Google</a>'
            />
          </BaseLayer>

          <BaseLayer name="Google Satellite">
            <TileLayer
              url={googleSatellite}
              maxZoom={30}
              attribution='&copy; <a href="https://maps.google.com/">Google</a>'
            />
          </BaseLayer>

          <BaseLayer name="Google Hybrid">
            <TileLayer
              url={googleHybrid}
              maxZoom={30}
              attribution='&copy; <a href="https://maps.google.com/">Google</a>'
            />
          </BaseLayer>
        </LayersControl>

        <RecenterMap center={mapCenter} zoom={mapZoom} bounds={mapBounds} />

        {filteredAlerts.map((alert) => {
          const userLatLng = L.latLng(position[0], position[1]);
          const alertLatLng = L.latLng(alert.lat, alert.lon);
          const distance = userLatLng.distanceTo(alertLatLng);
          const alertColor = getColorByType(alert.type);
          const isBack = alertStates[alert.id]?.isBack || false;
          const isLoading = alertStates[alert.id]?.loading || false;

          return (
            <Marker
              key={alert.id}
              position={[alert.lat, alert.lon]}
              icon={getIcon(alert.type)}
            >
              <Popup>
                {!isBack ? (
                  showMemberSelection ? (
                    <MemberSelectionPopup
                      members={availableMembers}
                      selectedMember={selectedMember}
                      onSelect={setSelectedMember}
                      onSend={handleFinalSend}
                      alertId={alert.id}
                      isLoading={isLoading}
                      isLoadingMembers={isLoadingMembers}
                    />
                  ) : (
                    <div>
                      <div className="rounded-lg overflow-hidden mt-5 mb-3">
                        <AlertMediaViewer media={alert.media} BASE_URL={BASE_URL} />
                      </div>

                      <div className="flex items-center justify-between mb-3.5">
                        <button
                          style={{
                            background: alertColor,
                            padding: "8px 16px",
                            borderRadius: "8px",
                          }}
                        >
                          <span className="text-xs font-bold text-white">
                            {alert.type}
                          </span>
                        </button>
                      </div>

                      <div className="flex mb-3">
                        <img
                          src={alert.imageAlerteur}
                          alt="Alerteur"
                          className="w-[70px] h-[70px] rounded-full mr-2 mt-1.5 object-cover"
                        />
                        <div className="text-xs text-black leading-relaxed mt-1.5">
                          <strong>Nom de l'alerteur :</strong> {alert.alerteurName}<br />
                          <strong>Description :</strong> {alert.description}<br />
                          <strong>Numéro :</strong> {alert.numero}<br />
                          <strong>Heure d'émission :</strong> {alert.heureEmissionFormatted}<br />
                          <strong>Distance :</strong> {formatDistance(distance)}
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => handleSendHelp(alert.id)}
                          className="bg-[#1A1919] text-white text-base py-2 px-4 rounded-lg border-none cursor-pointer mt-2.5 flex justify-center items-center w-full"
                        >
                          Envoyer une équipe de secours
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-[250px] text-center">
                    <img
                      src="truck (1).png"
                      alt="Camion de pompiers"
                      className="w-full h-auto block mx-auto mb-4"
                    />
                    <p className="text-justify text-sm text-black mb-4">
                      Une équipe vient d'être envoyée sur le terrain
                    </p>
                    <button
                      onClick={() => handleFollowTeam(alert.id)}
                      className="bg-[#1A1919] text-white text-sm py-2 px-4 rounded-lg border-none cursor-pointer block w-full"
                    >
                      Suivre l'équipe sur la carte
                    </button>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }

          input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            background-color: #ffffff;
            border: 2px solid #0C8F8F;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-right: 8px;
            cursor: pointer;
            position: relative;
            vertical-align: middle;
          }

          input[type="checkbox"]:checked {
            background-color: #0C8F8F;
            border: 2px solid #0C8F8F;
          }

          input[type="checkbox"]:checked::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 6px;
            width: 3px;
            height: 8px;
            border: solid #ffffff;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        `}
      </style>
    </div>
  );
};

export default App;
