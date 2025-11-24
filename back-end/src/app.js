import dotenv from 'dotenv'
dotenv.config() // Carrega as variáveis de ambiente do arquivo .env

import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

const app = express() 

import cors from 'cors'

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}))

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

// Rate limiter: limita a quantidade de requisições que cada usuário/IP
// pode efetuar dentro de um determinado intervalo de tempo
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 60 * 1000,    // Intervalo: 1 minuto
    limit: 20               // Máximo de 20 requisições
})

app.use(limiter)

/*********** ROTAS DA API **************/

// Rota raiz - informações da API (sem autenticação)
app.get('/', (req, res) => {
  res.json({
    message: 'Vulcom API',
    version: '1.0.0',
    endpoints: {
      cars: '/cars',
      customers: '/customers',
      users: '/users'
    }
  })
})

// Middleware de verificação do token de autorização
import auth from './middleware/auth.js'
app.use(auth)

import carsRouter from './routes/cars.js'
app.use('/cars', carsRouter)

import customersRouter from './routes/customers.js'
app.use('/customers', customersRouter)

import usersRouter from './routes/users.js'
app.use('/users', usersRouter)

export default app
