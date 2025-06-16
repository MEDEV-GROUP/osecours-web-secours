import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
import InterventionDetails from '../../components/interventions/InterventionDetails';
import { getInterventionById } from '../../api/interventions/interventionApi';

const InterventionDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [intervention, setIntervention] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIntervention = async () => {
            try {
                setLoading(true);
                const data = await getInterventionById(id);
                setIntervention(data);
            } catch (err) {
                console.error("Erreur lors du chargement de l'intervention:", err);
                setError(`Impossible de charger les détails de l'intervention: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIntervention();
        }
    }, [id]);

    const handleBack = () => {
        navigate('/interventions');
    };

    const handleViewOnMap = () => {
        if (intervention?.alert?.id) {
            navigate(`/maps/follow-team/${intervention.alert.id}`);
        }
    };

    return (
        <div className="p-6">
            {/* En-tête avec navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleBack}
                        className="mr-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold">Détails de l'intervention</h1>
                </div>

                {intervention?.alert?.id && (
                    <Button
                        onClick={handleViewOnMap}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <MapPin className="h-4 w-4 mr-2" />
                        Voir sur la carte
                    </Button>
                )}
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Contenu principal */}
            <InterventionDetails
                data={intervention}
                loading={loading}
            />
        </div>
    );
};

export default InterventionDetailsPage;