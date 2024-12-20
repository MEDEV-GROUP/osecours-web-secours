import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { getAllMessages } from '../../api/alertes/alerteApi';
import { useNavigate } from 'react-router-dom';

export default function AlertTable() {
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      return date.toLocaleDateString("en-US", options).replace(/(\d+) (\w+) (\d+),/, "$1 $2, $3 -");
    } catch (error) {
      console.error("Erreur de formatage de la date :", error);
      return "Date invalide";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Filter alerts by exact date and level
  const filteredAlerts = alerts.filter((alert) => {
    const alertDate = formatDate(alert.createdAt);

    if (selectedDate && alertDate !== selectedDate) return false;
    if (selectedLevel !== "all" && alert.level !== selectedLevel) return false;

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAlerts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

      {/* Filters */}
      <div className="mb-6 flex justify-end items-center gap-4">
        <span>
          Filtre : 
        </span>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Sélectionner une date"
          className="w-auto"
        />
        <Select onValueChange={(val) => setSelectedLevel(val)}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Niveau d'alerte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="Très importante">Très importante</SelectItem>
            <SelectItem value="Importante">Importante</SelectItem>
            <SelectItem value="Moins importante">Moins importante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Nom de l&apos;alerte</TableHead>
              <TableHead className="font-bold">Détails de l&apos;alerte</TableHead>
              <TableHead className="font-bold">Niveau de l&apos;alerte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 4 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex} className="h-12">
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : currentItems && currentItems.length > 0 ? (
              currentItems.map((alert) => {
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
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Aucune alerte disponible.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="border rounded px-4 py-2"
            >
              Précédent
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                className={`border rounded px-4 py-2 ${
                  currentPage === index + 1 ? "bg-red-500 text-white" : "bg-white text-black"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {String(index + 1).padStart(2, '0')}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="border rounded px-4 py-2"
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
