import { createComment, getCommentsByPerson } from '@/modules/comments/repository'

export async function addComment(userId: string, personId: string, text: string) {
    return createComment(userId, personId, text)
}

export async function getPersonComments(personId: string) {
    return getCommentsByPerson(personId)
}
