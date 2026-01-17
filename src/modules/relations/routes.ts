import { Hono } from 'hono'

import { requireAuth } from '@/middleware/auth'
import { createRelationHandler } from '@/modules/relations/controller'

const relationRoutes = new Hono()

relationRoutes.use('*', requireAuth)
relationRoutes.post('/', createRelationHandler)

export default relationRoutes
