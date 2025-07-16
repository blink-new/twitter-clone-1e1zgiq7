import { useState } from 'react'
import { Image, Smile, Calendar, MapPin, BarChart3, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/hooks/useUser'
import { useTweets } from '@/hooks/useTweets'
import { useToast } from '@/hooks/use-toast'

export function TweetComposer() {
  const [tweetText, setTweetText] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const { currentUser } = useUser()
  const { createTweet } = useTweets()
  const { toast } = useToast()
  const maxLength = 280

  const handleTweet = async () => {
    if (!tweetText.trim() || isPosting) return

    try {
      setIsPosting(true)
      await createTweet(tweetText.trim())
      setTweetText('')
      toast({
        title: "Tweet posted!",
        description: "Your tweet has been shared successfully.",
      })
    } catch (error) {
      console.error('Error posting tweet:', error)
      toast({
        title: "Error",
        description: "Failed to post tweet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4">
      <div className="flex space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={currentUser?.avatarUrl || "/placeholder-avatar.jpg"} />
          <AvatarFallback>{currentUser?.displayName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder="What's happening?"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            className="border-none resize-none text-xl placeholder:text-gray-500 focus-visible:ring-0 p-0"
            rows={3}
            maxLength={maxLength}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-950 p-2">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-950 p-2">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-950 p-2">
                <Calendar className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-950 p-2">
                <MapPin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-950 p-2">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full border-2 ${
                  tweetText.length > maxLength * 0.9 ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${(tweetText.length / maxLength) * 88} 88`}
                      className={tweetText.length > maxLength * 0.9 ? 'text-red-500' : 'text-[#1DA1F2]'}
                    />
                  </svg>
                </div>
                {tweetText.length > maxLength * 0.8 && (
                  <span className={`text-sm ${
                    tweetText.length > maxLength ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {maxLength - tweetText.length}
                  </span>
                )}
              </div>
              
              <Button
                onClick={handleTweet}
                disabled={!tweetText.trim() || tweetText.length > maxLength || isPosting}
                className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Posting...
                  </>
                ) : (
                  'Tweet'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}