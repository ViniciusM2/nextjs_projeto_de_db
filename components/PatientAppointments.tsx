import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

interface Appointment {
  id_consulta: number
  data_hora: string
  medico: {
    nome: string
    especialidade: string
  }
}

interface PatientAppointmentsProps {
  patientId: number
  onClose: () => void
}

const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ patientId, onClose }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [patientId])

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://147.182.166.181:8000/pacientes/${patientId}/consultas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else if (response.status === 401) {
        // Handle unauthorized access
      }
    } catch (error) {
      console.error('Erro ao buscar consultas:', error)
      toast({
        title: "Erro",
        description: "Falha ao buscar consultas. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultas do Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>Especialidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id_consulta}>
                <TableCell>{new Date(appointment.data_hora).toLocaleString()}</TableCell>
                <TableCell>{appointment.medico.nome}</TableCell>
                <TableCell>{appointment.medico.especialidade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PatientAppointments