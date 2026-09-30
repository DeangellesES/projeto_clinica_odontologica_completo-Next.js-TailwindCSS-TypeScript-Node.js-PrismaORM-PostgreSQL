import { Router } from 'express'
import * as appointmentController from '../controllers/appointments.controller'

const router = Router()

router.post('/servico', appointmentController.create)
router.get('/servico', appointmentController.list)
router.put('/servico/:id', appointmentController.update)
router.delete('/servico/:id', appointmentController.remove)

export { router as appointmentsRouter }
