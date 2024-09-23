import { useState } from "react";
import { Consulta } from "@/types/api";
import { Button } from "@/components/ui/button";

interface AppointmentListProps {
  appointments: Consulta[];
  onUpdate: () => void;
}

export function AppointmentList({
  appointments,
  onUpdate,
}: AppointmentListProps) {
  const [loading, setLoading] = useState<number | null>(null);
  let token = localStorage.getItem("token");
  const handleCancelAppointment = async (id: number) => {
    setLoading(id);
    try {
      const response = await fetch(
        `http://147.182.166.181/consultas/${id}/cancelar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        onUpdate();
      } else {
        console.error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
    setLoading(null);
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id_consulta} className="border p-4 rounded-lg">
          <p>
            <strong>Date:</strong> {appointment.data_consulta}
          </p>
          <p>
            <strong>Time:</strong> {appointment.horario_consulta}
          </p>
          <p>
            <strong>Status:</strong> {appointment.status}
          </p>
          {appointment.status === "agendada" && (
            <Button
              onClick={() => handleCancelAppointment(appointment.id_consulta)}
              disabled={loading === appointment.id_consulta}
              className="mt-2"
            >
              {loading === appointment.id_consulta
                ? "Canceling..."
                : "Cancel Appointment"}
            </Button>
          )}
        </div>
      ))}
      {appointments.length === 0 && <p>You have no appointments scheduled.</p>}
    </div>
  );
}
