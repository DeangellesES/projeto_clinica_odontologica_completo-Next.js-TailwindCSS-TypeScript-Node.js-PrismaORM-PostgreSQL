import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { env } from '../config/env'

interface AuthResult {
  user: { id: string; nome: string; email: string; role: string }
  token: string
}

export async function register(
  nome: string,
  email: string,
  senha: string,
  inviteCode: string
): Promise<AuthResult> {
  if (inviteCode !== env.inviteCode) {
    throw new AppError('Código de convite inválido', 403)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new AppError('Email já cadastrado', 409)
  }

  const senhaHash = await bcrypt.hash(senha, 10)

  const user = await prisma.user.create({
    data: { nome, email, senha: senhaHash },
  })

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: '7d' }
  )

  return {
    user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    token,
  }
}

export async function login(
  email: string,
  senha: string
): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new AppError('Email ou senha inválidos', 401)
  }

  const senhaValida = await bcrypt.compare(senha, user.senha)
  if (!senhaValida) {
    throw new AppError('Email ou senha inválidos', 401)
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: '7d' }
  )

  return {
    user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    token,
  }
}

export function verifyToken(token: string): { id: string; email: string; role: string } {
  return jwt.verify(token, env.jwtSecret) as { id: string; email: string; role: string }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
  }
}
