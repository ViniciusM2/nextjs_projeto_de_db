import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id_consulta: number;
  data_consulta: string;
  horario_consulta: string;
  status: string;
  medico: {
    nome: string;
    especialidade: string;
  };
}

interface PatientAppointmentsProps {
  patientId: number;
  onClose: () => void;
}

const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  patientId,
  onClose,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const appointmentsRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  useEffect(() => {
    fetchAppointments();
    setShouldScroll(true);
  }, [patientId]);

  useEffect(() => {
    if (shouldScroll && appointmentsRef.current) {
      appointmentsRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false);
    }
  }, [shouldScroll, appointments]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://147.182.166.181/pacientes/${patientId}/consultas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else if (response.status === 401) {
        // Handle unauthorized access
      }
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
      toast({
        title: "Erro",
        description: "Falha ao buscar consultas. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card ref={appointmentsRef}>
      <CardHeader>
        <CardTitle>Consultas do Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id_consulta}>
                <TableCell>
                  {appointment.data_consulta} - {appointment.horario_consulta}
                </TableCell>
                <TableCell>{appointment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAppointments;
