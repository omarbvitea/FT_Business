import { FamilyRole } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export async function createFamily(data: { name: string }, creatorId: string) {
    return prisma.$transaction(async (tx) => {
        const family = await tx.family.create({
            data: {
                name: data.name,
            },
        })

        await tx.userFamily.create({
            data: {
                userId: creatorId,
                familyId: family.id,
                role: 'ADMIN',
            },
        })

        return family
    })
}

export async function addUserToFamily(userId: string, familyId: string, role: FamilyRole = 'USER') {
    return prisma.userFamily.create({
        data: {
            userId,
            familyId,
            role,
        },
    })
}

export async function getFamilyById(id: string) {
    return prisma.family.findUnique({
        where: { id },
    })
}

export async function getFamilyWithTreeData(familyId: string) {
    return prisma.family.findUnique({
        where: { id: familyId },
        include: {
            persons: {
                include: {
                    asParent: true,
                    asChild: true,
                },
            },
            relations: true,
        },
    })
}

export async function getUserFamilyRole(userId: string, familyId: string) {
    const userFamily = await prisma.userFamily.findUnique({
        where: {
            userId_familyId: {
                userId,
                familyId,
            },
        },
    })
    return userFamily?.role
}
