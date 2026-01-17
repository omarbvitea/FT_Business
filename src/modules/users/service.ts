import bcrypt from 'bcrypt'

import { getUserById, updateUser, getUserFamilies } from '@/modules/users/repository'
import { UpdateUserInput } from '@/modules/users/schemas'

export async function getUser(userId: string) {
    const user = await getUserById(userId)
    if (!user) return null

    const { passwordHash: _, ...safeUser } = user
    return safeUser
}

export async function updateUserDetails(userId: string, data: UpdateUserInput) {
    const { password, ...otherData } = data
    const updateData: { name?: string; email?: string; passwordHash?: string } = { ...otherData }

    if (password) {
        updateData.passwordHash = await bcrypt.hash(password, 10)
    }

    const user = await updateUser(userId, updateData)

    const { passwordHash: _, ...safeUser } = user
    return safeUser
}

export async function getUserFamilyMemberships(userId: string) {
    return getUserFamilies(userId)
}
