import { Router } from 'express'
import { register, login } from '../services/auth.service'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, inviteCode } = req.body

    if (!nome || !email || !senha || !inviteCode) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' })
    }

    const result = await register(nome, email, senha, inviteCode)
    res.status(201).json(result)
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    const result = await login(email, senha)
    res.json(result)
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message })
  }
})

export { router as authRouter }
