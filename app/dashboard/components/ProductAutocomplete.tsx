'use client'

import { useState, useEffect, useRef } from 'react'

interface Product {
  brand: string
  name: string
  type: string
  country: string
  ingridients: string
  afterUse: string
}

interface ProductAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (product: { name: string; brand: string; category?: string }) => void
  placeholder?: string
}

const DEBOUNCE_MS = 300

export default function ProductAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'search for a product...'
}: ProductAutocompleteProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [justSelected, setJustSelected] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Load CSV on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/products.csv')
        const csvText = await response.text()

        // Parse CSV (skip header row)
        const lines = csvText.split('\n').slice(1)
        const products: Product[] = lines
          .filter(line => line.trim())
          .map(line => {
            // Simple CSV parser - handles quoted fields with commas
            const parts = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || []
            return {
              brand: parts[0]?.replace(/^"|"$/g, '').trim() || '',
              name: parts[1]?.replace(/^"|"$/g, '').trim() || '',
              type: parts[2]?.replace(/^"|"$/g, '').trim() || '',
              country: parts[3]?.replace(/^"|"$/g, '').trim() || '',
              ingridients: parts[4]?.replace(/^"|"$/g, '').trim() || '',
              afterUse: parts[5]?.replace(/^"|"$/g, '').trim() || ''
            }
          })
          .filter(p => p.name && p.brand)

        setAllProducts(products)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // Don't search if user just selected a product
    if (justSelected) {
      setJustSelected(false)
      return
    }

    if (value.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    const searchTerm = value.toLowerCase()
    const searchWords = searchTerm.split(/\s+/).filter(w => w.length > 0)

    // Enhanced fuzzy search with scoring
    const scoredProducts = allProducts
      .map(product => {
        const brandLower = product.brand.toLowerCase()
        const nameLower = product.name.toLowerCase()
        const typeLower = product.type.toLowerCase()
        const combinedText = `${brandLower} ${nameLower} ${typeLower}`

        let score = 0
        let matches = 0

        // Check each search word
        for (const word of searchWords) {
          // Exact brand match (highest priority)
          if (brandLower === word) {
            score += 100
            matches++
          }
          // Brand starts with word
          else if (brandLower.startsWith(word)) {
            score += 50
            matches++
          }
          // Brand contains word
          else if (brandLower.includes(word)) {
            score += 30
            matches++
          }
          // Type contains word (like "cleanser")
          else if (typeLower.includes(word)) {
            score += 20
            matches++
          }
          // Name contains word
          else if (nameLower.includes(word)) {
            score += 10
            matches++
          }
        }

        // Must match at least some words
        if (matches === 0) return null

        // Bonus for matching all words
        if (matches === searchWords.length) {
          score += 50
        }

        return { product, score }
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, 15) // Show more results
      .map(item => item!.product)

    setSuggestions(scoredProducts)
    setIsOpen(scoredProducts.length > 0)
    setLoading(false)
  }, [value, allProducts])

  const mapTypeToCategory = (type: string): string | undefined => {
    const typeLower = type.toLowerCase()

    if (typeLower.includes('cleanser')) return 'cleanser'
    if (typeLower.includes('moisturizer') || typeLower.includes('cream') || typeLower.includes('lotion')) return 'moisturizer'
    if (typeLower.includes('serum')) return 'serum'
    if (typeLower.includes('sunscreen') || typeLower.includes('spf')) return 'sunscreen'
    if (typeLower.includes('treatment') || typeLower.includes('toner') || typeLower.includes('exfoliant')) return 'treatment'

    return undefined
  }

  const handleSelect = (product: Product) => {
    // Mark that we just selected to prevent search effect from running
    setJustSelected(true)

    // Close the dropdown first
    setIsOpen(false)
    setSuggestions([])

    // Fill the input with the full product name
    onChange(product.name)

    // Pass product data to parent for auto-filling other fields
    onSelect({
      name: product.name,
      brand: product.brand,
      category: mapTypeToCategory(product.type)
    })
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
        autoComplete="off"
      />

      {loading && allProducts.length > 0 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          searching...
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {suggestions.map((product, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(product)}
              className="w-full px-4 py-2.5 text-left hover:bg-purple-50 focus:bg-purple-50 focus:outline-none border-b border-gray-200 last:border-b-0 transition-colors"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-gray-900">{product.brand}</span>
                <span className="text-sm text-gray-700">{product.name}</span>
              </div>
              {product.type && (
                <div className="mt-1 text-xs text-gray-500">{product.type}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && !loading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white p-4 text-center shadow-lg">
          <p className="text-sm text-gray-500">no products found</p>
          <p className="mt-1 text-xs text-gray-400">try a different search or add manually</p>
        </div>
      )}
    </div>
  )
}
