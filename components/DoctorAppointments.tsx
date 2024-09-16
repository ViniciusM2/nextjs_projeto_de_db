import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Consulta {
  id_consulta: number
  id_paciente: number
  data_consulta: string
  horario_consulta: string
  status: string
}

interface DoctorAppointmentsProps {
  medicoId: number
  onClose: () => void
}

export default function DoctorAppointments({ medicoId, onClose }: DoctorAppointmentsProps) {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConsultas()
  }, [medicoId])

  const fetchConsultas = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://147.182.166.181:8000/medicos/${medicoId}/consultas`)
      if (!response.ok) {
        throw new Error('Falha ao buscar consultas')
      }
      const data = await response.json()
      setConsultas(data)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar consultas:', error)
      setError('Falha ao carregar consultas. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultas do Médico</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Carregando consultas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            {consultas.length === 0 ? (
              <p>Nenhuma consulta encontrada para este médico.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID do Paciente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultas.map((consulta) => (
                    <TableRow key={consulta.id_consulta}>
                      <TableCell>{consulta.id_paciente}</TableCell>
                      <TableCell>{consulta.data_consulta}</TableCell>
                      <TableCell>{consulta.horario_consulta}</TableCell>
                      <TableCell>{consulta.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
        <Button onClick={onClose} className="mt-4">
          Fechar
        </Button>
      </CardContent>
    </Card>
  )
}