import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Patient {
  id_paciente: number;
  nome: string;
  data_nascimento: string;
  email: string;
  telefone?: string;
  cpf: string;
}

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
  onViewAppointments: (id: number) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  onEdit,
  onDelete,
  onViewAppointments,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Data de Nascimento</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id_paciente}>
            <TableCell>{patient.nome}</TableCell>
            <TableCell>
              {new Date(patient.data_nascimento).toLocaleDateString()}
            </TableCell>
            <TableCell>{patient.email}</TableCell>
            <TableCell>{patient.telefone || "N/A"}</TableCell>
            <TableCell>{patient.cpf}</TableCell>
            <TableCell>
              <div className="space-x-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(patient)}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(patient.id_paciente)}
                >
                  Excluir
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewAppointments(patient.id_paciente)}
                >
                  Ver Consultas
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PatientList;
