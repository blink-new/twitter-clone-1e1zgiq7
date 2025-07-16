import { Sidebar } from '@/components/layout/Sidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { HomeFeed } from '@/components/feed/HomeFeed'
import { Toaster } from '@/components/ui/toaster'
import { useUser } from '@/hooks/useUser'
import blink from '@/blink/client'

function App() {
  const { currentUser: user, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#1DA1F2] rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-lg">𝕏</span>
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-[#1DA1F2] rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-3xl">𝕏</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Twitter Clone</h1>
            <p className="text-gray-600 dark:text-gray-400">Please sign in to continue</p>
          </div>
          <button
            onClick={() => blink.auth.login()}
            className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <HomeFeed />
        
        {/* Right Sidebar */}
        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
      
      <Toaster />
    </div>
  )
}

export default App