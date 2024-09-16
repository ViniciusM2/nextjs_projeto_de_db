import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Medical Appointment Management</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/appointments">
          <Button variant="default" size="lg">View Appointments</Button>
        </Link>
        <Link href="/book-appointment">
          <Button variant="outline" size="lg">Book Appointment</Button>
        </Link>
        <Link href="/doctors">
          <Button variant="secondary" size="lg">View Doctors</Button>
        </Link>
        <Link href="/patients">
          <Button variant="secondary" size="lg">Manage Patients</Button>
        </Link>
      </div>
    </main>
  )
}
