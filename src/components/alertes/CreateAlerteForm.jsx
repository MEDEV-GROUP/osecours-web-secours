import { useState } from 'react';
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { publishMessage } from '../../api/alertes/alerteApi';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Terminal, CheckCircle2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";

export default function PublishMessageForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    level: '',
    scheduleAt: '', // Nouveau champ pour la date et l'heure
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  const validateField = (key, value) => {
    let errorMessage = '';

    switch (key) {
      case 'title':
        if (!value.trim()) {
          errorMessage = "Le titre est requis.";
        }
        break;
      case 'content':
        if (!value.trim()) {
          errorMessage = "Le contenu est requis.";
        }
        break;
      case 'level':
        if (!value.trim()) {
          errorMessage = "Le niveau est requis.";
        }
        break;
      case 'scheduleAt':
        if (!value.trim()) {
          errorMessage = "La date et l'heure sont requises.";
        } else if (new Date(value) <= new Date()) {
          errorMessage = "La date et l'heure doivent être dans le futur.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const validateForm = () => {
    const { title, content, level, scheduleAt } = formData;
    validateField('title', title);
    validateField('content', content);
    validateField('level', level);
    validateField('scheduleAt', scheduleAt);
    return Object.values(errors).every((error) => error === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await publishMessage(formData);
      setAlertType('success');
      setAlertMessage('Message programmé avec succès!');
      console.log('Résultat :', result);
      setFormData({ title: '', content: '', level: '', scheduleAt: '' });
      setErrors({});
      navigate('/alertes-emises');
    } catch (error) {
      console.error('Erreur lors de la programmation du message :', error);
      setAlertType('error');
      setAlertMessage("Erreur lors de la programmation du message.");
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '', level: '', scheduleAt: '' });
    setErrors({});
    navigate('/alertes-emises');
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
        <div className="col-span-2 font-semibold text-gray-700">Informations du message</div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              placeholder="Entrer le titre"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            {errors.title && <p className="text-[#FF3333] text-sm">{errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="content">Contenu</Label>
            <textarea
              id="content"
              placeholder="Entrer le contenu"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="border rounded-md p-2 w-full h-32"
            />
            {errors.content && <p className="text-[#FF3333] text-sm">{errors.content}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="level">Niveau d&apos;alerte</Label>
            <Select onValueChange={(val) => handleChange('level', val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Veuillez choisir un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Très importante">Très importante</SelectItem>
                <SelectItem value="Importante">Importante</SelectItem>
                <SelectItem value="Moins importante">Moins importante</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && <p className="text-[#FF3333] text-sm">{errors.level}</p>}
          </div>
          <div>
            <Label htmlFor="scheduleAt">Date et heure</Label>
            <Input
              id="scheduleAt"
              type="datetime-local"
              value={formData.scheduleAt}
              onChange={(e) => handleChange('scheduleAt', e.target.value)}
            />
            {errors.scheduleAt && <p className="text-[#FF3333] text-sm">{errors.scheduleAt}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="button" onClick={handleCancel} className="mr-4 bg-gray-400 hover:bg-gray-500 text-white">
          Annuler
        </Button>
        <Button type="submit" className="bg-[#FF3333] hover:bg-red-700 text-white">
          Programmer l&apos;alerte
        </Button>
      </div>
    </form>
  );
}
