import { TweetComposer } from '@/components/tweet/TweetComposer'
import { TweetCard } from '@/components/tweet/TweetCard'
import { DatabaseStatus } from '@/components/ui/database-status'
import { useTweets } from '@/hooks/useTweets'
import { Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HomeFeed() {
  const { tweets, loading, refreshTweets } = useTweets()

  return (
    <div className="flex-1 border-r border-gray-200 dark:border-gray-800 max-w-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Home</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshTweets}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Database Status Warning */}
      <div className="p-4">
        <DatabaseStatus />
      </div>

      {/* Tweet Composer */}
      <TweetComposer />

      {/* Feed */}
      <div>
        {loading && tweets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading tweets...</span>
            </div>
          </div>
        ) : tweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🐦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tweets to display
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Database is currently unavailable. Please check back later.
            </p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))
        )}
      </div>
    </div>
  )
}