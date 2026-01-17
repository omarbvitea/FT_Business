import { Context } from 'hono'

import { AuthContext } from '@/middleware/auth'
import { getUserFamilyRole } from '@/modules/families/repository'
import { createPersonSchema, updatePersonSchema } from '@/modules/persons/schemas'
import {
    createNewPerson,
    updateExistingPerson,
    removePerson,
    getPersonDetails,
    getPersonFamily,
} from '@/modules/persons/service'

async function validatePersonAccess(
    c: Context<AuthContext>,
    personId: string,
    minRole: 'ADMIN' | 'USER' = 'USER',
) {
    const user = c.get('user')
    const familyId = await getPersonFamily(personId)

    if (!familyId) {
        throw new Error('Person not found')
    }

    const role = await getUserFamilyRole(user.id, familyId)

    if (!role) {
        throw new Error('You do not have access to this person')
    }

    if (minRole === 'ADMIN' && role !== 'ADMIN') {
        throw new Error('Admin privileges required')
    }

    return familyId
}

export async function createPersonHandler(c: Context<AuthContext>) {
    const familyId = c.req.param('id')
    const body = await c.req.json()
    const data = createPersonSchema.parse(body)

    const person = await createNewPerson(data, familyId)

    return c.json(person, 201)
}

export async function updatePersonHandler(c: Context<AuthContext>) {
    const id = c.req.param('id')
    await validatePersonAccess(c, id, 'ADMIN')

    const body = await c.req.json()
    const data = updatePersonSchema.parse(body)

    const person = await updateExistingPerson(id, data)

    return c.json(person)
}

export async function deletePersonHandler(c: Context<AuthContext>) {
    const id = c.req.param('id')
    await validatePersonAccess(c, id, 'ADMIN')

    await removePerson(id)

    return c.json({ message: 'Person deleted' })
}

export async function getPersonHandler(c: Context<AuthContext>) {
    const id = c.req.param('id')
    await validatePersonAccess(c, id, 'USER')

    const person = await getPersonDetails(id)

    return c.json(person)
}
