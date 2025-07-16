import { useState, useEffect } from 'react'
import { Tweet, User } from '@/types'
import blink from '@/blink/client'

export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)

  const loadTweets = async () => {
    try {
      setLoading(true)
      
      // Get all tweets with user data
      const tweetsData = await blink.db.tweets.list({
        orderBy: { createdAt: 'desc' },
        limit: 50
      })

      // Get all unique user IDs
      const userIds = [...new Set(tweetsData.map(tweet => tweet.userId))]
      
      // Get user data for all tweets
      const usersData = await blink.db.users.list({
        where: {
          OR: userIds.map(id => ({ id }))
        }
      })

      // Create user lookup map
      const userMap = new Map<string, User>()
      usersData.forEach(user => userMap.set(user.id, user))

      // Get current user for like/retweet status
      const currentUser = await blink.auth.me()
      let userLikes: string[] = []
      let userRetweets: string[] = []

      if (currentUser) {
        const likes = await blink.db.likes.list({
          where: { userId: currentUser.id }
        })
        const retweets = await blink.db.retweets.list({
          where: { userId: currentUser.id }
        })
        
        userLikes = likes.map(like => like.tweetId)
        userRetweets = retweets.map(retweet => retweet.tweetId)
      }

      // Combine tweets with user data and interaction status
      const enrichedTweets: Tweet[] = tweetsData.map(tweet => ({
        ...tweet,
        user: userMap.get(tweet.userId),
        isLiked: userLikes.includes(tweet.id),
        isRetweeted: userRetweets.includes(tweet.id)
      }))

      setTweets(enrichedTweets)
    } catch (error) {
      console.error('Error loading tweets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTweet = async (content: string, imageUrl?: string) => {
    try {
      const currentUser = await blink.auth.me()
      if (!currentUser) throw new Error('User not authenticated')

      const newTweet = {
        id: `tweet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        content,
        imageUrl: imageUrl || '',
        likesCount: 0,
        retweetsCount: 0,
        repliesCount: 0
      }

      await blink.db.tweets.create(newTweet)
      
      // Update user's tweet count
      const userProfile = await blink.db.users.list({
        where: { id: currentUser.id },
        limit: 1
      })
      
      if (userProfile.length > 0) {
        await blink.db.users.update(currentUser.id, {
          tweetsCount: userProfile[0].tweetsCount + 1
        })
      }

      // Publish real-time update
      await blink.realtime.publish('tweets', 'tweet_created', {
        tweetId: newTweet.id,
        userId: currentUser.id
      })
      
      // Reload tweets to show the new one
      await loadTweets()
      
      return newTweet
    } catch (error) {
      console.error('Error creating tweet:', error)
      throw error
    }
  }

  const toggleLike = async (tweetId: string) => {
    try {
      const currentUser = await blink.auth.me()
      if (!currentUser) throw new Error('User not authenticated')

      // Check if already liked
      const existingLike = await blink.db.likes.list({
        where: {
          AND: [
            { userId: currentUser.id },
            { tweetId }
          ]
        },
        limit: 1
      })

      const tweet = tweets.find(t => t.id === tweetId)
      if (!tweet) return

      if (existingLike.length > 0) {
        // Unlike
        await blink.db.likes.delete(existingLike[0].id)
        await blink.db.tweets.update(tweetId, {
          likesCount: Math.max(0, tweet.likesCount - 1)
        })
      } else {
        // Like
        await blink.db.likes.create({
          id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUser.id,
          tweetId
        })
        await blink.db.tweets.update(tweetId, {
          likesCount: tweet.likesCount + 1
        })
      }

      // Publish real-time update
      await blink.realtime.publish('tweets', 'tweet_updated', {
        tweetId,
        action: existingLike.length > 0 ? 'unliked' : 'liked',
        userId: currentUser.id
      })

      // Reload tweets to reflect changes
      await loadTweets()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const toggleRetweet = async (tweetId: string) => {
    try {
      const currentUser = await blink.auth.me()
      if (!currentUser) throw new Error('User not authenticated')

      // Check if already retweeted
      const existingRetweet = await blink.db.retweets.list({
        where: {
          AND: [
            { userId: currentUser.id },
            { tweetId }
          ]
        },
        limit: 1
      })

      const tweet = tweets.find(t => t.id === tweetId)
      if (!tweet) return

      if (existingRetweet.length > 0) {
        // Un-retweet
        await blink.db.retweets.delete(existingRetweet[0].id)
        await blink.db.tweets.update(tweetId, {
          retweetsCount: Math.max(0, tweet.retweetsCount - 1)
        })
      } else {
        // Retweet
        await blink.db.retweets.create({
          id: `retweet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUser.id,
          tweetId
        })
        await blink.db.tweets.update(tweetId, {
          retweetsCount: tweet.retweetsCount + 1
        })
      }

      // Publish real-time update
      await blink.realtime.publish('tweets', 'tweet_updated', {
        tweetId,
        action: existingRetweet.length > 0 ? 'unretweeted' : 'retweeted',
        userId: currentUser.id
      })

      // Reload tweets to reflect changes
      await loadTweets()
    } catch (error) {
      console.error('Error toggling retweet:', error)
    }
  }

  useEffect(() => {
    loadTweets()

    // Set up real-time updates
    const unsubscribe = blink.realtime.subscribe('tweets', (message) => {
      if (message.type === 'tweet_created' || message.type === 'tweet_updated') {
        // Refresh tweets when there are updates
        loadTweets()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    tweets,
    loading,
    createTweet,
    toggleLike,
    toggleRetweet,
    refreshTweets: loadTweets
  }
}