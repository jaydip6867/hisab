import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes/index.js'
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js'
import path from 'path'
import { fileURLToPath } from 'url'
import webRoutes from './routes/web.routes.js'
import session from 'express-session'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}))
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null
  next()
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/', webRoutes)
app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app