'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchAppointments } from '@/lib/api'
import type { Appointment } from '@/types/appointment'

const REFRESH_INTERVAL_MS = 30_000

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAppointments = useCallback(async () => {
    try {
      const data = await fetchAppointments()
      setAppointments(data)
      setError(null)
    } catch {
      setError('Não foi possível carregar os agendamentos. Verifique se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAppointments()

    const interval = setInterval(loadAppointments, REFRESH_INTERVAL_MS)
    const onFocus = () => loadAppointments()

    window.addEventListener('focus', onFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [loadAppointments])

  return { appointments, loading, error, refresh: loadAppointments }
}
