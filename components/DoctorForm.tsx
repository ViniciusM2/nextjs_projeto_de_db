import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Medico {
  id_medico?: number
  nome: string
  email: string
  especialidade: string
  telefone?: string
  crm: string
  senha?: string
}

interface DoctorFormProps {
  medico?: Medico
  onSubmit: (data: Omit<Medico, 'id_medico'>) => void
  onCancel: () => void
}

export default function DoctorForm({ medico, onSubmit, onCancel }: DoctorFormProps) {
  const [formData, setFormData] = useState<Omit<Medico, 'id_medico'>>({
    nome: '',
    email: '',
    especialidade: '',
    telefone: '',
    crm: '',
    senha: '',
  })

  useEffect(() => {
    if (medico) {
      setFormData({
        nome: medico.nome,
        email: medico.email,
        especialidade: medico.especialidade,
        telefone: medico.telefone || '',
        crm: medico.crm,
        senha: medico.senha || '',
      })
    }
  }, [medico])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSubmit = { ...formData }
    if (!medico && !dataToSubmit.senha) {
      dataToSubmit.senha = 'senha_padrao_123' // Default password for new doctors
    }
    onSubmit(dataToSubmit)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{medico ? 'Editar Médico' : 'Adicionar Novo Médico'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="especialidade">Especialidade</Label>
            <Input
              type="text"
              id="especialidade"
              name="especialidade"
              value={formData.especialidade}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crm">CRM</Label>
            <Input
              type="text"
              id="crm"
              name="crm"
              value={formData.crm}
              onChange={handleChange}
              required
            />
          </div>
          {!medico && (
            <div className="space-y-2">
              <Label htmlFor="senha">Senha (opcional)</Label>
              <Input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Deixe em branco para senha padrão"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">{medico ? 'Atualizar' : 'Adicionar'} Médico</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}