// AlertDestructive.jsx
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert"; // Assurez-vous que le chemin est correct
import PropTypes from "prop-types";

export function AlertDestructive({ title, description }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <div>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
    </Alert>
  );
}

AlertDestructive.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
