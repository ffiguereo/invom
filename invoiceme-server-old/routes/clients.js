import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {
    getClient,
    getClients,
    createClient,
    updateClient,
    deleteClient,
    createClientAddress,
    updateClientAddress,
    deleteClientAddress,
} from '../controllers/clients.js'

const router = express.Router()

router.get('/', authMiddleware, getClients)
router.get('/:id', authMiddleware, getClient)
router.post('/', authMiddleware, createClient)
router.patch('/:id', authMiddleware, updateClient)
router.delete('/:id', authMiddleware, deleteClient)

router.post('/:clientId/address', authMiddleware, createClientAddress)
router.patch('/:clientId/address/:addressId', authMiddleware, updateClientAddress)
router.delete('/:clientId/address/:addressId', authMiddleware, deleteClientAddress)

export default router
