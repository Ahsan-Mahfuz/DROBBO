import { profileAdd, profileShow } from '../controllers/profile.controller.js'
import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'

const profileRoute = express.Router()

profileRoute.post('/addProfile', authMiddleware, profileAdd)
profileRoute.get('/profileShow', authMiddleware, profileShow)

export default profileRoute
