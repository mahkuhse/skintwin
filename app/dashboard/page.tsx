'use client'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import AddProductForm from './components/AddProductForm'
import ProductList from './components/ProductList'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-purple-400">
                <span className="text-lg font-semibold text-purple-500">ST</span>
              </div>
              <span className="text-xl font-medium text-gray-900">SkinTwin</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-500">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-purple-500"
              >
                sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-normal text-gray-900">my skincare products</h2>
            <p className="mt-2 text-sm text-gray-500">track products you've tried and your experiences</p>
          </div>
          <AddProductForm onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
        </div>

        <ProductList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  )
}
