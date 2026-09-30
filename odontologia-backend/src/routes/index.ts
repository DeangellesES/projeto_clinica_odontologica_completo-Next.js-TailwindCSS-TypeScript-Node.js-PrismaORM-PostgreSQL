import { Router } from 'express'
import { appointmentsRouter } from './appointments'
import { authRouter } from './auth'
import { authenticate } from '../middlewares/auth'
import * as appointmentController from '../controllers/appointments.controller'

const router = Router()

router.use('/auth', authRouter)
router.get('/appointments/disponibilidade', appointmentController.disponibilidade)
router.use('/appointments', authenticate, appointmentsRouter)

export { router }
