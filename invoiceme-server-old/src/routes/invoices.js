import express from 'express'

import authMiddleware from '../middleware/auth'
import {
    getInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    addInvoiceItem,
    deleteInvoiceItem,
    updateInvoiceItem,
    addInvoicePayment,
    deleteInvoicePayment,
    updateInvoicePayment
} from '../controllers/invoices'

const router = express.Router()

router.get('/:id', authMiddleware, getInvoice)
router.get('/', authMiddleware, getInvoices)
router.post('/', authMiddleware, createInvoice)
router.patch('/:id', authMiddleware, updateInvoice)
router.delete('/:id', authMiddleware, deleteInvoice)
router.post('/:id/items', authMiddleware, addInvoiceItem)
router.patch('/:id/items/:itemId', authMiddleware, updateInvoiceItem)
router.delete('/:id/items/:itemId', authMiddleware, deleteInvoiceItem)
router.post('/:id/payments', authMiddleware, addInvoicePayment)
router.patch('/:id/payments/:paymentId', authMiddleware, updateInvoicePayment)
router.delete('/:id/payments/:paymentId', authMiddleware, deleteInvoicePayment)

export default router
