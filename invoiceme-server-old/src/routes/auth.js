import express from 'express'

import authMiddleware from '../middleware/auth'
import { signIn, signup, me } from '../controllers/auth'

const router = express.Router()

router.get('/me', authMiddleware, me)
router.post('/sign-in', signIn)
router.post('/sign-up', signup)

export default router
