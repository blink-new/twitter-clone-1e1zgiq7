import { Sidebar } from '@/components/layout/Sidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { HomeFeed } from '@/components/feed/HomeFeed'
import { Toaster } from '@/components/ui/toaster'
import { useUser } from '@/hooks/useUser'
import blink from '@/blink/client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

function App() {
  const { currentUser: user, loading } = useUser()
  const [showDemoBanner, setShowDemoBanner] = useState(true)

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
      {/* Demo Banner */}
      {showDemoBanner && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm">🚀</span>
              </div>
              <div>
                <p className="font-medium">Demo Mode Active</p>
                <p className="text-sm opacity-90">Database is being set up. All features are functional with demo data!</p>
              </div>
            </div>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
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