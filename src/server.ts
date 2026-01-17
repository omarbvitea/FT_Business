import 'dotenv/config'
import { serve } from '@hono/node-server'

import app from '@/app'
import { cleanupExpiredSessions } from '@/lib/session'

setInterval(
    () => {
        cleanupExpiredSessions().catch(console.error)
    },
    1000 * 60 * 60,
)

const port = Number(process.env.PORT) || 3000

console.log(`
🌳 Family Tree Backend API
🚀 Server is running on port ${port}
`)

serve({
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0',
})
