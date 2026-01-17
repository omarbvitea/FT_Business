import { Context } from 'hono'

import { AuthContext } from '@/middleware/auth'
import { createFamilySchema } from '@/modules/families/schemas'
import { createNewFamily, joinFamily, getFamilyTree } from '@/modules/families/service'

export async function createFamilyHandler(c: Context<AuthContext>) {
    const user = c.get('user')
    const body = await c.req.json()
    const data = createFamilySchema.parse(body)

    const family = await createNewFamily(data, user.id)

    return c.json(family, 201)
}

export async function joinFamilyHandler(c: Context<AuthContext>) {
    const user = c.get('user')
    const familyId = c.req.param('id')

    await joinFamily(familyId, user.id)

    return c.json({ message: 'Joined family successfully' })
}

export async function getFamilyTreeHandler(c: Context<AuthContext>) {
    const familyId = c.req.param('id')

    const tree = await getFamilyTree(familyId)

    return c.json(tree)
}
