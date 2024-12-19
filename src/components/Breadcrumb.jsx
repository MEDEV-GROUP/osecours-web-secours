import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

const CustomBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname ? location.pathname.split("/").filter((x) => x) : [];

  // Si nous sommes sur la page d'accueil uniquement, ne rien afficher
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Lien vers la page d'accueil */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="pl-6 text-base font-bold text-black">
            Accueil
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>

        {pathnames.map((pathname, index) => {
          const isLast = index === pathnames.length - 1; // Vérifie si c'est le dernier élément
          const href = `/${pathnames.slice(0, index + 1).join("/")}`; // Génère le chemin complet jusqu'à cet élément
          const formattedName = 
            pathname.replace(/-/g, " ").charAt(0).toUpperCase() + 
            pathname.replace(/-/g, " ").slice(1);

          return (
            <BreadcrumbItem key={href}>
              {isLast ? (
                // Dernier élément : texte simple sans lien
                <BreadcrumbPage className="font-medium">{formattedName}</BreadcrumbPage>
              ) : (
                <>
                  {/* Élément intermédiaire avec lien */}
                  <BreadcrumbLink href={href} className="text-gray-600 hover:text-black">
                    {formattedName}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
