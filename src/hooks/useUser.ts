import { useState, useEffect } from 'react'
import { User } from '@/types'
import blink from '@/blink/client'

export function useUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.user) {
        try {
          // Check if user profile exists in our database
          const existingUsers = await blink.db.users.list({
            where: { id: state.user.id },
            limit: 1
          })

          if (existingUsers.length === 0) {
            // Create user profile if it doesn't exist
            const username = state.user.email?.split('@')[0] || `user_${Date.now()}`
            const newUser: Omit<User, 'createdAt' | 'updatedAt'> = {
              id: state.user.id,
              email: state.user.email || '',
              displayName: state.user.displayName || username,
              username: username,
              bio: '',
              avatarUrl: state.user.photoURL || '',
              verified: false,
              followersCount: 0,
              followingCount: 0,
              tweetsCount: 0
            }

            await blink.db.users.create(newUser)
            setCurrentUser({
              ...newUser,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          } else {
            setCurrentUser(existingUsers[0])
          }
        } catch (error) {
          console.error('Error setting up user:', error)
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(state.isLoading)
    })

    return unsubscribe
  }, [])

  return { currentUser, loading }
}