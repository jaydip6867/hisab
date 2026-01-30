import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export async function getLogin(req, res) {
  if (req.session && req.session.user) return res.redirect('/')
  res.render('login', { title: 'Login', error: null })
}

export async function postLogin(req, res) {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).render('login', { title: 'Login', error: 'Email and password are required' })
  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) return res.status(401).render('login', { title: 'Login', error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).render('login', { title: 'Login', error: 'Invalid credentials' })
  req.session.user = { id: user._id.toString(), email: user.email, name: user.name }
  res.redirect('/')
}

export function logout(req, res) {
  req.session?.destroy(() => {
    res.redirect('/login')
  })
}

export async function seedUsers(_req, res) {
  try {
    const users = [
      { email: 'jaydip@gmail.com', name: 'Jaydip', password: 'cdadajan26' },
      { email: 'mishal@gmail.com', name: 'Mishal', password: 'cdadajan26' },
    ]
    const results = []
    for (const u of users) {
      const existing = await User.findOne({ email: u.email })
      if (existing) { results.push({ email: u.email, status: 'exists' }); continue }
      const passwordHash = await bcrypt.hash(u.password, 10)
      await User.create({ email: u.email, name: u.name, passwordHash })
      results.push({ email: u.email, status: 'created' })
    }
    res.status(201).json({ ok: true, results })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
}
