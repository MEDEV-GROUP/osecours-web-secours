const Helpers = () => {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Terrain de Secours</h1>
        
        {/* Operations List */}
        <div>
          <h2 className="text-xl font-bold">Interventions en cours</h2>
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Incident</th>
                <th className="border border-gray-300 p-2">Statut</th>
                <th className="border border-gray-300 p-2">Ressources Assignées</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">#12345</td>
                <td className="border border-gray-300 p-2 text-green-500">En cours</td>
                <td className="border border-gray-300 p-2">Équipe Alpha</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">#12346</td>
                <td className="border border-gray-300 p-2 text-yellow-500">En attente</td>
                <td className="border border-gray-300 p-2">Équipe Bravo</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        {/* Communication Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">Communication</h2>
          <div className="h-48 bg-gray-100 rounded p-4">
            <p className="text-gray-500">Chat en temps réel (à intégrer)</p>
          </div>
        </div>
  
        {/* Resource Management */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">Ressources Disponibles</h2>
          <ul className="list-disc pl-6">
            <li>Équipe Alpha : Disponible</li>
            <li>Équipe Bravo : En intervention</li>
            <li>Véhicule 1 : En route</li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default Helpers;