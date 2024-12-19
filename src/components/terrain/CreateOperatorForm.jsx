import { useState, useEffect } from 'react'; 
import { useDropzone } from 'react-dropzone'; 
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { createRescueMember } from '../../api/operateur/operateurApi';
import { getAllRescueServices } from '../../api/operateur/serviceApi';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Terminal, CheckCircle2, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";

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
    photo: null, // On peut garder "photo" comme nom de variable interne
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); 
  const [rescueServices, setRescueServices] = useState([]);
  const [errors, setErrors] = useState({});

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
    if (key !== 'photo') {
      validateField(key, value);
    }
  };

  const validateField = (key, value) => {
    const phoneRegex = /^[0-9]{10}$/;
    const nameRegex = /^[a-zA-ZÀ-ÿ '-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      handleChange('photo', file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxSize: 8 * 1024 * 1024 // 8MB max
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Vérifier qu'une photo est présente si c'est obligatoire
    if (!formData.photo) {
      setAlertType('error');
      setAlertMessage("La photo de profil est obligatoire.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('badgeNumber', formData.badgeNumber);
    formDataToSend.append('rescueServiceId', formData.rescueServiceId);

    // Nom du champ attendu par le backend : 'img'
    if (formData.photo) {
      formDataToSend.append('img', formData.photo);
    }

    try {
      await createRescueMember(formDataToSend);
      setAlertType('success');
      setAlertMessage('Opérateur créé avec succès!');
      navigate('/operateurs');
      setFormData({
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
        password: '',
        position: '',
        badgeNumber: '',
        rescueServiceId: '',
        photo: null,
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
    setFormData({
      lastName: '',
      firstName: '',
      phoneNumber: '',
      email: '',
      password: '',
      position: '',
      badgeNumber: '',
      rescueServiceId: '',
      photo: null,
    });
    setErrors({});
    navigate('/operateurs');
  };

  const removePhoto = () => {
    handleChange('photo', null);
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
          <div className='flex flex-col'>
            <Label>Photo de profil</Label>
            {formData.photo ? (
              <div className="relative inline-block mt-2">
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Aperçu"
                  className="border w-48 h-auto"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-1 left-40 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div 
                {...getRootProps()} 
                className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer mt-2"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Déposez l&apos;image ici...</p>
                ) : (
                  <p>Déposez votre image ou <span className="text-blue-600 underline">Parcourir</span><br />JPEG ou PNG uniquement • 8 Mo max.</p>
                )}
              </div>
            )}
          </div>
        </div>

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
          Valider l&apos;inscription
        </Button>
      </div>
    </form>
  );
}
