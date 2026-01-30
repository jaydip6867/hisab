import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { getLogin, postLogin, logout, seedUsers } from '../controllers/auth.controller.js'

const router = Router()

router.get('/login', getLogin)
router.post('/login', postLogin)
router.post('/logout', logout)
router.post('/auth/seed', seedUsers)

router.get('/', requireAuth, (_req, res) => {
  res.render('transactions', { title: 'Transactions' })
})

router.get('/transactions', requireAuth, (_req, res) => {
  res.render('transactions', { title: 'Transactions' })
})

router.get('/dashboard', requireAuth, (_req, res) => {
  res.render('dashboard', { title: 'Dashboard' })
})

export default router