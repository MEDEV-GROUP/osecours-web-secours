"use client";

import Stats1 from "/src/pages/stats/stats-1.jsx";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getBasicStats } from "../../api/kpi-reports/kpi-stats";

// Configuration des données pour le graphique
const chartConfig = {
  value: {
    label: "Value",
  },
  "Total Alerts": {
    label: "Total Alerts",
    color: "hsl(var(--chart-1))",
  },
  Interventions: {
    label: "Interventions",
    color: "hsl(var(--chart-2))",
  },
  "Intervention Rate (%)": {
    label: "Intervention Rate (%)",
    color: "hsl(var(--chart-3))",
  },
};

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function ReportPage() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBasicStats = async () => {
      try {
        setLoading(true);
        const stats = await getBasicStats();

        // Formater les données pour le graphique
        if (stats && stats.data) {
          const formattedData = [
            { stat: "Total Alerts", value: stats.data.totalAlerts },
            { stat: "Interventions", value: stats.data.totalInterventions },
            { stat: "Intervention Rate (%)", value: parseFloat(stats.data.interventionRate) },
          ];
          setChartData(formattedData);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des statistiques.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBasicStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement...</CardTitle>
          <CardDescription>Récupération des statistiques</CardDescription>
        </CardHeader>
        <CardContent>
          <SkeletonLoader />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (chartData.length === 0) {
    return <p>Aucune donnée disponible pour le moment.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Statistics</CardTitle>
        <CardDescription>Overview of alerts and interventions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{
              left: 0,
              top: 20,
              right: 20,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="stat"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                chartConfig[value]?.label
              }
            />
            <YAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" layout="horizontal" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up based on latest data <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Statistics fetched dynamically from the API.
        </div>
      </CardFooter>
      {/* Exemple d'inclusion du composant Stats1 */}
      <Stats1 />
    </Card>
  );
}
  