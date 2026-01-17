import { Context } from 'hono'
import { setCookie, deleteCookie, getCookie } from 'hono/cookie'

import { COOKIE_NAME, SESSION_EXPIRATION_SECONDS } from '@/lib/constants'
import { AuthContext } from '@/middleware/auth'
import { registerSchema, loginSchema } from '@/modules/auth/schemas'
import { register, login, logout } from '@/modules/auth/service'

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_EXPIRATION_SECONDS,
    path: '/',
}

export async function registerHandler(c: Context) {
    const body = await c.req.json()
    const data = registerSchema.parse(body)

    const result = await register(data)

    setCookie(c, 'session_id', result.sessionId, COOKIE_OPTIONS)

    return c.json({
        user: result.user,
    })
}

export async function loginHandler(c: Context) {
    const body = await c.req.json()
    const data = loginSchema.parse(body)

    const result = await login(data)

    setCookie(c, 'session_id', result.sessionId, COOKIE_OPTIONS)

    return c.json({
        user: result.user,
    })
}

export async function logoutHandler(c: Context) {
    const sessionId = getCookie(c, COOKIE_NAME)!

    await logout(sessionId)
    deleteCookie(c, COOKIE_NAME, { path: '/' })

    return c.json({ message: 'Logged out successfully' })
}

export async function getMeHandler(c: Context<AuthContext>) {
    const user = c.get('user')

    return c.json({ user })
}
