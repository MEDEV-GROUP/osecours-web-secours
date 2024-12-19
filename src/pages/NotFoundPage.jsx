
import { Link } from "react-router-dom";
import errorImage from "../assets/sidebar/bobo.png"; // Remplacez par le chemin de votre image

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-8">
      {/* Colonne gauche - Image */}
      <div className="w-1/2 flex justify-end mr-20">
        <img
         src={errorImage}
          alt="404 Not Found"
          className="max-w-full h-auto" // Ajuste la taille automatiquement
        />
      </div>

      {/* Colonne droite - Texte et bouton */}
      <div className="w-1/2 flex flex-col items-start justify-center p-8 text-left">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">Oops!</h1>
        <p className="text-lg text-gray-500 mb-6">
            Nous ne trouvons pas la page que vous recherchiez.
        </p>
        <Link
          to="/tableau-de-bord"
          className="flex items-center px-6 py-3 bg-[#ff3333] text-white rounded-md hover:bg-[#ff3321] transition"
        >
          <span className="mr-2">←</span> Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
