import { Router } from 'express'
import { validate } from '../middlewares/validate.js'
import { createDrawingSchema, updateDrawingSchema } from '../validators/drawing.schema.js'
import { listDrawings, createDrawing, deleteDrawing, summaryDrawings } from '../controllers/drawing.controller.js'

const router = Router()

router.get('/', listDrawings)
router.get('/summary', summaryDrawings)
router.post('/', validate(createDrawingSchema), createDrawing)
router.delete('/:id', deleteDrawing)

export default router
