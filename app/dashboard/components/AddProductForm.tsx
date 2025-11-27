'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductAutocomplete from './ProductAutocomplete'

const CATEGORIES = ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'treatment', 'other'] as const
const RATINGS = [
  { value: 'loved_it', label: 'loved it' },
  { value: 'liked_it', label: 'liked it' },
  { value: 'neutral', label: 'neutral' },
  { value: 'disliked_it', label: 'disliked it' },
  { value: 'broke_me_out', label: 'broke me out' },
] as const

interface AddProductFormProps {
  onSuccess: () => void
}

export default function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    product_name: '',
    brand: '',
    category: 'moisturizer' as typeof CATEGORIES[number],
    rating: 'neutral' as typeof RATINGS[number]['value'],
    notes: '',
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to add products')
      }

      const { error: insertError } = await supabase
        .from('products')
        .insert([
          {
            user_id: user.id,
            ...formData,
          },
        ])

      if (insertError) throw insertError

      // Reset form
      setFormData({
        product_name: '',
        brand: '',
        category: 'moisturizer',
        rating: 'neutral',
        notes: '',
      })

      setIsOpen(false)
      onSuccess()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-purple-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition-colors"
      >
        add product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-medium text-gray-900">add product</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                  product name *
                </label>
                <ProductAutocomplete
                  value={formData.product_name}
                  onChange={(value) => setFormData({ ...formData, product_name: value })}
                  onSelect={(product) => {
                    setFormData({
                      ...formData,
                      product_name: product.name,
                      brand: product.brand || formData.brand,
                      category: (product.category as typeof CATEGORIES[number]) || formData.category
                    })
                  }}
                  placeholder="search for a product (e.g., cerave moisturizing cream)"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  brand
                </label>
                <input
                  type="text"
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  placeholder="e.g., CeraVe"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  category *
                </label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof CATEGORIES[number] })}
                  className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  rating *
                </label>
                <select
                  id="rating"
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value as typeof RATINGS[number]['value'] })}
                  className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  {RATINGS.map((rating) => (
                    <option key={rating.value} value={rating.value}>
                      {rating.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  placeholder="how did this product work for you?"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-md bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'adding...' : 'add product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
