import React, { useState, useEffect, useCallback } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { useToast } from "../hooks/use-toast";

// Constantes de sécurité
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_EMAIL_LENGTH = 254; // Selon RFC 5321
const MIN_PASSWORD_LENGTH = 8;
const BLOCK_DURATION_BASE = 2; // en secondes

export function LoginForm({ className, ...props }) {
  // États pour le formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // États pour la gestion de la sécurité
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  
  // États pour les notifications et erreurs
  const [notification, setNotification] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Hooks personnalisés et context
  const { login, isAuthenticated, error: authError, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Récupération du message de déconnexion
  const logoutMessage = new URLSearchParams(location.search).get("logout");

  // Effet pour gérer le message de déconnexion
  useEffect(() => {
    if (logoutMessage) {
      showNotification(
        "Déconnexion réussie",
        "Vous avez été déconnecté avec succès.",
        "success"
      );
    }
  }, [logoutMessage]);

  // Effet pour gérer les erreurs d'authentification
  useEffect(() => {
    if (authError) {
      showNotification("Erreur", authError, "error");
    }
  }, [authError]);

  // Gestion du blocage après trop de tentatives
  useEffect(() => {
    if (isBlocked && blockTimer > 0) {
      const timer = setInterval(() => {
        setBlockTimer((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTimer]);

  // Fonction pour afficher les notifications
  const showNotification = useCallback((title, message, type = "error") => {
    setNotification({ title, message, type });
    toast({
      title,
      description: message,
      variant: type === "error" ? "destructive" : "default",
      duration: 5000,
    });

    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, [toast]);

  // Validation de l'email
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return "L'email est requis";
    }
    if (!emailRegex.test(email)) {
      return "Format d'email invalide";
    }
    if (email.length > MAX_EMAIL_LENGTH) {
      return `L'email ne doit pas dépasser ${MAX_EMAIL_LENGTH} caractères`;
    }
    return "";
  }, []);

  // Validation du mot de passe
  const validatePassword = useCallback((password) => {
    if (!password) {
      return "Le mot de passe est requis";
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`;
    }
    return "";
  }, []);

  // Gestion du changement d'email
  const handleEmailChange = useCallback((e) => {
    const sanitizedEmail = e.target.value.trim().toLowerCase();
    setEmail(sanitizedEmail);
    const error = validateEmail(sanitizedEmail);
    setFormErrors(prev => ({
      ...prev,
      email: error
    }));
  }, [validateEmail]);

  // Gestion du changement de mot de passe
  const handlePasswordChange = useCallback((e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const error = validatePassword(newPassword);
    setFormErrors(prev => ({
      ...prev,
      password: error
    }));
  }, [validatePassword]);

  // Gestion de la soumission du formulaire
  const handleLogin = async (e) => {
    e.preventDefault();

    // Vérification du blocage
    if (isBlocked) {
      showNotification(
        "Accès bloqué",
        `Veuillez réessayer dans ${blockTimer} secondes`,
        "error"
      );
      return;
    }

    // Vérification du délai entre les tentatives
    if (lastAttemptTime) {
      const timeSinceLastAttempt = Date.now() - lastAttemptTime;
      if (timeSinceLastAttempt < 1000) { // Anti spam - 1 seconde minimum entre les tentatives
        return;
      }
    }

    // Validation des champs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setFormErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    try {
      setLastAttemptTime(Date.now());
      await login(email, password);
      
      // Réinitialisation en cas de succès
      setLoginAttempts(0);
      showNotification(
        "Connexion réussie",
        "Vous allez être redirigé vers votre tableau de bord",
        "success"
      );
    } catch (error) {
      // Gestion des tentatives échouées
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const blockDuration = Math.pow(BLOCK_DURATION_BASE, newAttempts - MAX_LOGIN_ATTEMPTS + 1);
        setBlockTimer(blockDuration);
        setIsBlocked(true);
        showNotification(
          "Compte temporairement bloqué",
          `Trop de tentatives. Réessayez dans ${blockDuration} secondes.`,
          "error"
        );
      } else {
        showNotification(
          "Erreur de connexion",
          `Identifiants invalides. ${MAX_LOGIN_ATTEMPTS - newAttempts} tentatives restantes.`,
          "error"
        );
      }
    }
  };

  // Redirection si authentifié
  if (isAuthenticated) {
    return <Navigate to="/tableau-de-bord" replace />;
  }

  return (
    <div className="relative w-full">
      {/* Système de notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 w-96 animate-in fade-in slide-in-from-top-2">
          <Alert 
            className={cn(
              "relative",
              notification.type === "error" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"
            )}
          >
            <button
              onClick={() => setNotification(null)}
              className="absolute right-2 top-2 rounded-full p-1 hover:bg-background/80"
            >
              <X className="h-4 w-4" />
            </button>
            <AlertTitle className={notification.type === "error" ? "text-red-900" : "text-green-900"}>
              {notification.title}
            </AlertTitle>
            <AlertDescription className={notification.type === "error" ? "text-red-800" : "text-green-800"}>
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Formulaire */}
      <form
        className={cn("flex flex-col gap-6 relative z-10", className)}
        onSubmit={handleLogin}
        {...props}
      >
        <div className="flex flex-col items-start gap-2 text-left">
          <h1 className="text-4xl font-black">Bienvenue 👋🏼</h1>
          <p className="text-base text-muted-foreground">
            Saisissez votre adresse électronique et votre mot de passe pour accéder
            à votre compte.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Champ Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={handleEmailChange}
                maxLength={MAX_EMAIL_LENGTH}
                className={cn(formErrors.email && "border-red-500")}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
                autoComplete="email"
                spellCheck="false"
                required
              />
              {formErrors.email && (
                <div 
                  id="email-error" 
                  className="absolute -bottom-6 left-0 text-sm text-red-500 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {formErrors.email}
                </div>
              )}
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div className="grid gap-2 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={handlePasswordChange}
                className={cn(formErrors.password && "border-red-500")}
                aria-invalid={!!formErrors.password}
                aria-describedby={formErrors.password ? "password-error" : undefined}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {formErrors.password && (
                <div 
                  id="password-error" 
                  className="absolute -bottom-6 left-0 text-sm text-red-500 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {formErrors.password}
                </div>
              )}
            </div>
          </div>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isBlocked || !!formErrors.email || !!formErrors.password}
          >
            {isLoading ? (
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
            ) : isBlocked ? (
              `Réessayer dans ${blockTimer}s`
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>

        {/* Mentions légales */}
        <div className="text-sm text-center mt-4">
          En cliquant sur <strong>Se connecter</strong>, vous acceptez nos{" "}
          <a href="#" className="underline">
            Conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="underline">
            Politique de confidentialité
          </a>
          .
        </div>
      </form>
    </div>
  );
}