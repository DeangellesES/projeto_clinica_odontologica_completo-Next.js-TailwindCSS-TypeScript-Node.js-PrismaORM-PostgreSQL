import { Request, Response } from 'express'
import { prisma } from '../config/database'
import { HORARIOS_DISPONIVEIS } from '../constants/horarios'
import {
  horariosOcupadosNormalizados,
  intervaloDoDia,
  normalizeHora,
  parseDataAgendamento,
} from '../utils/appointment'

function firstQueryString(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '')
  if (value === undefined || value === null) return ''
  return String(value)
}

async function horarioJaOcupado(
  parsedDate: Date,
  horaNorm: string
): Promise<boolean> {
  const { inicio, fim } = intervaloDoDia(parsedDate)
  const agendamentos = await prisma.appointment.findMany({
    where: {
      data: { gte: inicio, lte: fim },
    },
    select: { hora: true },
  })

  return agendamentos.some((a) => normalizeHora(a.hora) === horaNorm)
}

export async function create(req: Request, res: Response) {
  const { servico, dentista, data, hora, nome, telefone } = req.body

  const campos = { servico, dentista, data, hora, nome, telefone }
  const faltando = Object.entries(campos)
    .filter(([, v]) => v === undefined || v === null || String(v).trim() === '')
    .map(([k]) => k)

  if (faltando.length > 0) {
    return res.status(400).json({
      error: 'Campos obrigatórios ausentes ou vazios',
      campos: faltando,
    })
  }

  const parsedDate = parseDataAgendamento(data)
  const horaNorm = normalizeHora(hora)

  if (!parsedDate) {
    return res.status(400).json({
      error: 'Data inválida',
    })
  }

  if (!horaNorm) {
    return res.status(400).json({
      error: 'Horário inválido',
    })
  }

  if (await horarioJaOcupado(parsedDate, horaNorm)) {
    return res.status(409).json({
      error: 'Este horário já está agendado na data selecionada',
    })
  }

  const appointment = await prisma.appointment.create({
    data: {
      servico: String(servico).trim(),
      dentista: String(dentista).trim(),
      data: parsedDate,
      hora: horaNorm,
      nome: String(nome).trim(),
      telefone: String(telefone).trim(),
    },
  })

  res.status(201).json(appointment)
}

export async function list(_req: Request, res: Response) {
  const appointments = await prisma.appointment.findMany({
    orderBy: { data: 'asc' },
  })
  res.json(appointments)
}

export async function update(req: Request, res: Response) {
  const { id } = req.params
  const { servico, dentista, data, hora, nome, telefone } = req.body

  const existing = await prisma.appointment.findUnique({ where: { id } })
  if (!existing) {
    return res.status(404).json({ error: 'Agendamento não encontrado' })
  }

  const parsedDate = data ? parseDataAgendamento(data) : existing.data
  const horaNorm = hora ? normalizeHora(hora) : existing.hora

  if (data && !parsedDate) {
    return res.status(400).json({ error: 'Data inválida' })
  }

  if (hora && !horaNorm) {
    return res.status(400).json({ error: 'Horário inválido' })
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      ...(servico && { servico: String(servico).trim() }),
      ...(dentista && { dentista: String(dentista).trim() }),
      ...(data && { data: parsedDate }),
      ...(hora && { hora: horaNorm }),
      ...(nome && { nome: String(nome).trim() }),
      ...(telefone && { telefone: String(telefone).trim() }),
    },
  })

  res.json(appointment)
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params

  const existing = await prisma.appointment.findUnique({ where: { id } })
  if (!existing) {
    return res.status(404).json({ error: 'Agendamento não encontrado' })
  }

  await prisma.appointment.delete({ where: { id } })
  res.status(204).send()
}

export async function disponibilidade(req: Request, res: Response) {
  const dataParam = firstQueryString(req.query.data)

  if (!dataParam) {
    return res.status(400).json({
      error: 'Parâmetro data é obrigatório',
    })
  }

  const parsedDate = parseDataAgendamento(dataParam)

  if (!parsedDate) {
    return res.status(400).json({ error: 'Data inválida' })
  }

  const { inicio, fim } = intervaloDoDia(parsedDate)

  const agendamentos = await prisma.appointment.findMany({
    where: {
      data: { gte: inicio, lte: fim },
    },
    select: { hora: true },
  })

  const horariosOcupados = horariosOcupadosNormalizados(
    agendamentos.map((a) => a.hora)
  )
  const horariosDisponiveis = HORARIOS_DISPONIVEIS.filter(
    (h) => !horariosOcupados.includes(h)
  )

  return res.json({
    data: dataParam,
    horariosDisponiveis,
    horariosOcupados,
  })
}
