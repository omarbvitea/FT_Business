import { prisma } from '@/lib/prisma'

export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
    })
}

export async function updateUser(
    id: string,
    data: { name?: string; email?: string; passwordHash?: string },
) {
    return prisma.user.update({
        where: { id },
        data,
    })
}

export async function getUserFamilies(userId: string) {
    return prisma.userFamily.findMany({
        where: { userId },
        include: {
            family: true,
        },
    })
}
