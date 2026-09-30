export interface Appointment {
  id: string
  servico: string
  dentista: string
  data: string
  hora: string
  nome: string
  telefone: string
  createdAt: string
}

export interface Patient {
  name: string
  phone: string
  lastVisit: Date
  appointmentIds: string[]
}

export interface ServiceStyle {
  bg: string
  text: string
  emoji: string
}
