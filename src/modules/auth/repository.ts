import bcrypt from 'bcrypt'

import { prisma } from '@/lib/prisma'

export async function createUser(data: { email: string; password: string; name: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10)

    return prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            name: data.name,
        },
    })
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    })
}

export async function findUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
    })
}
