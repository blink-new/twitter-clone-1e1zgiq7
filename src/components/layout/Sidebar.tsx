import { Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Feather, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/hooks/useUser'
import blink from '@/blink/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
  { name: 'Home', icon: Home, current: true },
  { name: 'Explore', icon: Search, current: false },
  { name: 'Notifications', icon: Bell, current: false },
  { name: 'Messages', icon: Mail, current: false },
  { name: 'Bookmarks', icon: Bookmark, current: false },
  { name: 'Profile', icon: User, current: false },
  { name: 'More', icon: MoreHorizontal, current: false },
]

export function Sidebar() {
  const { currentUser } = useUser()

  const handleLogout = () => {
    blink.auth.logout()
  }

  return (
    <div className="flex flex-col h-screen w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      {/* Logo */}
      <div className="flex items-center px-6 py-4">
        <div className="w-8 h-8 bg-[#1DA1F2] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">𝕏</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.name}
              variant={item.current ? "secondary" : "ghost"}
              className="w-full justify-start text-xl py-6 px-6 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <Icon className="mr-4 h-6 w-6" />
              <span className="hidden lg:block">{item.name}</span>
            </Button>
          )
        })}
      </nav>

      {/* Tweet Button */}
      <div className="px-4 mb-4">
        <Button className="w-full bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold py-3 rounded-full">
          <Feather className="h-5 w-5 lg:mr-2" />
          <span className="hidden lg:block">Tweet</span>
        </Button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full p-3 cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser?.avatarUrl || "/placeholder-avatar.jpg"} />
                <AvatarFallback>{currentUser?.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {currentUser?.displayName || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  @{currentUser?.username || 'username'}
                </p>
              </div>
              <MoreHorizontal className="hidden lg:block h-5 w-5 text-gray-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}