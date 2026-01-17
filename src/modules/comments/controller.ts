import { Context } from 'hono'

import { AuthContext } from '@/middleware/auth'
import { createCommentSchema } from '@/modules/comments/schemas'
import { addComment, getPersonComments } from '@/modules/comments/service'
import { getUserFamilyRole } from '@/modules/families/repository'
import { getPersonFamily } from '@/modules/persons/service'

async function validateCommentAccess(c: Context<AuthContext>, personId: string) {
    const user = c.get('user')
    const familyId = await getPersonFamily(personId)

    if (!familyId) {
        throw new Error('Person not found')
    }

    const role = await getUserFamilyRole(user.id, familyId)

    if (!role) {
        throw new Error('You do not have access to this family')
    }
}

export async function createCommentHandler(c: Context<AuthContext>) {
    const user = c.get('user')
    const personId = c.req.param('id')

    await validateCommentAccess(c, personId)

    const body = await c.req.json()
    const data = createCommentSchema.parse(body)

    const comment = await addComment(user.id, personId, data.text)

    return c.json(comment, 201)
}

export async function getCommentsHandler(c: Context<AuthContext>) {
    const personId = c.req.param('id')

    await validateCommentAccess(c, personId)

    const comments = await getPersonComments(personId)

    return c.json(comments)
}
