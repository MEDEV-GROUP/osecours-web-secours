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
  const pathnames = location.pathname.split("/").filter((x) => x); // Sépare le chemin en segments

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="pl-6 text-base font-bold text-black" href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator> 
        {pathnames.map((pathname, index) => {
          const isLast = index === pathnames.length - 1;
          const href = `/${pathnames.slice(0, index + 1).join("/")}`; // Crée le lien pour chaque segment
          const formattedName = pathname.replace(/-/g, ' ').charAt(0).toUpperCase() + pathname.replace(/-/g, ' ').slice(1); // Remplace les "-" par des espaces et met en majuscule

          return (
            <BreadcrumbItem key={href}>
              {isLast ? (
                <BreadcrumbPage>{formattedName}</BreadcrumbPage> // Affiche le nom de la page
              ) : (
                <>
                  <BreadcrumbLink href={href}>{formattedName}</BreadcrumbLink> {/* Affiche le nom de la page avec lien */}
                  <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator> {/* Séparateur entre les éléments */}
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