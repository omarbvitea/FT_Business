import { prisma } from '@/lib/prisma'
import { CreatePersonInput, UpdatePersonInput } from '@/modules/persons/schemas'

export async function createPerson(data: CreatePersonInput, familyId: string) {
    return prisma.person.create({
        data: {
            ...data,
            familyId,
        },
    })
}

export async function updatePerson(id: string, data: UpdatePersonInput) {
    return prisma.person.update({
        where: { id },
        data,
    })
}

export async function deletePerson(id: string) {
    return prisma.person.delete({
        where: { id },
    })
}

export async function getPersonById(id: string) {
    return prisma.person.findUnique({
        where: { id },
        include: {
            asParent: {
                include: { child: true },
            },
            asChild: {
                include: { parent: true },
            },
        },
    })
}

export async function getPersonFamilyId(id: string) {
    const person = await prisma.person.findUnique({
        where: { id },
        select: { familyId: true },
    })
    return person?.familyId
}
