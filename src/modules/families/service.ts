import {
    createFamily,
    addUserToFamily,
    getFamilyWithTreeData,
    getUserFamilyRole,
} from '@/modules/families/repository'
import { CreateFamilyInput } from '@/modules/families/schemas'

export async function createNewFamily(data: CreateFamilyInput, userId: string) {
    return createFamily(data, userId)
}

export async function joinFamily(familyId: string, userId: string) {
    const role = await getUserFamilyRole(userId, familyId)
    if (role) {
        throw new Error('User is already a member of this family')
    }

    return addUserToFamily(userId, familyId, 'USER')
}

export async function getFamilyTree(familyId: string) {
    const familyData = await getFamilyWithTreeData(familyId)
    if (!familyData) throw new Error('Family not found')

    const persons = familyData.persons.map((p: (typeof familyData.persons)[number]) => ({
        id: p.id,
        firstName: p.firstName,
        lastName1: p.lastName1,
        lastName2: p.lastName2,
        isAlive: p.isAlive,
        birthDate: p.birthDate,
        deathDate: p.deathDate,
        photo: p.photos[0] || null,

        children: [] as string[],
        parents: [] as string[],
        spouses: [] as string[],
    }))

    const personMap = new Map<string, (typeof persons)[number]>(
        persons.map((p: (typeof persons)[number]) => [p.id, p]),
    )

    familyData.relations.forEach((rel: (typeof familyData.relations)[number]) => {
        const parent = personMap.get(rel.parentId)
        const child = personMap.get(rel.childId)

        if (parent && child) {
            parent.children.push(child.id)
            child.parents.push(parent.id)
        }
    })

    return {
        family: {
            id: familyData.id,
            name: familyData.name,
        },
        members: persons,
    }
}
