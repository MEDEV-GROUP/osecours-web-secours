import CreateAlerteForm from "../../components/alertes/CreateAlerteForm"; 

export default function CreateAlertePage() {
  return (
    <div className="flex bg-[#f5f6fa] p-6 pt-10">
      {/* Section de gauche */}
      <div className="w-1/3 pr-24 flex flex-col justify-start">
        <h1 className="text-3xl font-black text-[#FF3333] mb-4">
          Créer une nouvelle <br /> alerte
        </h1>
        <p className="text-gray-600">
          Cette alerte permettra aux citoyns d&apos;être informé rapidement des
          événements
        </p>
      </div>

      {/* Formulaire à droite */}
      <div className="w-2/3">
        <CreateAlerteForm />
      </div>
    </div>
  );
}
