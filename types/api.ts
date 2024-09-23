export interface Consulta {
  id_paciente: number
  id_medico: number
  data_consulta: string
  horario_consulta: string
  status: string | null
  observacoes: string | null
  id_consulta: number
}