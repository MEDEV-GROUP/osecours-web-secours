import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const logoutMessage = new URLSearchParams(location.search).get('logout');

  // Rediriger si déjà authentifié
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Validation avancée de l'email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Vérification des champs vides
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Vérification du format de l'email
    if (!isValidEmail(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    // Démarrer le spinner
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-red-50">
      {/* Section gauche avec l'image, cachée sur petits écrans */}
      <div className="hidden sm:flex w-1/2 h-full bg-red-50 items-center justify-center">
        <img
          src="http://s-p5.com/edgar/pk-1.png"
          alt="Illustration"
          className="w-[512px] h-[580px] rounded-3xl object-cover ml-4"
        />
      </div>

      {/* Section droite avec le formulaire */}
      <div className="w-full sm:w-1/2 h-full flex flex-col justify-center items-start px-16 bg-red-50 mr-4">
        {/* Titre */}
        <h1 className="text-4xl font-black text-gray-800 mb-4">Bienvenue 👋🏼</h1>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-8">
          Saisissez votre adresse électronique et votre mot de passe pour
          accéder à votre compte.
        </p>

        {/* Afficher le message d'erreur */}
        {error && (
          <div className="mb-4 p-2 text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* Champ Email */}
        <div className="relative w-full mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            {/* Icône SVG Email */}
            <img
              src="Vector.svg"
              alt="Email Icon"
              className="absolute w-5 h-5 top-3.5 right-3 text-gray-400 items-center justify-center"
            />
            <input
              type="email"
              placeholder="Entrer votre email"
              value={email} // Liaison avec l'état
              onChange={(e) => setEmail(e.target.value)} // Mise à jour de l'état
              className="w-full pr-10 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Champ Mot de Passe */}
        <div className="relative w-full mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type="password" // Basculer entre text et password
              placeholder="Entrer votre mot de passe"
              value={password} // Liaison avec l'état
              onChange={(e) => setPassword(e.target.value)} // Mise à jour de l'état
              className="w-full pr-10 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {/* Icône pour afficher/masquer le mot de passe */}
            <img
              src="Group.svg"
              alt="Password Icon"
              className="absolute w-5 h-5 top-3.5 right-3 text-gray-400 items-center justify-center cursor-pointer"
              // Ajoutez une fonction pour afficher/masquer le mot de passe si nécessaire
            />
          </div>
        </div>

        {/* Checkbox "Se souvenir de moi" */}
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            className="w-4 h-4 border border-gray-400 rounded focus:ring-2 focus:ring-red-500"
            checked={rememberMe} // Gérer l'état de la case
            onChange={() => setRememberMe(!rememberMe)} // Mettre à jour l'état
          />
          <label className="text-sm text-gray-700">Se souvenir de moi</label>
        </div>

        {/* Bouton de connexion avec spinner */}
        <button
          className="w-full py-3 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 flex justify-center items-center"
          onClick={handleLogin}
          disabled={loading} // Désactiver le bouton pendant le chargement
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            "Se connecter"
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
