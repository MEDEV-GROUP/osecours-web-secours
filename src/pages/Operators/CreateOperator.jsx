import CreateOperatorForm from '../../components/terrain/CreateOperatorForm' // Ajustez le chemin si nécessaire

export default function CreateMemberPage() {
  return (
    <div className="flex bg-[#f5f6fa] p-6 pt-10">
      {/* Section de gauche */}
      <div className="w-1/3 pr-24 flex flex-col justify-start">
        <h1 className="text-3xl font-black text-[#FF3333] mb-4">Créer un nouvel <br /> opérateur terrain</h1>
        <p className="text-gray-600">
          Ce compte permettra à l’opérateur de pouvoir accéder à l’application sur le terrain
        </p>
      </div>

      {/* Formulaire à droite */}
      <div className="w-2/3">
        <CreateOperatorForm />
      </div>
    </div>
  )
}
