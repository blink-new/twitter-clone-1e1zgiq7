import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'twitter-clone-1e1zgiq7',
  authRequired: true
})

export default blink