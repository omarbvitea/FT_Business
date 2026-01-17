import crypto from 'crypto'

import { SESSION_EXPIRATION_DAYS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export async function createSession(userId: string): Promise<string> {
    const sessionId = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRATION_DAYS)

    await prisma.session.create({
        data: {
            id: sessionId,
            userId,
            expiresAt,
        },
    })

    return sessionId
}

export async function validateSession(sessionId: string) {
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
    })

    if (!session) {
        return null
    }

    if (session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: sessionId } })
        return null
    }

    return session.user
}

export async function deleteSession(sessionId: string): Promise<void> {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
}

export async function deleteUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
        where: { userId },
    })
}

export async function cleanupExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
        where: {
            expiresAt: {
                lt: new Date(),
            },
        },
    })
}
