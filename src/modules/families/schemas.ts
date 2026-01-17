import { z } from 'zod'

export const createFamilySchema = z.object({
    name: z.string().min(2, 'Family name must be at least 2 characters'),
})

export const joinFamilySchema = z.object({
    userId: z.string().uuid().optional(),
})

export type CreateFamilyInput = z.infer<typeof createFamilySchema>
