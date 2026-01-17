import { getPersonFamily } from '@/modules/persons/service'
import { createRelation, getRelation } from '@/modules/relations/repository'
import { CreateRelationInput } from '@/modules/relations/schemas'

export async function createNewRelation(data: CreateRelationInput) {
    const parentFamilyId = await getPersonFamily(data.parentId)
    const childFamilyId = await getPersonFamily(data.childId)

    if (!parentFamilyId || !childFamilyId) {
        throw new Error('One or both persons not found')
    }

    if (parentFamilyId !== childFamilyId) {
        throw new Error('Persons must belong to the same family')
    }

    const existing = await getRelation(data.parentId, data.childId)
    if (existing) {
        throw new Error('Relation already exists')
    }

    if (data.parentId === data.childId) {
        throw new Error('Cannot be parent of oneself')
    }

    return createRelation(data.parentId, data.childId, parentFamilyId)
}
