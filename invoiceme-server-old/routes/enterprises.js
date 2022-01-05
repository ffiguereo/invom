import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { getEnterprise, updateEnterprise } from '../controllers/enterprises.js'

const router = express.Router()

router.get('/', authMiddleware, getEnterprise)
router.patch('/', authMiddleware, updateEnterprise)

export default router
