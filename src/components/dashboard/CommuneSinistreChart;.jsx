// CommuneSinistreChart.jsx

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const data = [
  { month: "Jan", Cocody: 65, Yopougon: 65, Abobo: 65 },
  { month: "Fev", Cocody: 48, Yopougon: 50, Abobo: 50 },
  { month: "Mar", Cocody: 40, Yopougon: 40, Abobo: 40 },
  { month: "Avr", Cocody: 28, Yopougon: 30, Abobo: 30 },
  { month: "Mai", Cocody: 20, Yopougon: 20, Abobo: 20 },
  { month: "Jun", Cocody: 55, Yopougon: 58, Abobo: 58 },
  { month: "Jul", Cocody: 45, Yopougon: 48, Abobo: 48 },
  { month: "Aout", Cocody: 32, Yopougon: 35, Abobo: 35 },
  { month: "Sep", Cocody: 68, Yopougon: 70, Abobo: 70 },
  { month: "Oct", Cocody: 52, Yopougon: 52, Abobo: 52 },
  { month: "Nov", Cocody: 25, Yopougon: 25, Abobo: 25 },
  { month: "Dec", Cocody: 62, Yopougon: 60, Abobo: 60 }
];

const CommuneSinistreChart = () => {
  const [selectedCommunes, setSelectedCommunes] = useState({
    Cocody: true,
    Yopougon: false,
    Abobo: false
  });

  const toggleCommune = (commune) => {
    // Désactiver toutes les autres communes et activer celle sélectionnée
    setSelectedCommunes((prev) => {
      return {
        Cocody: false,
        Yopougon: false,
        Abobo: false,
        [commune]: !prev[commune]
      };
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-5xl">
      <div className="mb-6">
        <h2 className="text-lg mb-4">La commune avec le plus de sinistre</h2>
        <div className="flex gap-4">
          <button
            onClick={() => toggleCommune("Cocody")}
            className={`px-3 py-1 rounded-full flex items-center gap-2 ${
              selectedCommunes.Cocody
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                selectedCommunes.Cocody ? "bg-red-500" : "bg-gray-300"
              }`}
            />
            Cocody
          </button>
          <button
            onClick={() => toggleCommune("Yopougon")}
            className={`px-3 py-1 rounded-full flex items-center gap-2 ${
              selectedCommunes.Yopougon
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                selectedCommunes.Yopougon ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
            Yopougon
          </button>
          <button
            onClick={() => toggleCommune("Abobo")}
            className={`px-3 py-1 rounded-full flex items-center gap-2 ${
              selectedCommunes.Abobo
                ? "bg-teal-100 text-teal-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                selectedCommunes.Abobo ? "bg-teal-500" : "bg-gray-300"
              }`}
            />
            Abobo
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
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
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
            />
            {selectedCommunes.Cocody && (
              <Bar dataKey="Cocody" fill="#EF4444" radius={[4, 4, 0, 0]} />
            )}
            {selectedCommunes.Yopougon && (
              <Bar dataKey="Yopougon" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            )}
            {selectedCommunes.Abobo && (
              <Bar dataKey="Abobo" fill="#14B8A6" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommuneSinistreChart;
