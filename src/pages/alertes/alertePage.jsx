import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { getAllMessages } from '../../api/alertes/alerteApi';
import { useNavigate } from 'react-router-dom';

export default function AlertTable() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const messages = await getAllMessages();
        console.log("Messages reçus:", messages);
        setAlerts(messages);
      } catch (err) {
        setError("Erreur lors de la récupération des alertes.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getLevelStyle = (level) => {
    switch (level) {
      case "Très importante":
        return { textColor: "text-red-500", bgColor: "bg-red-500" };
      case "Importante":
        return { textColor: "text-orange-500", bgColor: "bg-orange-500" };
      case "Moins importante":
        return { textColor: "text-green-500", bgColor: "bg-green-500" };
      default:
        return { textColor: "text-gray-500", bgColor: "bg-gray-500" };
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Date invalide";
    try {
      const date = new Date(dateString);
      const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("fr-FR", options).replace(/(\d+) (\w+) (\d+),/, "$1 $2, $3 -");
    } catch (error) {
      console.error("Erreur de formatage de la date :", error);
      return "Date invalide";
    }
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Nos Alertes émises</h1>
        <Button
          className="bg-[#FF3333] hover:bg-black text-white"
          onClick={() => navigate("/alertes-emises/creer-une-alerte")}
        >
          Créer une nouvelle alerte
        </Button>
      </div>
      <div className="border rounded-xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Nom de l&apos;alerte</TableHead>
              <TableHead className="font-bold">Détails de l&apos;alerte</TableHead>
              <TableHead className="font-bold">Niveau de l&apos;alerte</TableHead>
              <TableHead className="font-bold">Date et heure programmées</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 5 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex} className="h-12">
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : alerts && alerts.length > 0 ? (
              alerts.map((alert) => {
                const { textColor, bgColor } = getLevelStyle(alert.level || "");
                return (
                  <TableRow key={alert.id}>
                    <TableCell>{formatDateTime(alert.createdAt)}</TableCell>
                    <TableCell>{alert.title}</TableCell>
                    <TableCell>{alert.content}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${bgColor}`}></div>
                        <span className={textColor}>{alert.level || "Non défini"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {alert.scheduleAt ? formatDateTime(alert.scheduleAt) : "Non programmé"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Aucune alerte disponible.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
