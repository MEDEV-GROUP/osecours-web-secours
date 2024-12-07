 import { useState, useEffect } from 'react';
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { createRescueMember } from '../../api/operateur/operateurApi';
import { getAllRescueServices } from '../../api/operateur/serviceApi';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Terminal, CheckCircle2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"; // Ajout des imports manquants

export default function CreateOperatorForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    phoneNumber: '',
    email: '',
    password: '',
    position: '',
    badgeNumber: '',
    rescueServiceId: '',
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // "success" ou "error"
  const [rescueServices, setRescueServices] = useState([]);
  const [errors, setErrors] = useState({}); // Pour stocker les messages d'erreur

  useEffect(() => {
    const fetchRescueServices = async () => {
      try {
        const services = await getAllRescueServices();
        setRescueServices(services);
      } catch (error) {
        console.error('Erreur lors de la récupération des services de secours :', error);
      }
    };

    fetchRescueServices();
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    validateField(key, value); // Validation en temps réel
  };

  const validateField = (key, value) => {
    const phoneRegex = /^[0-9]{10}$/; // Format pour un numéro (10 chiffres)
    const nameRegex = /^[a-zA-ZÀ-ÿ '-]+$/; // Noms avec lettres, accents, espaces et apostrophes
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format d'email

    let errorMessage = '';

    switch (key) {
      case 'lastName':
        if (!nameRegex.test(value)) {
          errorMessage = "Le nom doit contenir uniquement des lettres.";
        }
        break;
      case 'firstName':
        if (!nameRegex.test(value)) {
          errorMessage = "Le prénom doit contenir uniquement des lettres.";
        }
        break;
      case 'phoneNumber':
        if (!phoneRegex.test(value)) {
          errorMessage = "Le numéro doit contenir 10 chiffres.";
        } else {
          errorMessage = ''; // Réinitialiser l'erreur si le numéro est valide
        }
        break;
      case 'password':
        if (value.length < 8) {
          errorMessage = "Le mot de passe doit contenir au moins 8 caractères.";
        }
        break;
      case 'email':
        if (!emailRegex.test(value)) {
          errorMessage = "L'email doit être valide.";
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [key]: errorMessage }));
  };

  const validateForm = () => {
    const { lastName, firstName, phoneNumber, email, password } = formData;
    validateField('lastName', lastName);
    validateField('firstName', firstName);
    validateField('phoneNumber', phoneNumber);
    validateField('password', password);
    validateField('email', email);

    return Object.values(errors).every(error => error === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber, // Utiliser le numéro sans code pays
      position: formData.position,
      badgeNumber: formData.badgeNumber,
      rescueServiceId: formData.rescueServiceId,
    };

    try {
      console.log('Données envoyées pour créer un opérateur :', payload);
      await createRescueMember(payload);
      setAlertType('success');
      setAlertMessage('Opérateur créé avec succès!');

      // Rediriger vers la route /operateurs après succès
      navigate('/operateurs');

      // Réinitialiser le formulaire après succès
      setFormData({
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
        password: '',
        position: '',
        badgeNumber: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Erreur lors de la création de l\'opérateur :', error);
      setAlertType('error');
      if (error.response && error.response.data && error.response.data.message) {
        setAlertMessage(`Erreur réponse du serveur : ${error.response.data.message}`);
      } else {
        setAlertMessage("Erreur lors de la création de l'opérateur.");
      }
    }
  };

  const handleCancel = () => {
    // Réinitialiser le formulaire
    setFormData({
      lastName: '',
      firstName: '',
      phoneNumber: '',
      email: '',
      password: '',
      position: '',
      badgeNumber: '',
    });
    setErrors({});
    // Rediriger vers la page des opérateurs
    navigate('/operateurs');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full">
      {alertMessage && (
        <div className="flex justify-center mb-4">
          <Alert variant={alertType === 'error' ? "destructive" : "default"}>
            {alertType === 'error' ? (
              <Terminal className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>
              {alertType === 'error' ? 'Erreur' : 'Succès'}
            </AlertTitle>
            <AlertDescription>
              {alertMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-2 font-semibold text-gray-700">Informations générales</div>

        {/* Colonne de gauche */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              placeholder="Entrer votre nom"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
            {errors.lastName && <p className="text-[#FF3333] text-sm">{errors.lastName}</p>}
          </div>
          <div>
            <Label htmlFor="phoneNumber">Numéro</Label>
            <Input
              id="phoneNumber"
              placeholder="Entrer votre numéro"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
            />
            {errors.phoneNumber && <p className="text-[#FF3333] text-sm">{errors.phoneNumber}</p>}
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              type="password"
              id="password"
              placeholder="Entrer votre mot de passe"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {errors.password && <p className="text-[#FF3333] text-sm">{errors.password}</p>}
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              placeholder="Entrer votre prénom"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            {errors.firstName && <p className="text-[#FF3333] text-sm">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Entrer votre email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <p className="text-[#FF3333] text-sm">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="rescueServiceId">Service de Secours</Label>
            <Select onValueChange={(val) => handleChange('rescueServiceId', val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Veuillez choisir un service de secours" />
              </SelectTrigger>
              <SelectContent>
                {rescueServices.map(service => (
                  <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="col-span-2 font-semibold text-gray-700 mt-4">Détails supplémentaires</div>

        {/* Colonne de gauche (détails) */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="badgeNumber">N° Badge</Label>
            <Input
              id="badgeNumber"
              placeholder="Entrer votre numéro badge"
              value={formData.badgeNumber}
              onChange={(e) => handleChange('badgeNumber', e.target.value)}
            />
          </div>
        </div>

        {/* Colonne de droite (détails) */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              placeholder="Entrer votre position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="button" onClick={handleCancel} className="mr-4 bg-gray-400 hover:bg-gray-500 text-white">
          Annuler
        </Button>
        <Button type="submit" className="bg-[#FF3333] hover:bg-red-700 text-white">
          Valider l’inscription
        </Button>
      </div>
    </form>
  );
}
