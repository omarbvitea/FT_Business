import {
    createPerson,
    updatePerson,
    deletePerson,
    getPersonById,
    getPersonFamilyId,
} from '@/modules/persons/repository'
import { CreatePersonInput, UpdatePersonInput } from '@/modules/persons/schemas'

export async function personExists(id: string) {
    const person = await getPersonById(id)
    return !!person
}

export async function createNewPerson(data: CreatePersonInput, familyId: string) {
    return createPerson(data, familyId)
}

export async function updateExistingPerson(id: string, data: UpdatePersonInput) {
    const exists = await personExists(id)
    if (!exists) throw new Error('Person not found')

    return updatePerson(id, data)
}

export async function removePerson(id: string) {
    const exists = await personExists(id)
    if (!exists) throw new Error('Person not found')

    return deletePerson(id)
}

export async function getPersonDetails(id: string) {
    const person = await getPersonById(id)
    if (!person) throw new Error('Person not found')

    return person
}

export async function getPersonFamily(id: string) {
    return getPersonFamilyId(id)
}
