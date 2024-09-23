"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface Medico {
  id_medico: number;
  nome: string;
  especialidade: string;
  email: string;
  telefone?: string;
  crm: string;
}

interface Patient {
  id_paciente: number;
  nome: string;
  data_nascimento: string;
  email: string;
  telefone?: string;
  cpf: string;
}

export default function BookAppointment() {
  const { isLoggedIn, userRole, userEmail, userId } = useAuth(); // Assuming userRole and userEmail are provided
  const router = useRouter();
  const { toast } = useToast();
  const [doctors, setMedicos] = useState<Medico[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<
    { horario_inicial: string }[]
  >([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]); // Ensure this is initialized as an empty array
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  useEffect(() => {
    console.log(userId);
    console.log(userRole);
    console.log(userEmail);

    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchMedicos();
      if (userRole === "Paciente") {
        setSelectedPatient(Number(userId));
      } else {
        fetchPatients();
      }
    }
  }, [isLoggedIn, router, userRole, userEmail, userId]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://147.182.166.181:8000/pacientes/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        // Check if data is an array
        setPatients(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patients. Please try again.",
      });
    }
  };

  const fetchMedicos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://147.182.166.181:8000/medicos/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMedicos(data);
      } else if (response.status === 401) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
      toast({
        title: "Erro",
        description: "Falha ao buscar médicos. Por favor, tente novamente.",
        // variant: "destructive",
      });
    }
  };

  const fetchAvailableSlots = async () => {
    console.log(selectedDoctor, selectedDate);
    if (!selectedDoctor || !selectedDate) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://147.182.166.181:8000/medicos/${selectedDoctor}/horarios_disponiveis`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch slots"); // Handle non-200 responses
      const data = await response.json() as { horario_inicial: string, data_disponivel: string }[];
      const filteredData = data.filter(slot => slot.data_disponivel === format(selectedDate, "yyyy-MM-dd"));
      setAvailableSlots(filteredData);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      toast({
        title: "Error",
        description: "Failed to fetch available slots. Please try again.",
        // variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDoctor, selectedDate]);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a doctor, date, and time slot.",
        // variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://147.182.166.181:8000/consultas/${selectedDoctor}/agendar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_paciente: selectedPatient,
            id_medico: selectedDoctor,
            data_consulta: format(selectedDate, "yyyy-MM-dd"),
            horario_consulta: selectedSlot,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to book appointment"); // Handle non-200 responses

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });
      router.push("/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        // variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
      <Card>
        <CardHeader>
          <CardTitle>Select Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userRole !== "Paciente" && (
            <Select
              onValueChange={(value) => setSelectedPatient(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem
                    key={patient.id_paciente}
                    value={patient.id_paciente.toString()}
                  >
                    {patient.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select onValueChange={(value) => setSelectedDoctor(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem
                  key={doctor.id_medico}
                  value={doctor.id_medico.toString()}
                >
                  {doctor.nome} - {doctor.especialidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate || new Date()}
                  onSelect={(date) => setSelectedDate(date || null)}
                  initialFocus
                  disabled={(date) => {
                    const currentDate = new Date();
                    return date < currentDate
                  }}
                />
              </PopoverContent>
            </Popover>

            {availableSlots.length > 0 && (
              <Select onValueChange={setSelectedSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem
                      key={slot.horario_inicial}
                      value={slot.horario_inicial}
                    >
                      {slot.horario_inicial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button onClick={handleBookAppointment} className="w-full">
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
