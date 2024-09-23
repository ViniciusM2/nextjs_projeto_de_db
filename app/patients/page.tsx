'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import PatientList from '@/components/PatientList'
import PatientForm from '@/components/PatientForm'
import PatientAppointments from '@/components/PatientAppointments'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Patient {
  id_paciente: number
  nome: string
  data_nascimento: string
  email: string
  telefone?: string
  cpf: string
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isAddingPatient, setIsAddingPatient] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const { toast } = useToast()
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      fetchPatients()
    }
  }, [isLoggedIn, router])

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://147.182.166.181/pacientes/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
      toast({
        title: "Erro",
        description: "Falha ao buscar pacientes. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddPatient = async (patientData: Omit<Patient, 'id_paciente'>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://147.182.166.181/pacientes/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData),
      })
      if (response.ok) {
        fetchPatients()
        setIsAddingPatient(false)
        toast({
          title: "Sucesso",
          description: "Paciente adicionado com sucesso.",
        })
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error)
      toast({
        title: "Erro",
        description: "Falha ao adicionar paciente. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePatient = async (id: number, patientData: Omit<Patient, 'id_paciente'>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://147.182.166.181/pacientes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData),
      })
      if (response.ok) {
        fetchPatients()
        setEditingPatient(null)
        toast({
          title: "Sucesso",
          description: "Paciente atualizado com sucesso.",
        })
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar paciente. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePatient = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://147.182.166.181/pacientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        fetchPatients()
        toast({
          title: "Sucesso",
          description: "Paciente excluído com sucesso.",
        })
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)
      toast({
        title: "Erro",
        description: "Falha ao excluir paciente. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Gerenciamento de Pacientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button asChild variant="outline">
              <Link href="/">Voltar para Início</Link>
            </Button>
            <Button onClick={() => setIsAddingPatient(true)}>Adicionar Novo Paciente</Button>
          </div>
          {isAddingPatient && (
            <PatientForm onSubmit={handleAddPatient} onCancel={() => setIsAddingPatient(false)} />
          )}
          {editingPatient && (
          <PatientForm
              patient={editingPatient}
              onSubmit={(data) => handleUpdatePatient(editingPatient.id_paciente, data)}
              onCancel={() => setEditingPatient(null)}
            />
          )}
          <PatientList
            patients={patients}
            onEdit={setEditingPatient}
            onDelete={handleDeletePatient}
            onViewAppointments={setSelectedPatientId}
          />
          {selectedPatientId && (
            <PatientAppointments
              patientId={selectedPatientId}
              onClose={() => setSelectedPatientId(null)}
            />
          )}
        </div>
      </CardContent>
      <Toaster />
    </Card>
  )
}