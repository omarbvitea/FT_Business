import { Context } from 'hono'
import { ZodError } from 'zod'

export async function errorHandler(err: Error, c: Context) {
    console.error('Error:', err)

    if (err instanceof ZodError) {
        return c.json(
            {
                error: 'Validation error',
                details: err.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            },
            400,
        )
    }

    return c.json(
        {
            error: err.message || 'Internal server error',
        },
        500,
    )
}
