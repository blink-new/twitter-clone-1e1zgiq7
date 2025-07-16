import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const trendingTopics = [
  { topic: '#ReactJS', tweets: '125K Tweets' },
  { topic: '#TypeScript', tweets: '89K Tweets' },
  { topic: '#WebDevelopment', tweets: '67K Tweets' },
  { topic: '#JavaScript', tweets: '234K Tweets' },
  { topic: '#TailwindCSS', tweets: '45K Tweets' },
]

const whoToFollow = [
  { name: 'React', username: 'reactjs', avatar: '/react-avatar.jpg' },
  { name: 'Vercel', username: 'vercel', avatar: '/vercel-avatar.jpg' },
  { name: 'Tailwind CSS', username: 'tailwindcss', avatar: '/tailwind-avatar.jpg' },
]

export function RightSidebar() {
  return (
    <div className="w-80 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search Twitter"
          className="pl-12 bg-gray-100 dark:bg-gray-900 border-none rounded-full"
        />
      </div>

      {/* What's happening */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">What's happening</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((trend, index) => (
            <div key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900 p-2 rounded cursor-pointer">
              <p className="font-semibold text-gray-900 dark:text-white">{trend.topic}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{trend.tweets}</p>
            </div>
          ))}
          <Button variant="ghost" className="text-[#1DA1F2] hover:bg-gray-100 dark:hover:bg-gray-900">
            Show more
          </Button>
        </CardContent>
      </Card>

      {/* Who to follow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {whoToFollow.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                Follow
              </Button>
            </div>
          ))}
          <Button variant="ghost" className="text-[#1DA1F2] hover:bg-gray-100 dark:hover:bg-gray-900">
            Show more
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}