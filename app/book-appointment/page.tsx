import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BookAppointment() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
      <Button asChild className="mb-4">
        <Link href="/">Back to Home</Link>
      </Button>
      {/* Add appointment booking form here */}
    </div>
  )
}