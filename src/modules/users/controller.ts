import { Context } from 'hono'

import { AuthContext } from '@/middleware/auth'
import { updateUserSchema } from '@/modules/users/schemas'
import { getUser, updateUserDetails, getUserFamilyMemberships } from '@/modules/users/service'

export async function getProfileHandler(c: Context<AuthContext>) {
    const user = c.get('user')
    const userProfile = await getUser(user.id)

    return c.json(userProfile)
}

export async function updateProfileHandler(c: Context<AuthContext>) {
    const user = c.get('user')
    const body = await c.req.json()
    const data = updateUserSchema.parse(body)

    const updatedUser = await updateUserDetails(user.id, data)

    return c.json(updatedUser)
}

export async function getFamiliesHandler(c: Context<AuthContext>) {
    const user = c.get('user')
    const families = await getUserFamilyMemberships(user.id)

    return c.json(families)
}
