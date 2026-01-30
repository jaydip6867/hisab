import { Router } from 'express'
import { validate } from '../middlewares/validate.js'
import { createTransactionSchema, updateTransactionSchema } from '../validators/transaction.schema.js'
import { listTransactions, createTransaction, getTransaction, updateTransaction, deleteTransaction, summaryStats } from '../controllers/transaction.controller.js'

const router = Router()

router.get('/', listTransactions)
router.post('/', validate(createTransactionSchema), createTransaction)
router.get('/summary', summaryStats)
router.get('/:id', getTransaction)
router.put('/:id', validate(updateTransactionSchema), updateTransaction)
router.delete('/:id', deleteTransaction)

export default router
