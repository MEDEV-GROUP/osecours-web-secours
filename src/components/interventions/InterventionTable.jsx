import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { getAllInterventions } from "../../api/interventions/interventionApi";

// Composant pour formater le statut de l'intervention
const StatusBadge = ({ status }) => {
    const statusConfig = {
        EN_ROUTE: { label: "En route", bgColor: "bg-blue-100 text-blue-800" },
        SUR_PLACE: { label: "Sur place", bgColor: "bg-green-100 text-green-800" },
        EN_COURS: { label: "En cours", bgColor: "bg-yellow-100 text-yellow-800" },
        TERMINE: { label: "Terminé", bgColor: "bg-gray-100 text-gray-800" }
    };

    const config = statusConfig[status] || { label: status, bgColor: "bg-gray-100 text-gray-800" };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor}`}>
            {config.label}
        </span>
    );
};

// Fonction pour formater une date
const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (error) {
        return "Date invalide";
    }
};

export default function InterventionTable() {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        total: 0
    });

    const navigate = useNavigate();

    // Fonction pour charger les interventions
    const loadInterventions = async (page = 1) => {
        try {
            setLoading(true);
            const data = await getAllInterventions(page, pagination.limit);
            setInterventions(data.interventions || []);
            setPagination({
                currentPage: data.pagination.page || 1,
                totalPages: data.pagination.totalPages || 1,
                limit: data.pagination.limit || 10,
                total: data.pagination.total || 0
            });
        } catch (err) {
            setError("Erreur lors de la récupération des interventions");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Chargement initial des données
    useEffect(() => {
        loadInterventions();
    }, []);

    // Fonction pour changer de page
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            loadInterventions(newPage);
        }
    };

    // Filtrer les interventions en fonction du terme de recherche
    const filteredInterventions = interventions.filter(intervention => {
        const searchLower = searchTerm.toLowerCase();
        return (
            intervention.alert?.category?.toLowerCase().includes(searchLower) ||
            intervention.alert?.address?.toLowerCase().includes(searchLower) ||
            intervention.rescueMember?.rescuer?.name?.toLowerCase().includes(searchLower) ||
            intervention.status?.toLowerCase().includes(searchLower)
        );
    });

    // Fonction pour voir les détails d'une intervention
    const handleViewDetails = (interventionId) => {
        navigate(`/interventions/${interventionId}`);
    };

    // Fonction pour suivre une intervention sur la carte
    const handleFollowIntervention = (alertId) => {
        navigate(`/maps/follow-team/${alertId}`);
    };

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            {/* En-tête avec titre et recherche */}
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <h1 className="text-3xl font-bold">Interventions</h1>
                <div className="w-full md:w-96">
                    <Input
                        type="text"
                        placeholder="Rechercher par catégorie, adresse, équipe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Tableau des interventions */}
            <div className="border rounded-xl overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="font-bold text-black">Date de début</TableHead>
                            <TableHead className="font-bold text-black">Catégorie</TableHead>
                            <TableHead className="font-bold text-black">Adresse</TableHead>
                            <TableHead className="font-bold text-black">Équipe</TableHead>
                            <TableHead className="font-bold text-black">Statut</TableHead>
                            <TableHead className="font-bold text-black text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Affichage du skeleton loader pendant le chargement
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                                        <TableCell key={cellIndex} className="h-12">
                                            <Skeleton className="h-4 w-3/4 mx-auto" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : filteredInterventions.length > 0 ? (
                            // Affichage des interventions
                            filteredInterventions.map((intervention) => (
                                <TableRow key={intervention.id} className="cursor-pointer hover:bg-gray-50">
                                    <TableCell>{formatDateTime(intervention.startTime)}</TableCell>
                                    <TableCell>
                                        <span className="font-medium">
                                            {intervention.alert?.category || "Non défini"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {intervention.alert?.address || "Adresse non disponible"}
                                    </TableCell>
                                    <TableCell>
                                        {intervention.rescueMember?.rescuer?.name || "Non assigné"}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={intervention.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(intervention.id)}
                                            >
                                                Détails
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleFollowIntervention(intervention.alert?.id)}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                Suivre
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            // Message si aucune intervention n'est trouvée
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Aucune intervention trouvée
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="flex justify-end mt-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                        >
                            Précédent
                        </Button>

                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === pagination.currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages}
                        >
                            Suivant
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}