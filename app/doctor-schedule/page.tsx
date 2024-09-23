"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface HorarioDisponivel {
  id_horario: number;
  data_disponivel: string;
  horario_inicial: string;
  horario_final: string;
}

export default function DoctorSchedulePage() {
  const { userRole, userId } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [schedules, setSchedules] = useState<HorarioDisponivel[]>([]);

  useEffect(() => {
    if (userRole === "Medico") {
      fetchDoctorSchedules();
    }
  }, [userRole, userId]);

  const fetchDoctorSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://147.182.166.181/horarios`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch doctor schedules",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching doctor schedules:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddSchedule = async () => {
    if (!selectedDate) return;

    const newSchedule = {
      id_medico: userId,
      data_disponivel: selectedDate.toISOString().split('T')[0],
      horario_inicial: startTime,
      horario_final: endTime,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://147.182.166.181/horarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newSchedule),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Schedule added successfully",
        });
        fetchDoctorSchedules();
      } else {
        toast({
          title: "Error",
          description: "Failed to add schedule",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (userRole !== "Medico") {
    return <div>Access denied. Only doctors can view this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Your Schedule</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Add Availability</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          <div className="mt-4 space-y-2">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              // label="Start Time" // Removed label prop
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              // label="End Time" // Removed label prop
            />
            <Button onClick={handleAddSchedule}>Add Schedule</Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Schedules</h2>
          <ul className="space-y-2">
            {schedules.map((schedule) => (
              <li key={schedule.id_horario} className="border p-2 rounded-md">
                <p>Date: {schedule.data_disponivel}</p>
                <p>Time: {schedule.horario_inicial} - {schedule.horario_final}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}