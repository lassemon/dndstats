import express, { json, urlencoded } from 'express'
import { RegisterRoutes } from './routes'

export const app = express()

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true
  })
)
app.use(json())

app.get('/dm_backend/', (req, res) => {
  console.log('req came')
  res.send({ message: 'Works222!' })
})

RegisterRoutes(app)
