// src/pages/Operators/OperatorsPage.jsx
import { API_BASE_URL } from "../../api/config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRescueMembers } from "../../api/operateur/operateurApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Skeleton } from "@/components/ui/skeleton"; // Assurez-vous que ce chemin est correct

const OperatorsPage = () => {
  const navigate = useNavigate();
  const [operators, setOperators] = useState([]);
  const [error, setError] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  // États pour le Dialog d'édition
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [operatorToEdit, setOperatorToEdit] = useState(null);

  // États pour l'AlertDialog de suppression
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState(null);

  // États pour le Dialog de détail
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [operatorToView, setOperatorToView] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const operatorsData = await getAllRescueMembers();
      setOperators(operatorsData || []);
    } catch (err) {
      if (err.message === "Utilisateur non authentifié.") {
        setError("Votre session a expiré. Veuillez vous reconnecter.");
        localStorage.removeItem("authToken");
        window.location.href = "/";
      } else {
        setError("Erreur lors de la récupération des données.");
      }
    }
  };

  const handleEdit = (operator) => {
    setOperatorToEdit(operator);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    await fetchData();
    setIsEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = (operator) => {
    setOperatorToDelete(operator);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    // Implémentez la logique de suppression côté backend
    await fetchData();
    setIsDeleteDialogOpen(false);
    setOperatorToDelete(null);
  };

  const handleToggleActive = (operator) => {
    // Implémentez la logique pour activer/désactiver côté backend
    setOperators((prev) =>
      prev.map((op) =>
        op.id === operator.id
          ? {
              ...op,
              user: { ...op.user, isActive: !op.user?.isActive },
            }
          : op
      )
    );
  };

  const handleRowClick = (operator) => {
    setOperatorToView(operator);
    setIsDetailDialogOpen(true);
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorFn: (row) => row.user?.photos?.[0],
      id: "photo",
      header: "Photo",
      cell: ({ row }) => {
        const imgUrl = row.getValue("photo");
        return imgUrl ? (
          <img
            src={`${API_BASE_URL}/${imgUrl}`}
            alt="Profil"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          "N/A"
        );
      },
    },
    {
      accessorFn: (row) => row.user?.lastName,
      id: "lastName",
      header: "Nom",
      cell: ({ row }) => row.getValue("lastName") || "N/A",
    },
    {
      accessorFn: (row) => row.user?.firstName,
      id: "firstName",
      header: "Prénom",
      cell: ({ row }) => row.getValue("firstName") || "N/A",
    },
    {
      accessorFn: (row) => row.user?.email,
      id: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email") || "N/A",
    },
    {
      accessorFn: (row) => row.user?.phoneNumber,
      id: "phoneNumber",
      header: "Téléphone",
      cell: ({ row }) => row.getValue("phoneNumber") || "N/A",
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => row.getValue("position") || "N/A",
    },
    {
      accessorKey: "badgeNumber",
      header: "Badge",
      cell: ({ row }) => row.getValue("badgeNumber") || "Non défini",
    },
    {
      accessorFn: (row) => row.user?.isActive,
      id: "isActive",
      header: "Statut",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return (
          <span
            style={{
              backgroundColor: isActive ? "green" : "red",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {isActive ? "Activé" : "Désactivé"}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const operator = row.original;
        const isActive = operator.user?.isActive;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem onClick={() => handleEdit(operator)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleActive(operator)}>
                {isActive ? "Désactiver" : "Activer"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleOpenDeleteDialog(operator)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: operators,
    columns,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const operatorNameToDelete = operatorToDelete
    ? `${operatorToDelete.user?.firstName || ""} ${
        operatorToDelete.user?.lastName || ""
      }`.trim()
    : "";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-16">
        <h1 className="text-3xl font-bold">Nos Opérateurs Terrains</h1>
        <Button
          className="bg-[#FF3333]"
          onClick={() => navigate("/operateurs/creer-un-nouvel-operateur")}
        >
          Créer un nouvel opérateur
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-gray-200 text-black">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getRowModel().rows.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="bg-white hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      const targetTag = e.target.tagName.toLowerCase();
                      if (
                        targetTag === "button" ||
                        targetTag === "input" ||
                        targetTag === "svg" ||
                        targetTag === "span"
                      ) {
                        return;
                      }
                      handleRowClick(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="bg-white">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Affichage du skeleton si aucun opérateur n'est présent
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex} className="bg-white">
                    {columns.map((col, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className="h-12 text-center bg-white"
                      >
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de détails */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails de l'opérateur</DialogTitle>
            <DialogDescription>
              Consultez les informations détaillées de l'opérateur.
            </DialogDescription>
          </DialogHeader>
          {operatorToView && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center">
                {operatorToView.user?.photos?.[0] ? (
                  <img
                    src={`${API_BASE_URL}/${operatorToView.user.photos[0]}`}
                    alt="Photo de profil"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                    N/A
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-bold">Nom</Label>
                  <p>{operatorToView.user?.lastName || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Prénom</Label>
                  <p>{operatorToView.user?.firstName || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Email</Label>
                  <p>{operatorToView.user?.email || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Téléphone</Label>
                  <p>{operatorToView.user?.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Position</Label>
                  <p>{operatorToView.position || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Badge</Label>
                  <p>{operatorToView.badgeNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Statut</Label>
                  <p>
                    {operatorToView.user?.isActive ? "Activé" : "Désactivé"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {operatorToView && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Retour
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setOperatorToEdit(operatorToView);
                    setIsDetailDialogOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Modifier
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier un opérateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l&apos;opérateur puis enregistrez.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right font-bold">
                Nom
              </Label>
              <Input
                id="lastName"
                value={operatorToEdit?.user?.lastName || ""}
                onChange={(e) =>
                  setOperatorToEdit((prev) => ({
                    ...prev,
                    user: { ...prev.user, lastName: e.target.value },
                  }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right font-bold">
                Prénom
              </Label>
              <Input
                id="firstName"
                value={operatorToEdit?.user?.firstName || ""}
                onChange={(e) =>
                  setOperatorToEdit((prev) => ({
                    ...prev,
                    user: { ...prev.user, firstName: e.target.value },
                  }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right font-bold">
                Téléphone
              </Label>
              <Input
                id="phoneNumber"
                value={operatorToEdit?.user?.phoneNumber || ""}
                onChange={(e) =>
                  setOperatorToEdit((prev) => ({
                    ...prev,
                    user: { ...prev.user, phoneNumber: e.target.value },
                  }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right font-bold">
                Position
              </Label>
              <Input
                id="position"
                value={operatorToEdit?.position || ""}
                onChange={(e) =>
                  setOperatorToEdit((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="badgeNumber" className="text-right font-bold">
                Badge
              </Label>
              <Input
                id="badgeNumber"
                value={operatorToEdit?.badgeNumber || ""}
                onChange={(e) =>
                  setOperatorToEdit((prev) => ({
                    ...prev,
                    badgeNumber: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleSaveChanges}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de suppression */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cet opérateur ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {operatorNameToDelete ? (
                <>
                  Cette action est irréversible. Vous êtes sur le point de
                  supprimer l’opérateur <strong>{operatorNameToDelete}</strong>.
                  Toutes les données associées seront définitivement perdues.
                </>
              ) : (
                <>
                  Cette action est irréversible. Toutes les données associées à
                  cet opérateur seront définitivement supprimées.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OperatorsPage;
