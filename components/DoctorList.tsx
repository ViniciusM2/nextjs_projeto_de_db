import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Medico {
  id_medico: number
  nome: string
  especialidade: string
  email: string
  telefone?: string
  crm: string
}

interface DoctorListProps {
  medicos: Medico[]
  onEdit: (medico: Medico) => void
  onDelete: (id: number) => void
  onViewAppointments: (id: number) => void
}

export default function DoctorList({ medicos = [], onEdit, onDelete, onViewAppointments }: DoctorListProps) {
  if (!medicos || medicos.length === 0) {
    return <p>Nenhum médico encontrado.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Especialidade</TableHead>
          <TableHead>CRM</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicos.map((medico) => (
          <TableRow key={medico.id_medico}>
            <TableCell>{medico.nome}</TableCell>
            <TableCell>{medico.especialidade}</TableCell>
            <TableCell>{medico.crm}</TableCell>
            <TableCell>
              <div className="space-x-2">
                <Button onClick={() => onEdit(medico)} variant="outline" size="sm">
                  Editar
                </Button>
                <Button onClick={() => onDelete(medico.id_medico)} variant="destructive" size="sm">
                  Excluir
                </Button>
                <Button onClick={() => onViewAppointments(medico.id_medico)} variant="secondary" size="sm">
                  Ver Consultas
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}