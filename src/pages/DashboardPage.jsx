import PropTypes from 'prop-types';
import useRequireAuth from '../hooks/useRequireAuth';

const DashboardPage = () => {
  useRequireAuth();
  return (
    <div className="bg-gray-100 flex h-full">
      {/* Main Content Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header Section */}
        <h1 className="text-xl font-bold">Tableau de bord</h1>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Cards Section */}
          <DashboardCard
            title="Accidents"
            count={12}
            percentage="40% de plus par rapport à hier"
            bgColor="bg-white"
          />
          <DashboardCard
            title="Incendies"
            count={15}
            percentage="22% de plus par rapport à hier"
            bgColor="bg-yellow-100"
          />
          <DashboardCard
            title="Inondations"
            count={0}
            percentage="00% par rapport à hier"
            bgColor="bg-blue-100"
          />
          <DashboardCard
            title="Malaises"
            count={23}
            percentage="20% de moins par rapport à hier"
            bgColor="bg-orange-100"
          />
          <DashboardCard
            title="Noyades"
            count={5}
            percentage="05% de plus par rapport à hier"
            bgColor="bg-green-100"
          />
          <DashboardCard
            title="Autres"
            count={18}
            percentage="10% de plus par rapport à hier"
            bgColor="bg-gray-100"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h2 className="font-bold mb-4">La commune avec le plus de sinistres</h2>
          <div className="h-64">
            {/* Placeholder for chart */}
            <div className="w-full h-full bg-gray-200 flex justify-center items-center">
              <span className="text-gray-500">Graphique ici</span>
            </div>
          </div>
        </div>

        {/* Last Alert Section */}
        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h2 className="font-bold mb-4">Dernière alerte reçue</h2>
          <div className="flex flex-col md:flex-row">
            <img
              src="https://via.placeholder.com/386x319"
              alt="Dernière alerte"
              className="w-full md:w-1/3 rounded-lg"
            />
            <div className="md:ml-6 mt-4 md:mt-0 flex flex-col justify-between">
              <div>
                <p className="font-bold">
                  Type d&apos;alerte: <span className="font-normal">Incendie</span>
                </p>
                <p className="font-bold">
                  Localisation: <span className="font-normal">Marché Port Bouet</span>
                </p>
                <p className="font-bold">
                  Heure émission: <span className="font-normal">16 h 34 min</span>
                </p>
                <p className="font-bold">
                  Alerteur: <span className="font-normal">Christian Koré</span>
                </p>
              </div>
              <button className="bg-red-500 text-white rounded-lg px-4 py-2 mt-4 md:mt-0">
                Traitez la demande
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// DashboardCard Component
const DashboardCard = ({ title, count, percentage, bgColor }) => {
  return (
    <div className={`p-4 rounded-lg shadow ${bgColor}`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-2xl font-bold mt-2">{count}</p>
      <p className="text-sm text-gray-600 mt-1">{percentage}</p>
    </div>
  );
};

// Ajout de la validation des props
DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  percentage: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default DashboardPage;
