import { Hono } from 'hono'

import { requireAuth } from '@/middleware/auth'
import { requireFamilyRole } from '@/middleware/authorization'
import {
    createPersonHandler,
    updatePersonHandler,
    deletePersonHandler,
    getPersonHandler,
} from '@/modules/persons/controller'

const personRoutes = new Hono()
const familyPersonRoutes = new Hono()

personRoutes.use('*', requireAuth)
personRoutes.get('/:id', getPersonHandler)
personRoutes.patch('/:id', updatePersonHandler)
personRoutes.delete('/:id', deletePersonHandler)

familyPersonRoutes.use('*', requireAuth)
familyPersonRoutes.post('/', requireFamilyRole('ADMIN'), createPersonHandler)

export { personRoutes, familyPersonRoutes }
