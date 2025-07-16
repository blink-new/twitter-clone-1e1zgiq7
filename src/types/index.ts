export interface User {
  id: string
  email: string
  displayName: string
  username: string
  bio?: string
  avatarUrl?: string
  verified?: boolean
  followersCount: number
  followingCount: number
  tweetsCount: number
  createdAt: string
  updatedAt: string
}

export interface Tweet {
  id: string
  userId: string
  content: string
  imageUrl?: string
  likesCount: number
  retweetsCount: number
  repliesCount: number
  createdAt: string
  updatedAt: string
  user?: User
  isLiked?: boolean
  isRetweeted?: boolean
}

export interface Like {
  id: string
  userId: string
  tweetId: string
  createdAt: string
}

export interface Retweet {
  id: string
  userId: string
  tweetId: string
  createdAt: string
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}