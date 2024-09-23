"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AppointmentList } from "@/components/AppointmentList";
import { Consulta } from "@/types/api";

export default function Appointments() {
  const { isLoggedIn } = useAuth();

  const router = useRouter();
  const [appointments, setAppointments] = useState<Consulta[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchAppointments();
    }
  }, [isLoggedIn, router]);

  const getUrlByRole = () => {
    return `http://147.182.166.181/consultas`;
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(getUrlByRole(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> Appointments</h1>
      <Button asChild className="mb-4">
        <Link href="/">Back to Home</Link>
      </Button>
      <Button asChild className="mb-4 ml-2">
        <Link href="/book-appointment">Book New Appointment</Link>
      </Button>
      <AppointmentList
        appointments={appointments}
        onUpdate={fetchAppointments}
      />
    </div>
  );
}
