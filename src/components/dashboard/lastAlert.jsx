import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLatestAlerts } from "../../api/kpi/lastAlert-api";
import { API_BASE_URL } from "../../api/config";

const AlertCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-[300px] w-full">
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        
        <Skeleton className="w-full h-40 rounded-xl" />
          
        <div className="space-y-2">
          <div>
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <Skeleton className="w-full h-10 mt-4" />
      </div>
    </div>
  );
};

const AlertCard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLatestAlerts = async () => {
      try {
        const fetchedAlerts = await fetchLatestAlerts();
        setAlerts(fetchedAlerts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLatestAlerts();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 ">
        <AlertCardSkeleton />
        <AlertCardSkeleton />
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  if (alerts.length === 0) {
    return <div className="text-center">Aucune alerte disponible</div>;
  }

  return (
    <div className="flex gap-4 w-full">
      {alerts.map((alertItem) => {
        const mediaItem =
          alertItem.media && alertItem.media.length > 0
            ? alertItem.media[0]
            : null;

        return (
          <div
            key={alertItem.id}
            className="bg-white rounded-lg shadow-lg p-4 max-w-[300px] w-full"
          >
            <div className="space-y-3">
              <h2 className="text-lg font-semibold truncate">
                Alerte récente: {alertItem.category}
              </h2>

              {mediaItem?.media_type === "PHOTO" && (
                <div className="w-full h-40 rounded-xl overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/${mediaItem.media_url}`}
                    alt={`Alerte ${alertItem.category}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {mediaItem?.media_type === "VIDEO" && (
                <div className="w-full h-40 rounded-xl overflow-hidden">
                  <video
                    src={`${API_BASE_URL}/${mediaItem.media_url}`}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex gap-1 text-sm">
                  <span className="font-bold shrink-0">Localisation : </span>
                  <span className="truncate">{alertItem.address}</span>
                </div>
                <div className="flex gap-1 text-sm">
                  <span className="font-bold shrink-0">Description : </span>
                  <span className="truncate">{alertItem.description}</span>
                </div>
                <div className="flex gap-1 text-sm">
                  <span className="font-bold shrink-0">Alerteur : </span>
                  <span className="truncate">
                    {`${alertItem.reporter.firstName} ${alertItem.reporter.lastName}`}
                  </span>
                </div>
              </div>

              <Button variant="destructive" className="w-full py-2 text-sm mt-2">
                Traitez la demande
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertCard;   