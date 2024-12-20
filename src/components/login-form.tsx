import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  const location = useLocation();
  const logoutMessage = new URLSearchParams(location.search).get("logout");

  useEffect(() => {
    if (logoutMessage) {
      setFormError("Vous avez été déconnecté avec succès.");
    }
  }, [logoutMessage]);

  if (isAuthenticated) {
    return <Navigate to="/tableau-de-bord" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isValidEmail.test(email)) {
      setFormError("Veuillez entrer une adresse email valide.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      setFormError(error.message || "Une erreur inconnue est survenue.");
      console.error("Erreur lors de la connexion :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Decorative semi-circles */}
      

      <form
        className={cn("flex flex-col gap-6 relative z-10", className)}
        {...props}
        onSubmit={handleLogin}
      >
        <div className="flex flex-col items-start gap-2 text-left">
          <h1 className="text-4xl font-black">Bienvenue 👋🏼</h1>
          <p className="text-base text-muted-foreground">
            Saisissez votre adresse électronique et votre mot de passe pour accéder
            à votre compte.
          </p>
        </div>

        {formError && (
          <div className="p-2 text-red-600 bg-red-100 rounded text-center">
            {formError}
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 transform -translate-y-1/2 focus:outline-none"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
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
          </Button>
        </div>

        <div className="text-sm text-center mt-4">
          En cliquant sur <strong>Se connecter</strong>, vous acceptez nos{" "}
          <a href="#" className="underline">
            Conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="underline">
            Politique de confidentialité.
          </a>
        </div>
      </form>
    </div>
  );
}