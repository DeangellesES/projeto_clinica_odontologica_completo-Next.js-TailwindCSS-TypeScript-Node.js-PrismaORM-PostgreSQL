import axios from 'axios'
import type { Appointment } from '@/types/appointment'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export type CreateAppointmentPayload = Omit<Appointment, 'id' | 'createdAt'>

export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  const { data } = await api.post<Appointment>('/appointments/servico', payload)
  return data
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>('/appointments/servico')
  return data
}

export async function updateAppointment(id: string, payload: Partial<Omit<Appointment, 'id' | 'createdAt'>>): Promise<Appointment> {
  const { data } = await api.put<Appointment>(`/appointments/servico/${id}`, payload)
  return data
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/appointments/servico/${id}`)
}

export async function deleteAppointmentsByPatient(appointmentIds: string[]): Promise<void> {
  await Promise.all(appointmentIds.map((id) => deleteAppointment(id)))
}

export async function updateAppointmentsByPatient(
  appointmentIds: string[],
  payload: Partial<Omit<Appointment, 'id' | 'createdAt'>>
): Promise<void> {
  await Promise.all(appointmentIds.map((id) => updateAppointment(id, payload)))
}
