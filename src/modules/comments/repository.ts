import { prisma } from '@/lib/prisma.js'

export async function createComment(userId: string, personId: string, text: string) {
    return prisma.comment.create({
        data: {
            userId,
            personId,
            text,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })
}

export async function getCommentsByPerson(personId: string) {
    return prisma.comment.findMany({
        where: { personId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
}
