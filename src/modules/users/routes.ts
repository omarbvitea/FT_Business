import { Hono } from 'hono'

import { requireAuth } from '@/middleware/auth'
import {
    getProfileHandler,
    updateProfileHandler,
    getFamiliesHandler,
} from '@/modules/users/controller'

const userRoutes = new Hono()

userRoutes.use('*', requireAuth)

userRoutes.get('/profile', getProfileHandler)
userRoutes.patch('/profile', updateProfileHandler)
userRoutes.get('/families', getFamiliesHandler)

export default userRoutes
