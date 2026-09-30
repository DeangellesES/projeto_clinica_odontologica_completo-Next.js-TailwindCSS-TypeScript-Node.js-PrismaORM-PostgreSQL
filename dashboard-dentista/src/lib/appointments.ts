import {
  format,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from 'date-fns'
import type { Appointment, Patient, ServiceStyle } from '@/types/appointment'

const serviceStyles: Record<string, ServiceStyle> = {
  Limpeza: { bg: 'bg-green-200', text: 'text-green-400', emoji: '🟢' },
  Restauração: { bg: 'bg-sky-200', text: 'text-sky-600', emoji: '🔵' },
  Canal: { bg: 'bg-yellow-100', text: 'text-yellow-400', emoji: '🟡' },
  Clareamento: { bg: 'bg-purple-300', text: 'text-purple-800', emoji: '🟣' },
  Consulta: { bg: 'bg-orange-300', text: 'text-orange-600', emoji: '🟠' },
  Ortodontia: { bg: 'bg-indigo-200', text: 'text-indigo-600', emoji: '🦷' },
  'Lente de Contato': { bg: 'bg-pink-200', text: 'text-pink-600', emoji: '✨' },
  Implantes: { bg: 'bg-red-200', text: 'text-red-600', emoji: '🔩' },
  Outro: { bg: 'bg-gray-200', text: 'text-gray-600', emoji: '👨‍⚕️' },
}

const defaultStyle: ServiceStyle = { bg: 'bg-gray-200', text: 'text-gray-600', emoji: '⚪' }

export function getServiceStyle(servico: string): ServiceStyle {
  return serviceStyles[servico] ?? defaultStyle
}

export function getAppointmentDate(appointment: Appointment): Date {
  return parseISO(appointment.data)
}

export function filterAppointmentsByDate(appointments: Appointment[], date: Date): Appointment[] {
  return appointments
    .filter((a) => isSameDay(getAppointmentDate(a), date))
    .sort((a, b) => a.hora.localeCompare(b.hora))
}

export function getNextAppointmentTime(
  appointments: Appointment[],
  date: Date,
  now: Date = new Date()
): string {
  const dayAppointments = filterAppointmentsByDate(appointments, date)

  if (dayAppointments.length === 0) return '--:--'

  if (isSameDay(date, now)) {
    const currentTime = format(now, 'HH:mm')
    const upcoming = dayAppointments.find((a) => a.hora >= currentTime)
    return upcoming?.hora ?? dayAppointments[dayAppointments.length - 1].hora
  }

  return dayAppointments[0].hora
}

export function countWeekAppointments(appointments: Appointment[], date: Date): number {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 })

  return appointments.filter((a) =>
    isWithinInterval(getAppointmentDate(a), { start: weekStart, end: weekEnd })
  ).length
}

export function derivePatients(appointments: Appointment[]): Patient[] {
  const map = new Map<string, Patient>()

  for (const appointment of appointments) {
    const key = appointment.telefone.trim() || appointment.nome.trim().toLowerCase()
    const visitDate = getAppointmentDate(appointment)
    const existing = map.get(key)

    if (!existing) {
      map.set(key, {
        name: appointment.nome,
        phone: appointment.telefone,
        lastVisit: visitDate,
        appointmentIds: [appointment.id],
      })
    } else {
      if (visitDate > existing.lastVisit) {
        existing.lastVisit = visitDate
      }
      existing.appointmentIds.push(appointment.id)
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.lastVisit.getTime() - a.lastVisit.getTime()
  )
}

export function countServices(appointments: Appointment[]): Map<string, number> {
  const counts = new Map<string, number>()

  for (const appointment of appointments) {
    counts.set(appointment.servico, (counts.get(appointment.servico) ?? 0) + 1)
  }

  return counts
}

export function getDatesWithAppointments(appointments: Appointment[]): Date[] {
  const seen = new Set<string>()
  const dates: Date[] = []

  for (const appointment of appointments) {
    const date = getAppointmentDate(appointment)
    const key = format(date, 'yyyy-MM-dd')
    if (!seen.has(key)) {
      seen.add(key)
      dates.push(date)
    }
  }

  return dates
}
