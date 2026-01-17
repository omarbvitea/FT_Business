import { Hono } from 'hono'

import { requireAuth } from '@/middleware/auth'
import { requireFamilyRole } from '@/middleware/authorization'
import {
    createFamilyHandler,
    joinFamilyHandler,
    getFamilyTreeHandler,
} from '@/modules/families/controller'

const familyRoutes = new Hono()

familyRoutes.use('*', requireAuth)

familyRoutes.post('/', createFamilyHandler)
familyRoutes.post('/:id/join', joinFamilyHandler)
familyRoutes.get('/:id/tree', requireFamilyRole('USER'), getFamilyTreeHandler)

export default familyRoutes
