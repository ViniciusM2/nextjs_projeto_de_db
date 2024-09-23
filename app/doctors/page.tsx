'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DoctorList from '@/components/DoctorList'
import DoctorForm from '@/components/DoctorForm'
import DoctorAppointments from '@/components/DoctorAppointments'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Medico {
  id_medico: number
  nome: string
  especialidade: string
  email: string
  telefone?: string
  crm: string
}

export default function Doctors() {
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [isAddingMedico, setIsAddingMedico] = useState(false)
  const [editingMedico, setEditingMedico] = useState<Medico | null>(null)
  const [selectedMedicoId, setSelectedMedicoId] = useState<number | null>(null)
  const { toast } = useToast()
  const { isLoggedIn, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      fetchMedicos()
    }
  }, [isLoggedIn, router])

  const fetchMedicos = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://147.182.166.181:8000/medicos/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMedicos(data)
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao buscar médicos:', error)
      toast({
        title: "Erro",
        description: "Falha ao buscar médicos. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddMedico = async (medicoData: Omit<Medico, 'id_medico'>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://147.182.166.181:8000/medicos/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicoData),
      })
      if (response.ok) {
        fetchMedicos()
        setIsAddingMedico(false)
        toast({
          title: "Sucesso",
          description: "Médico adicionado com sucesso.",
        })
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao adicionar médico:', error)
      toast({
        title: "Erro",
        description: "Falha ao adicionar médico. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateMedico = async (id: number, medicoData: Omit<Medico, 'id_medico'>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://147.182.166.181:8000/medicos/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicoData),
      })
      if (response.ok) {
        fetchMedicos()
        setEditingMedico(null)
        toast({
          title: "Sucesso",
          description: "Médico atualizado com sucesso.",
        })
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao atualizar médico:', error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar médico. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMedico = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://147.182.166.181:8000/medicos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        fetchMedicos()
        toast({
          title: "Sucesso",
          description: "Médico excluído com sucesso.",
        })
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao excluir médico:', error)
      toast({
        title: "Erro",
        description: "Falha ao excluir médico. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Gerenciamento de Médicos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button asChild variant="outline">
              <Link href="/">Voltar para Início</Link>
            </Button>
            {userRole === "Admin" && (
              <Button onClick={() => setIsAddingMedico(true)}>Adicionar Novo Médico</Button>
            )}
          </div>
          {isAddingMedico && (
            <DoctorForm onSubmit={handleAddMedico} onCancel={() => setIsAddingMedico(false)} />
          )}
          {editingMedico && (
            <DoctorForm
              medico={editingMedico}
              onSubmit={(data) => handleUpdateMedico(editingMedico.id_medico, data)}
              onCancel={() => setEditingMedico(null)}
            />
          )}
          <DoctorList
            medicos={medicos}
            onEdit={setEditingMedico}
            onDelete={handleDeleteMedico}
            onViewAppointments={setSelectedMedicoId}
            userRole={userRole || ''}
          />
          {selectedMedicoId && (
            <DoctorAppointments
              medicoId={selectedMedicoId}
              onClose={() => setSelectedMedicoId(null)}
            />
          )}
        </div>
      </CardContent>
      <Toaster />
    </Card>
  )
}