import express from 'express'
import cors from 'cors'
import { router } from './routes'
import { errorHandler } from './middlewares/error-handler'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' })
})

app.use(router)

app.use(errorHandler)

export { app }
