import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Tweet } from '@/types'
import { useTweets } from '@/hooks/useTweets'

interface TweetCardProps {
  tweet: Tweet
}

export function TweetCard({ tweet }: TweetCardProps) {
  const { toggleLike, toggleRetweet } = useTweets()

  const handleLike = async () => {
    await toggleLike(tweet.id)
  }

  const handleRetweet = async () => {
    await toggleRetweet(tweet.id)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={tweet.user?.avatarUrl || "/placeholder-avatar.jpg"} />
          <AvatarFallback>{tweet.user?.displayName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">
              {tweet.user?.displayName || 'Unknown User'}
            </h3>
            {tweet.user?.verified && (
              <div className="w-5 h-5 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            <span className="text-gray-500 dark:text-gray-400 truncate">
              @{tweet.user?.username || 'unknown'}
            </span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
            </span>
            <div className="ml-auto">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 p-1">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {tweet.content}
            </p>
            
            {tweet.imageUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={tweet.imageUrl}
                  alt="Tweet image"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3 max-w-md">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-500 hover:text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-950 p-2 rounded-full"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{formatNumber(tweet.repliesCount)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetweet}
              className={`flex items-center space-x-2 p-2 rounded-full ${
                tweet.isRetweeted
                  ? 'text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950'
                  : 'text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950'
              }`}
            >
              <Repeat2 className="h-5 w-5" />
              <span className="text-sm">{formatNumber(tweet.retweetsCount)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 p-2 rounded-full ${
                tweet.isLiked
                  ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950'
              }`}
            >
              <Heart className={`h-5 w-5 ${tweet.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{formatNumber(tweet.likesCount)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-500 hover:text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-950 p-2 rounded-full"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}