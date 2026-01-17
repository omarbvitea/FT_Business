import bcrypt from 'bcrypt'

import { createSession, deleteSession, deleteUserSessions } from '@/lib/session'
import { createUser, findUserByEmail } from '@/modules/auth/repository'
import { RegisterInput, LoginInput } from '@/modules/auth/schemas'

export async function register(data: RegisterInput) {
    const existingUser = await findUserByEmail(data.email)
    if (existingUser) {
        throw new Error('User with this email already exists')
    }

    const user = await createUser(data)

    await deleteUserSessions(user.id)
    const sessionId = await createSession(user.id)

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        sessionId,
    }
}

export async function login(data: LoginInput) {
    const user = await findUserByEmail(data.email)
    if (!user) {
        throw new Error('Invalid credentials')
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash)
    if (!isValid) {
        throw new Error('Invalid credentials')
    }

    await deleteUserSessions(user.id)
    const sessionId = await createSession(user.id)

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        sessionId,
    }
}

export async function logout(sessionId: string) {
    await deleteSession(sessionId)
}
