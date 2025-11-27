'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  product_name: string
  brand: string | null
  category: string
  rating: string
  notes: string | null
  created_at: string
}

const RATING_LABELS: Record<string, string> = {
  loved_it: 'Loved It',
  liked_it: 'Liked It',
  neutral: 'Neutral',
  disliked_it: 'Disliked It',
  broke_me_out: 'Broke Me Out',
}

const RATING_COLORS: Record<string, string> = {
  loved_it: 'bg-green-100 text-green-800',
  liked_it: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
  disliked_it: 'bg-orange-100 text-orange-800',
  broke_me_out: 'bg-red-100 text-red-800',
}

interface ProductListProps {
  refreshTrigger: number
}

export default function ProductList({ refreshTrigger }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')

  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [refreshTrigger])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesRating = ratingFilter === 'all' || product.rating === ratingFilter

      return matchesSearch && matchesCategory && matchesRating
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.product_name.localeCompare(b.product_name)
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading products...</div>
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input
          type="text"
          placeholder="search products or brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
        >
          <option value="all">all categories</option>
          <option value="cleanser">cleanser</option>
          <option value="moisturizer">moisturizer</option>
          <option value="serum">serum</option>
          <option value="sunscreen">sunscreen</option>
          <option value="treatment">treatment</option>
          <option value="other">other</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
        >
          <option value="all">all ratings</option>
          <option value="loved_it">loved it</option>
          <option value="liked_it">liked it</option>
          <option value="neutral">neutral</option>
          <option value="disliked_it">disliked it</option>
          <option value="broke_me_out">broke me out</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
          className="rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
        >
          <option value="date">sort by date</option>
          <option value="name">sort by name</option>
        </select>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' || ratingFilter !== 'all'
              ? 'no products match your filters'
              : 'no products yet. add your first product to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.product_name}
                    </h3>
                    <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${RATING_COLORS[product.rating]}`}>
                      {RATING_LABELS[product.rating]}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-4 text-sm text-gray-500">
                    {product.brand && <span className="font-medium text-gray-600">{product.brand}</span>}
                    <span>{product.category}</span>
                    <span>{new Date(product.created_at).toLocaleDateString()}</span>
                  </div>

                  {product.notes && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{product.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredProducts.length > 0 && (
        <p className="text-center text-sm text-gray-400">
          showing {filteredProducts.length} of {products.length} products
        </p>
      )}
    </div>
  )
}
