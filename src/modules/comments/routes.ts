import { Hono } from 'hono'

import { requireAuth } from '@/middleware/auth'
import { createCommentHandler, getCommentsHandler } from '@/modules/comments/controller'

const commentRoutes = new Hono()

commentRoutes.use('*', requireAuth)

commentRoutes.post('/', createCommentHandler)
commentRoutes.get('/', getCommentsHandler)

export default commentRoutes
