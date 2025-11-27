# Product Search Strategy Plan

## Problem Statement

Users need to easily find and add skincare products to their tracking list. Manual entry creates friction and reduces engagement. Current CSV database (19K products) has gaps - missing products like "Aveeno Calm+Restore Gel Oat Cleanser."

**User Requirement**: "Manual entry is a huge turn off" - we need comprehensive product coverage with minimal friction.

## Proposed Solution: Multi-Source Search Strategy

### Phase 1: Immediate Implementation (Multi-Source Autocomplete)

**Goal**: Maximize product coverage by searching multiple databases in parallel/cascade

**Architecture**:
```
User types → Search CSV (fast, local) → If no results → Search Open Beauty Facts API → Display combined results
```

**Implementation Details**:

1. **Primary Source: CSV Database (19K products)**
   - Already loaded, instant search
   - No API rate limits
   - Search product name + brand fields
   - Display results immediately

2. **Secondary Source: Open Beauty Facts API**
   - Triggered if CSV returns < 5 results
   - 2.8M+ products in database
   - Beauty/cosmetics category
   - Free, no authentication required
   - API endpoint: `https://world.openfoodfacts.org/cgi/search.pl`

3. **Tertiary Source: User-Added Products Cache**
   - Store products users successfully add (not in CSV/API)
   - Make available to all users as autocomplete suggestions
   - Grows organically over time
   - Stored in Supabase `product_catalog` table

**User Experience Flow**:
```
1. User types "Aveeno Calm"
2. Component searches CSV → 0 results
3. Component searches Open Beauty Facts → 3 results found
4. Display: "Aveeno Calm+Restore Gel Oat Cleanser" (from API)
5. User selects → product added to their list
6. Product also cached in product_catalog for future users
```

**Advantages**:
- ✅ Immediate improvement in coverage
- ✅ No new infrastructure required
- ✅ Builds database organically through usage
- ✅ Fast for common products (CSV)
- ✅ Comprehensive for rare products (API + crowd-sourcing)

**Potential Issues**:
- ⚠️ API latency (200-500ms) - mitigated by debouncing
- ⚠️ Data quality varies by source - need normalization
- ⚠️ Rate limiting on Open Beauty Facts - implement caching

### Phase 2: Database Optimization (Week 2-3)

**Goal**: Improve search performance and data quality

1. **Create Unified Product Catalog Table**
   ```sql
   CREATE TABLE product_catalog (
     id UUID PRIMARY KEY,
     name TEXT NOT NULL,
     brand TEXT,
     category TEXT,
     type TEXT,
     ingredients TEXT,
     source TEXT, -- 'csv', 'openfoodfacts', 'user_added'
     popularity_score INT DEFAULT 0, -- increment on selection
     created_at TIMESTAMP DEFAULT NOW()
   )
   ```

2. **Implement Smart Ranking**
   - Rank by: exact match > popularity > source quality
   - Boost products from CSV (verified quality)
   - Show most-selected products first

3. **Add Fuzzy Matching**
   - Handle typos: "cerave" vs "cerve"
   - Brand aliases: "The Ordinary" vs "TO"
   - Common misspellings

### Phase 3: Advanced Features (Month 2)

**Optional enhancements based on user feedback**:

1. **Barcode Scanning** (like SkinSort)
   - Use device camera to scan product barcodes
   - Look up UPC/EAN in Open Beauty Facts
   - Instant product addition with no typing

2. **AI-Powered Product Recognition**
   - Upload photo of product
   - Extract brand/product name using OCR + LLM
   - Auto-populate form fields

3. **Community Contributions**
   - Allow users to submit missing products
   - Moderate and approve submissions
   - Badge system for contributors

## Technical Implementation Checklist

### Phase 1 Tasks

- [ ] Update ProductAutocomplete.tsx to implement cascade search
  - [ ] Keep CSV search as primary
  - [ ] Add Open Beauty Facts API integration
  - [ ] Implement result merging and deduplication
  - [ ] Add loading states for API calls

- [ ] Create product_catalog table in Supabase
  - [ ] Add migration script
  - [ ] Set up indexes on name, brand
  - [ ] Implement RLS policies

- [ ] Add caching layer
  - [ ] Cache API results in localStorage (24hr TTL)
  - [ ] Cache user selections in product_catalog table
  - [ ] Implement cache invalidation strategy

- [ ] Update AddProductForm.tsx
  - [ ] Handle products from multiple sources
  - [ ] Show source badge (CSV/API/User)
  - [ ] Add "Can't find product? Add manually" fallback

- [ ] Testing
  - [ ] Test with missing products (Aveeno example)
  - [ ] Test with common products (speed)
  - [ ] Test API error handling
  - [ ] Test offline behavior

## API Integration Details

### Open Beauty Facts API

**Search Endpoint**:
```
GET https://world.openfoodfacts.org/cgi/search.pl?
  search_terms={query}&
  categories=beauty&
  json=1&
  page_size=10
```

**Response Format**:
```json
{
  "products": [
    {
      "product_name": "Calm + Restore Oat Gel Cleanser",
      "brands": "Aveeno",
      "categories": "Face cleanser",
      "ingredients_text": "...",
      "code": "381371180271" // barcode
    }
  ]
}
```

**Rate Limits**: None officially, but implement 300ms debounce + caching

## Success Metrics

### Phase 1 (Week 1)
- [ ] 95%+ product coverage (test with 50 random products)
- [ ] < 500ms average search response time
- [ ] < 5% API error rate
- [ ] User can find "Aveeno Calm+Restore Gel Oat Cleanser"

### Phase 2 (Week 2-3)
- [ ] Product catalog grows to 25K+ products
- [ ] Fuzzy matching handles 90%+ common typos
- [ ] Search ranking improves (user satisfaction survey)

## Alternative Approaches Considered

### ❌ Option A: Web Scraping
**Why rejected**: Legal concerns, fragile, high maintenance

### ❌ Option B: Commercial API (SkinSort, INCIDecoder)
**Why rejected**: Cost, licensing restrictions, vendor lock-in

### ❌ Option C: Full Manual Entry
**Why rejected**: "huge turn off" per user feedback

### ✅ Option D: Multi-Source + Crowd-Sourcing (SELECTED)
**Why chosen**: Balances coverage, cost, speed, and organic growth

## Questions for User

1. **Scope**: Start with Phase 1 only, or plan for Phase 2/3?
2. **Priority**: Speed vs. coverage - which matters more?
3. **Fallback**: If product still not found, show "Add manually" or "Request product"?
4. **Sources**: Only CSV + Open Beauty Facts, or explore additional free APIs?
5. **Timeline**: Ship Phase 1 this week, or perfect it first?

## Next Steps

1. ✅ Get user approval on this plan
2. ⏭️ Implement Phase 1: Multi-source autocomplete
3. ⏭️ Test with Aveeno product
4. ⏭️ Deploy and gather user feedback
5. ⏭️ Iterate based on usage patterns
