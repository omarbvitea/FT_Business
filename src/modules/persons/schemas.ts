import { z } from 'zod'

export const createPersonSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName1: z.string().min(1, 'First last name is required'),
    lastName2: z.string().optional(),
    isAlive: z.boolean().default(true),
    birthDate: z
        .string()
        .datetime({ offset: true })
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    deathDate: z
        .string()
        .datetime({ offset: true })
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    profession: z.string().optional(),
    description: z.string().optional(),
    photos: z.array(z.string().url()).max(3, 'Maximum 3 photos allowed').optional(),
})

export const updatePersonSchema = createPersonSchema.partial()

export type CreatePersonInput = z.infer<typeof createPersonSchema>
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>
