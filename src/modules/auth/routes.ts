import { Hono } from 'hono'

import { requireAuth } from '@/middleware/auth'
import {
    registerHandler,
    loginHandler,
    logoutHandler,
    getMeHandler,
} from '@/modules/auth/controller'

const authRoutes = new Hono()

authRoutes.post('/register', registerHandler)
authRoutes.post('/login', loginHandler)
authRoutes.post('/logout', requireAuth, logoutHandler)
authRoutes.get('/me', requireAuth, getMeHandler)

export default authRoutes
