import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  LayersControl,
  Popup,
  Polyline
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import AlertMediaViewer from '../components/AlertMediaViewer';

const BASE_URL = "http://46.202.170.228:3000";

// Statuts d'intervention
const INTERVENTION_STATUS = {
  EN_ROUTE: { id: 'EN_ROUTE', label: 'En route', color: '#FFA500' },
  SUR_PLACE: { id: 'SUR_PLACE', label: 'Sur place', color: '#32CD32' },
  EN_COURS: { id: 'EN_COURS', label: 'En cours d\'intervention', color: '#1E90FF' },
  TERMINE: { id: 'TERMINE', label: 'Intervention terminée', color: '#4A4A4A' }
};

// Couleur selon la catégorie
const getColorByType = (type) => {
  switch (type) {
    case "Accidents":
      return "#FF3333";
    case "Incendies":
      return "#F1C01F";
    case "Inondations":
      return "#189FFF";
    case "Noyade":
      return "#43BE33";
    case "Malaises":
      return "#FF6933";
    case "Autre":
      return "#717171";
    default:
      return "#717171";
  }
};

// Émojis de catégorie
const categoryEmojis = {
  Accidents: "🚗",
  Incendies: "🔥",
  Inondations: "🌊",
  Noyade: "🚤",
  Malaises: "🤕",
  Autre: "⚠️",
};

// Correction icônes Leaflet
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Fonction pour générer une icône avec émoji
const getIcon = (type) => {
  return L.divIcon({
    html: `<div style="
      font-size: 24px;
      text-align: center;
      line-height: 24px;
    ">${categoryEmojis[type] || "❓"}</div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Icône spécifique pour l'équipe de secours
const rescueIcon = L.divIcon({
  html: `<div style="
    font-size: 28px;
    color: #d90429;
    text-align: center;
    line-height: 28px;
  ">🚑</div>`,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Fonction pour formater la distance
const formatDistance = (distanceInMeters) => {
  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(distanceInMeters)} m`;
};

// Composant pour l'historique des positions
const PathHistory = ({ positions }) => {
  if (!positions || positions.length < 2) return null;

  return (
    <Polyline
      positions={positions}
      color="#FF0000"
      weight={2}
      opacity={0.5}
      dashArray="5, 10"
    />
  );
};

// Composant pour le temps estimé d'arrivée
const EstimatedArrival = ({ distance, speed = 40 }) => {
  const timeInHours = distance / 1000 / speed;
  const timeInMinutes = Math.round(timeInHours * 60);

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '8px',
      borderRadius: '4px',
      marginTop: '8px'
    }}>
      <strong>Temps estimé:</strong> {timeInMinutes} minutes
    </div>
  );
};

// Composant pour recentrer la carte
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
}

// URLs pour Google Maps
const googleRoads = "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
const googleSatellite = "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
const googleHybrid = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";

const { BaseLayer } = LayersControl;

// Composant principal FollowTeamMap
export default function FollowTeamMap() {
  const { alertId } = useParams();
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescuePosition, setRescuePosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [interventionStatus, setInterventionStatus] = useState(INTERVENTION_STATUS.EN_ROUTE);
  const [messages, setMessages] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(false);

  const categories = [
    "Accidents",
    "Incendies",
    "Inondations",
    "Noyade",
    "Malaises",
    "Autre",
  ];

  // Effet pour le style du body
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.margin = null;
      document.body.style.padding = null;
      document.body.style.overflow = null;
    };
  }, []);

  // Demande de permission pour les notifications
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission === "granted");
      });
    }
  }, []);

  // Fonction pour envoyer une notification
  const sendNotification = (title, body) => {
    if (notificationPermission) {
      new Notification(title, { body });
    }
  };

  // Récupération des données de l'alerte
  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${BASE_URL}/admin/all-alerts`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'alerte');
        }

        const result = await response.json();
        
        if (result.data && Array.isArray(result.data.data)) {
          const alert = result.data.data.find(a => a.id === alertId);
          
          if (alert) {
            const formattedAlert = {
              id: alert.id,
              type: alert.category,
              lat: parseFloat(alert.location_lat),
              lon: parseFloat(alert.location_lng),
              description: alert.description,
              alerteurName: `${alert.reporter.first_name} ${alert.reporter.last_name}`,
              numero: alert.reporter.phone_number,
              heureEmission: new Date(alert.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              media: alert.media,
              imageAlerteur: alert.reporter.photos.length > 0
                ? `${BASE_URL}/${alert.reporter.photos[0].photo_url}`
                : "https://via.placeholder.com/100x100",
            };
            setAlertData(formattedAlert);
            setActiveCategory(alert.category);
          } else {
            setError('Alerte non trouvée');
          }
        }
      } catch (err) {
        console.error('Erreur détaillée:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (alertId) {
      fetchAlertData();
    }
  }, [alertId]);

  // Mise à jour de l'historique des positions
  useEffect(() => {
    if (rescuePosition && alertData) {
      setPathHistory(prev => [...prev, [rescuePosition.lat, rescuePosition.lon]]);

      const distance = L.latLng(rescuePosition.lat, rescuePosition.lon)
        .distanceTo(L.latLng(alertData.lat, alertData.lon));

      if (distance < 100 && interventionStatus.id === 'EN_ROUTE') {
        sendNotification(
          "Proche de la destination",
          "L'équipe de secours est à moins de 100m de l'alerte"
        );
        setInterventionStatus(INTERVENTION_STATUS.SUR_PLACE);
        addMessage("L'équipe est arrivée sur place", "SYSTEM");
      }
    }
  }, [rescuePosition]);

  // Simulation de la position de l'équipe de secours
  useEffect(() => {
    if (alertData) {
      const updateRescuePosition = () => {
        setRescuePosition({
          lat: alertData.lat + (Math.random() - 0.5) * 0.002,
          lon: alertData.lon + (Math.random() - 0.5) * 0.002
        });
      };

      updateRescuePosition();
      const interval = setInterval(updateRescuePosition, 5000);

      return () => clearInterval(interval);
    }
  }, [alertData]);

  // Fonction pour ajouter un message
  const addMessage = (content, type = 'TEXT') => {
    const newMessage = {
      id: Date.now(),
      content,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Interface de communication
  const CommunicationPanel = () => (
    <div style={{
      position: 'absolute',
      left: '16px',
      top: '95px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      zIndex: 1000,
      width: '361px',
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1A1919' }}>Communication avec l'équipe</h3>
      
      <div style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => {
            setInterventionStatus(INTERVENTION_STATUS.EN_COURS);
            addMessage("Début de l'intervention", "SYSTEM");
          }}
          style={{
            backgroundColor: INTERVENTION_STATUS.EN_COURS.color,
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            flex: 1,
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Début intervention
        </button>
        <button
          onClick={() => {
            setInterventionStatus(INTERVENTION_STATUS.TERMINE);
            addMessage("Intervention terminée", "SYSTEM");
          }}
          style={{
            backgroundColor: INTERVENTION_STATUS.TERMINE.color,
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            flex: 1,
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Terminer
        </button>
      </div>

      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        marginBottom: '15px',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            padding: '8px',
            backgroundColor: msg.type === 'SYSTEM' ? '#e3f2fd' : 'white',
            marginBottom: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '11px', color: '#666' }}>{msg.timestamp}</div>
            <div style={{ marginTop: '4px' }}>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Écrire un message..."
          onKeyPress={e => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              addMessage(e.target.value);
              e.target.value = '';
            }
          }}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '12px'
          }}
        />
        <button
          onClick={() => addMessage('Photo envoyée', 'PHOTO')}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📷
        </button>
      </div>
    </div>
  );

  const center = alertData
    ? [alertData.lat, alertData.lon]
    : [5.347, -4.024];

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}>
        <div>Chargement de l'alerte...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "10px", color: "#FF3333" }}>
          Erreur: {error}
        </div>
        <div>
          AlertID: {alertId}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Barre de recherche */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          backgroundColor: "white",
          padding: "8px 16px",
          borderRadius: "99px",
          boxShadow: "3px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          width: "361px",
          height: "61px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "8px", fontSize: "16px" }}>🔍</span>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "14px",
          }}
        />
      </div>

      {/* Panel de communication */}
      <CommunicationPanel />

      {/* Barre des catégories */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "60%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 1000,
          overflowX: "auto",
          maxWidth: "80vw",
          padding: "0 10px",
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: isActive ? getColorByType(cat) : "rgba(122, 120, 120, 0.70)",
                color: "white",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                width: "111px",
                height: "61px",
                boxShadow: "3px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "20px", lineHeight: "1" }}>{categoryEmojis[cat]}</span>
              <span style={{ fontSize: "12px", lineHeight: "1" }}>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={30}
        style={{ height: "92%", width: "100%" }}
        zoomControl={false}
      >
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

        <RecenterMap center={center} zoom={14} />

        {/* Tracé du chemin actuel */}
        {alertData && rescuePosition && (
          <Polyline
            positions={[
              [alertData.lat, alertData.lon],
              [rescuePosition.lat, rescuePosition.lon]
            ]}
            color="blue"
            weight={3}
          />
        )}

        {/* Historique des positions */}
        <PathHistory positions={pathHistory} />

        {/* Marqueur de l'alerte */}
        {alertData && (
          <Marker
            position={[alertData.lat, alertData.lon]}
            icon={getIcon(alertData.type)}
          >
            <Popup>
              <div>
                <div
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    marginTop: "20px",
                    marginBottom: "12px",
                  }}
                >
                  <AlertMediaViewer media={alertData.media} BASE_URL={BASE_URL} />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                  }}
                >
                  <button
                    style={{
                      background: getColorByType(alertData.type),
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#FFFFFF",
                      }}
                    >
                      {alertData.type}
                    </span>
                  </button>
                </div>

                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <img
                    src={alertData.imageAlerteur}
                    alt="Alerteur"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "9999px",
                      marginRight: "8px",
                      marginTop: "5px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "11px",
                      color: "black",
                      lineHeight: "1.4",
                      marginTop: "5px",
                    }}
                  >
                    <strong>Nom de l'alerteur :</strong> {alertData.alerteurName}
                    <br />
                    <strong>Description :</strong> {alertData.description}
                    <br />
                    <strong>Numéro :</strong> {alertData.numero}
                    <br />
                    <strong>Heure d'émission :</strong> {alertData.heureEmission}
                    <br />
                    {rescuePosition && (
                      <>
                        <strong>Distance :</strong> {
                          formatDistance(
                            L.latLng(rescuePosition.lat, rescuePosition.lon)
                              .distanceTo(L.latLng(alertData.lat, alertData.lon))
                          )
                        }
                        <EstimatedArrival
                          distance={L.latLng(rescuePosition.lat, rescuePosition.lon)
                            .distanceTo(L.latLng(alertData.lat, alertData.lon))}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marqueur de l'équipe de secours */}
        {rescuePosition && (
          <Marker
            position={[rescuePosition.lat, rescuePosition.lon]}
            icon={rescueIcon}
          >
            <Popup>
              <div style={{ fontSize: "14px" }}>
                <div>Équipe de secours</div>
                {alertData && (
                  <div>
                    Distance de l'alerte: {
                      formatDistance(
                        L.latLng(rescuePosition.lat, rescuePosition.lon)
                          .distanceTo(L.latLng(alertData.lat, alertData.lon))
                      )
                    }
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Indicateur de statut */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '70px',
        backgroundColor: interventionStatus.color,
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        {interventionStatus.label}
      </div>
    </div>
  );
}