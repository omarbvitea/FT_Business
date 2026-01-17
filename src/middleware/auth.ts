import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'

import { COOKIE_NAME } from '@/lib/constants'
import { validateSession } from '@/lib/session'

export type AuthContext = {
    Variables: {
        user: {
            id: string
            email: string
            name: string
        }
    }
}

export async function requireAuth(c: Context<AuthContext>, next: Next) {
    const sessionId = getCookie(c, COOKIE_NAME)

    if (!sessionId) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    const user = await validateSession(sessionId)

    if (!user) {
        return c.json({ error: 'Invalid or expired session' }, 401)
    }

    c.set('user', {
        id: user.id,
        email: user.email,
        name: user.name,
    })

    await next()
}
