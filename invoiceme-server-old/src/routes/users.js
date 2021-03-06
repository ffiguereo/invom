import express from 'express'

import authMiddleware from '../middleware/auth'
import { getUsers, createUser, updateUser, deleteUser, getUser } from '../controllers/users'

const router = express.Router()

router.get('/:id', authMiddleware, getUser)
router.get('/', authMiddleware, getUsers)
router.post('/', authMiddleware, createUser)
router.patch('/:id', authMiddleware, updateUser)
router.delete('/:id', authMiddleware, deleteUser)

export default router
