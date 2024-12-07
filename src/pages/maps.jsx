import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix des icônes de Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const Maps = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/*   <header className="p-4 bg-white shadow">
        <h1 className="text-2xl font-bold">Carte Interactive</h1>
      </header> */}
    <div className="pb-10">

    </div>

      {/* Carte Interactive */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <MapContainer
            center={[5.347, -4.024]} // Coordonnées par défaut (Ex: Abidjan, Côte d'Ivoire)
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Exemple de Marker */}
            <Marker position={[5.347, -4.024]}>
              <Popup>
                Localisation par défaut : Abidjan <br /> Coordonnées : [5.347, -4.024].
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Section Filtres */}
        <section className="p-4 bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Filtres</h2>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Incidents</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">Équipes</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded">Zones à risque</button>
          </div>
        </section>

        {/* Détails des Incidents */}
        <section className="p-4 bg-white">
          <h2 className="text-xl font-bold mb-2">Détails des Incidents</h2>
          <ul className="list-disc pl-6">
            <li>Incident #12345 : Feu de forêt - Localisé à [Coordonnées]</li>
            <li>Incident #12346 : Accident de voiture - Localisé à [Coordonnées]</li>
            <li>Incident #12347 : Évacuation en cours - Localisé à [Coordonnées]</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Maps;