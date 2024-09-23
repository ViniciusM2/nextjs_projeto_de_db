"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoginPage from "./login/page";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isLoggedIn, userRole } = useAuth();
  console.log(userRole);

  if (isLoggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">
          Medical Appointment Management
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/appointments">
            <Button variant="default" size="lg">
              View Appointments
            </Button>
          </Link>
          {(userRole === "Admin" || userRole === "Paciente") && (
            <Link href="/book-appointment">
              <Button variant="outline" size="lg">
                Book Appointment
              </Button>
            </Link>
          )}
          <Link href="/doctors">
            <Button variant="secondary" size="lg">
              View Doctors
            </Button>
          </Link>
          {userRole === "Admin" && (
            <Link href="/patients">
              <Button variant="secondary" size="lg">
                Manage Patients
              </Button>
            </Link>
          )}
          {userRole === "Medico" && (
            <Link href="/doctor-schedule">
              <Button variant="secondary" size="lg">
                Manage Schedule
              </Button>
            </Link>
          )}
        </div>
      </main>
    );
  } else {
    return <LoginPage />;
  }
}
