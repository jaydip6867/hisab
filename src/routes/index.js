import { Router } from 'express'
import transactionRoutes from './transaction.routes.js'
import drawingRoutes from './drawing.routes.js'

const router = Router()

router.use('/transactions', transactionRoutes)
router.use('/drawings', drawingRoutes)

export default router
