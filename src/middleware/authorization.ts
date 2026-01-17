import { FamilyRole } from '@prisma/client'
import { Context, Next } from 'hono'

import { prisma } from '@/lib/prisma'
import { AuthContext } from '@/middleware/auth'

export function requireFamilyRole(minRole: FamilyRole = 'USER') {
    return async (c: Context<AuthContext>, next: Next) => {
        const user = c.get('user')
        const familyId = c.req.param('id') || c.req.param('familyId')

        if (!familyId) {
            return c.json({ error: 'Family ID required' }, 400)
        }

        const userFamily = await prisma.userFamily.findUnique({
            where: {
                userId_familyId: {
                    userId: user.id,
                    familyId,
                },
            },
        })

        if (!userFamily) {
            return c.json({ error: 'You are not a member of this family' }, 403)
        }

        if (minRole === 'ADMIN' && userFamily.role !== 'ADMIN') {
            return c.json({ error: 'Admin privileges required' }, 403)
        }

        await next()
    }
}
