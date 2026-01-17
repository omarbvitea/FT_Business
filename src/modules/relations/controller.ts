import { Context } from 'hono'

import { AuthContext } from '@/middleware/auth'
import { getUserFamilyRole } from '@/modules/families/repository'
import { getPersonFamily } from '@/modules/persons/service'
import { createRelationSchema } from '@/modules/relations/schemas'
import { createNewRelation } from '@/modules/relations/service'

export async function createRelationHandler(c: Context<AuthContext>) {
    const user = c.get('user')
    const body = await c.req.json()
    const data = createRelationSchema.parse(body)

    const familyId = await getPersonFamily(data.parentId)

    if (!familyId) {
        return c.json({ error: 'Person not found' }, 404)
    }

    const role = await getUserFamilyRole(user.id, familyId)

    if (role !== 'ADMIN') {
        return c.json({ error: 'Admin privileges required' }, 403)
    }

    const relation = await createNewRelation(data)

    return c.json(relation, 201)
}
