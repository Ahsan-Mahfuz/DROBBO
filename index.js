import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dbConnection from './config/db.js'
import authRoute from './routes/auth.route.js'
import productRoute from './routes/product.route.js'
import cookieParser from 'cookie-parser'
import profileRoute from './routes/profile.route.js'

import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const PORT = process.env.PORT
const app = express()

app.use(express.json({ limit: '50mb' })) // You can adjust the size as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(
  cors({
    origin: 'http://localhost:5173', // React frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)
app.use(cookieParser())

app.use('/api/sign-login-logout', authRoute)
app.use('/api/sign-login-logout', productRoute)
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))
app.use('/api/sign-login-logout', profileRoute)
app.use('/profilePicture', express.static(path.resolve(__dirname, 'profilePicture')))

app.listen(5000, () => {
  dbConnection()
  console.log(`Mongoose server listening on PORT ${PORT}`)
})
