import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

import { errorHandler } from '@/middleware/errorHandler'
import authRoutes from '@/modules/auth/routes'
import commentRoutes from '@/modules/comments/routes'
import familyRoutes from '@/modules/families/routes'
import { personRoutes, familyPersonRoutes } from '@/modules/persons/routes'
import relationRoutes from '@/modules/relations/routes'
import userRoutes from '@/modules/users/routes'

const app = new Hono()

app.use('*', logger())
app.use('*', secureHeaders())
app.use(
    '*',
    cors({
        origin: ['http://localhost:5173', 'http://localhost:3000', 'http://192.168.18.95:5173'],
        credentials: true,
    }),
)

app.route('/auth', authRoutes)
app.route('/users', userRoutes)
app.route('/families', familyRoutes)
app.route('/persons', personRoutes)
app.route('/families/:id/persons', familyPersonRoutes)
app.route('/relations', relationRoutes)
app.route('/persons/:id/comments', commentRoutes)
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.onError(errorHandler)

export default app
