import { signUp, login, logout } from '../controllers/auth.controller.js'
import express from 'express'
const authRoute = express.Router()

authRoute.post('/signup', signUp)
authRoute.post('/login', login)
authRoute.post('/logout', logout)

export default authRoute
