import { z } from 'zod'

export const createRelationSchema = z.object({
    parentId: z.string().cuid(),
    childId: z.string().cuid(),
})

export type CreateRelationInput = z.infer<typeof createRelationSchema>
