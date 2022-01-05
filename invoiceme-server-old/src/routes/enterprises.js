import express from 'express'

import authMiddleware from '../middleware/auth'
import { getEnterprise, updateEnterprise } from '../controllers/enterprises'

const router = express.Router()

router.get('/', authMiddleware, getEnterprise)
router.patch('/', authMiddleware, updateEnterprise)

export default router
