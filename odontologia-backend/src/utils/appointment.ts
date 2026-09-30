export function parseDataAgendamento(value: unknown): Date | null {
  if (value === undefined || value === null) return null
  const s = String(value).trim()

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (iso) {
    const y = Number(iso[1])
    const m = Number(iso[2]) - 1
    const d = Number(iso[3])
    const date = new Date(y, m, d, 12, 0, 0, 0)
    if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
      return date
    }
    return null
  }

  const br = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s)
  if (br) {
    const d = Number(br[1])
    const m = Number(br[2]) - 1
    const y = Number(br[3])
    const date = new Date(y, m, d, 12, 0, 0, 0)
    if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
      return date
    }
    return null
  }

  const fallback = new Date(s)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

/** Normaliza para HH:mm (ex.: "9:00" ou "09:00:00" → "09:00"). */
export function normalizeHora(value: unknown): string | null {
  const s = String(value ?? '').trim()
  const m = /^(\d{1,2}):(\d{2})/.exec(s)
  if (!m) return null
  const hh = Number(m[1])
  const mm = Number(m[2])
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function intervaloDoDia(parsedDate: Date): { inicio: Date; fim: Date } {
  const y = parsedDate.getFullYear()
  const m = parsedDate.getMonth()
  const d = parsedDate.getDate()
  return {
    inicio: new Date(y, m, d, 0, 0, 0, 0),
    fim: new Date(y, m, d, 23, 59, 59, 999),
  }
}

export function horariosOcupadosNormalizados(horas: string[]): string[] {
  const set = new Set<string>()
  for (const h of horas) {
    const n = normalizeHora(h)
    if (n) set.add(n)
  }
  return Array.from(set)
}
