import { prisma } from '@/lib/prisma'

export async function createRelation(parentId: string, childId: string, familyId: string) {
    return prisma.personRelation.create({
        data: {
            parentId,
            childId,
            familyId,
        },
    })
}

export async function deleteRelation(parentId: string, childId: string) {
    return prisma.personRelation.delete({
        where: {
            parentId_childId: {
                parentId,
                childId,
            },
        },
    })
}

export async function getRelation(parentId: string, childId: string) {
    return prisma.personRelation.findUnique({
        where: {
            parentId_childId: {
                parentId,
                childId,
            },
        },
    })
}
