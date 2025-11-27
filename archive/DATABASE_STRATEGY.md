# Single Robust Database Strategy

## Goal
Build one comprehensive, high-quality skincare product database that covers products sold in the US market (domestic + international brands).

**Target**: 100K+ products with high data quality

## Phase 1: Bootstrap Database (Week 1)

### Step 1: Download Open Beauty Facts Dataset
- **Source**: [Open Beauty Facts](https://world.openbeautyfacts.org/data)
- **Size**: 60,510 products currently
- **Format**: CSV download (0.9GB compressed, 9GB uncompressed)
- **Coverage**: Global products, many sold in US

**Action Items**:
1. Download full CSV dataset from Open Beauty Facts
2. Filter for products available in US market
3. Parse and normalize data into our schema
4. Import into Supabase `product_catalog` table

**Estimated Result**: ~40K-50K US-available products

### Step 2: Add Existing CSV Dataset
- **Source**: Your current datasheet.csv
- **Size**: 19,051 products
- **Quality**: Already curated

**Action Items**:
1. Merge with Open Beauty Facts data
2. Deduplicate by product name + brand
3. Prioritize your CSV data (higher quality)

**Estimated Result**: ~60K-70K total unique products

### Step 3: Import SkincareAPI Dataset
- **Source**: [SkincareAPI GitHub](https://github.com/LauraAddams/skincareAPI)
- **Size**: 2,000+ products (US, Korea, Japan)
- **Access**: API endpoint `https://skincare-api.herokuapp.com/products`

**Action Items**:
1. Fetch all products via API
2. Parse and normalize
3. Add to database (deduplicate)

**Estimated Result**: ~70K-75K total unique products

### Deduplication & Conflict Resolution Strategy

**Problem**: Same product listed differently across sources:
- Source 1: "CeraVe Hydrating Facial Cleanser" (brand: "CeraVe")
- Source 2: "Hydrating Facial Cleanser" (brand: "Cerave")
- Source 3: "CeraVe Hydrating Cleanser" (brand: "CeraVe")

**Solution**: Multi-step matching + priority system

#### Step 1: Normalize All Data
```javascript
function normalizeProduct(product) {
  return {
    brand: product.brand.toLowerCase().trim(),
    name: product.name.toLowerCase().trim(),
    // Remove common variations
    brandClean: removeBrandPrefixes(product.brand), // "The Ordinary" → "ordinary"
    nameClean: removeStopWords(product.name) // "Hydrating Facial Cleanser" → "hydrating cleanser"
  }
}
```

#### Step 2: Fuzzy Matching Algorithm
```javascript
function isDuplicate(product1, product2) {
  // Exact match on normalized brand + name
  if (product1.brandClean === product2.brandClean &&
      product1.nameClean === product2.nameClean) {
    return true;
  }

  // Levenshtein distance (allow small typos)
  const brandSimilarity = similarity(product1.brand, product2.brand);
  const nameSimilarity = similarity(product1.name, product2.name);

  // 90% similarity threshold
  if (brandSimilarity > 0.9 && nameSimilarity > 0.9) {
    return true;
  }

  return false;
}
```

#### Step 3: Data Source Priority (When Conflicts Detected)

**Priority Ranking** (highest to lowest):
1. **Your CSV** (19K products) - Already curated, highest quality
2. **SkincareAPI** (2K products) - Structured, verified ingredients
3. **Open Beauty Facts** (60K products) - Community-sourced, variable quality

**Conflict Resolution Rules**:

| Field | Strategy | Example |
|-------|----------|---------|
| **Brand name** | Use highest priority source | CSV: "The Ordinary" wins over OBF: "Ordinary" |
| **Product name** | Use most complete version | "CeraVe Hydrating Facial Cleanser" wins over "CeraVe Hydrating" |
| **Category** | Use highest priority if present, else fallback | CSV category > SkincareAPI > OBF |
| **Ingredients** | Merge if different, prefer longest list | Combine unique ingredients from all sources |
| **Type** | Use most specific | "Gel Cleanser" wins over "Cleanser" |

**Implementation**:
```sql
-- Merge strategy during import
INSERT INTO product_catalog (brand, name, category, ingredients, source)
SELECT
  COALESCE(csv.brand, api.brand, obf.brand) as brand,
  -- Pick longest product name (usually most complete)
  CASE
    WHEN LENGTH(csv.name) >= LENGTH(api.name) AND LENGTH(csv.name) >= LENGTH(obf.name) THEN csv.name
    WHEN LENGTH(api.name) >= LENGTH(obf.name) THEN api.name
    ELSE obf.name
  END as name,
  COALESCE(csv.category, api.category, obf.category) as category,
  -- Merge ingredients (take longest list)
  CASE
    WHEN LENGTH(csv.ingredients) > LENGTH(api.ingredients) THEN csv.ingredients
    ELSE api.ingredients
  END as ingredients,
  'merged:csv+api+obf' as source
FROM ...
ON CONFLICT (brand_normalized, name_normalized) DO UPDATE
  SET ingredients = CASE
    WHEN LENGTH(EXCLUDED.ingredients) > LENGTH(product_catalog.ingredients)
    THEN EXCLUDED.ingredients
    ELSE product_catalog.ingredients
  END;
```

#### Step 4: Import Order

**Sequential Import** (to respect priority):

1. **First**: Import your CSV (19K products)
   - These become the "source of truth"
   - No deduplication needed

2. **Second**: Import SkincareAPI (2K products)
   - Check each product against existing CSV
   - If duplicate found: keep CSV data, only fill missing fields
   - If new product: add with source='skincare_api'

3. **Third**: Import Open Beauty Facts (60K products)
   - Check against CSV + SkincareAPI
   - If duplicate: only fill missing fields (ingredients, etc.)
   - If new product: add with source='openbeauty'

**Result**: CSV data always wins, other sources supplement

#### Step 5: Track Data Lineage

```sql
-- Enhanced schema to track merges
CREATE TABLE product_catalog (
  id UUID PRIMARY KEY,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  brand_normalized TEXT, -- for deduplication
  name_normalized TEXT,  -- for deduplication
  category TEXT,
  ingredients TEXT,
  primary_source TEXT, -- 'csv', 'skincare_api', 'openbeauty'
  merged_sources TEXT[], -- ['csv', 'openbeauty'] if merged
  created_at TIMESTAMP DEFAULT NOW()
);

-- Unique constraint on normalized values
CREATE UNIQUE INDEX idx_product_unique
  ON product_catalog(brand_normalized, name_normalized);
```

#### Example: Conflict Resolution in Action

**Scenario**: Same product from 3 sources

```javascript
// CSV data (Priority 1)
{
  brand: "CeraVe",
  name: "Hydrating Facial Cleanser",
  category: "cleanser",
  ingredients: null // missing
}

// SkincareAPI data (Priority 2)
{
  brand: "CeraVe",
  name: "Hydrating Cleanser",
  category: "face-wash",
  ingredients: "water, glycerin, ceramides..."
}

// Open Beauty Facts data (Priority 3)
{
  brand: "Cerave",
  name: "CeraVe Hydrating Facial Cleanser",
  category: null,
  ingredients: "aqua, glycerin..."
}

// MERGED RESULT:
{
  brand: "CeraVe", // from CSV (priority 1)
  name: "Hydrating Facial Cleanser", // from CSV (priority 1, longest)
  category: "cleanser", // from CSV (priority 1)
  ingredients: "water, glycerin, ceramides...", // from SkincareAPI (CSV was null)
  primary_source: "csv",
  merged_sources: ["csv", "skincare_api", "openbeauty"]
}
```

### Product Image Sourcing Strategy

**Problem**: Users need product images to verify they're selecting the correct product

**Solution**: Multi-source image strategy with fallbacks

#### Image Sources (Priority Order)

**1. Open Beauty Facts Images**
- **Coverage**: Available for products in their 60K database
- **Access**: AWS Open Data Program or their servers
- **Quality**: Community-uploaded, varies
- **Format**: URL pattern: `https://images.openfoodfacts.org/images/products/{barcode}/front.jpg`
- **Cost**: Free

**2. Retailer Web Scraping**
- **Coverage**: When scraping Sephora/Ulta/Target (Phase 2)
- **Access**: Extract image URLs during product scraping
- **Quality**: High-resolution, professional product photos
- **APIs Available**:
  - [Sephora Scraper API (Apify)](https://apify.com/scraping_empire/sephora-com-scraper) - Includes high-res images
  - [Ulta Scraper API (Apify)](https://apify.com/mscraper/ulta-scraper/api) - Includes product images
  - [Oxylabs Sephora API](https://oxylabs.io/products/scraper-api/ecommerce/sephora)
- **Cost**: Free tier available, paid for bulk scraping

**3. User-Uploaded Images**
- **Coverage**: When users add missing products
- **Access**: Upload form in "Add Product" flow
- **Quality**: Varies, but user knows it's correct
- **Storage**: Supabase Storage (free tier: 1GB)
- **Cost**: Free up to 1GB

**4. Placeholder/No Image**
- **Fallback**: Generic category icon or "No Image Available" placeholder
- **Still allows**: Product to be added and searched

#### Implementation Plan

**Phase 1: Open Beauty Facts Images**
```sql
-- Add image fields to schema
ALTER TABLE product_catalog
ADD COLUMN image_url TEXT,
ADD COLUMN image_source TEXT, -- 'openbeauty', 'sephora', 'user_upload', 'placeholder'
ADD COLUMN barcode TEXT; -- for Open Beauty Facts image lookup
```

When importing Open Beauty Facts data:
1. Extract barcode field from their dataset
2. Construct image URL: `https://images.openfoodfacts.org/images/products/{barcode}/front.jpg`
3. Verify image exists (HTTP HEAD request)
4. Store URL in database if valid

**Phase 2: Retailer Images (Web Scraping)**
When scraping Sephora/Ulta:
```javascript
// Example scraper output
{
  brand: "CeraVe",
  name: "Hydrating Facial Cleanser",
  image_url: "https://www.sephora.com/productimages/sku/s123456.jpg",
  image_source: "sephora",
  source_url: "https://www.sephora.com/product/..."
}
```

**Phase 3: User Uploads**
```typescript
// In AddProductForm when user selects "Can't find product"
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
/>

async function handleImageUpload(file: File) {
  // Upload to Supabase Storage
  const { data } = await supabase.storage
    .from('product-images')
    .upload(`${userId}/${productId}.jpg`, file);

  // Store public URL in product_catalog
  const imageUrl = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);
}
```

#### Image Display in Autocomplete

**Before** (text-only):
```
CeraVe
Hydrating Facial Cleanser
```

**After** (with images):
```
[📷 Product Image]  CeraVe
                    Hydrating Facial Cleanser
                    Cleanser
```

**UI Component**:
```tsx
<div className="flex items-center gap-3 p-2 hover:bg-purple-50">
  <img
    src={product.image_url || '/placeholder-product.png'}
    alt={product.name}
    className="w-12 h-12 object-cover rounded-md border border-gray-200"
  />
  <div className="flex-1">
    <div className="text-sm font-medium text-gray-900">{product.brand}</div>
    <div className="text-sm text-gray-600">{product.name}</div>
    <div className="text-xs text-gray-400">{product.category}</div>
  </div>
</div>
```

#### Image Coverage Estimates

| Phase | Products | With Images | % Coverage |
|-------|----------|-------------|------------|
| Phase 1 (OBF only) | 65K | ~40K | 60% |
| Phase 2 (+ Scraping) | 150K | ~120K | 80% |
| Phase 3 (+ User uploads) | 200K+ | ~170K+ | 85%+ |

#### Technical Considerations

**Image Optimization**:
- Resize images to max 200x200px for autocomplete
- Use lazy loading for performance
- Cache images in browser (1 week)
- Compress with WebP format (70% smaller)

**Storage Limits**:
- Supabase Free Tier: 1GB storage
- Average product image: 50KB (compressed)
- Capacity: ~20,000 user-uploaded images before upgrade needed

**Fallback Strategy**:
```typescript
function getProductImage(product: Product) {
  // Try primary image URL
  if (product.image_url) return product.image_url;

  // Try Open Beauty Facts if barcode exists
  if (product.barcode) {
    return `https://images.openfoodfacts.org/images/products/${product.barcode}/front.jpg`;
  }

  // Category-specific placeholder
  return `/placeholders/${product.category}.png`;
}
```

### Expected Phase 1 Outcome
- **65K+ unique products** in database (after deduplication)
- **~40K product images** from Open Beauty Facts (60% coverage)
- **All major US brands** covered
- **High data quality** (CSV data prioritized)
- **Visual verification** for majority of products
- **Should find "Aveeno Calm+Restore Gel Oat Cleanser" with image** ✓

## Phase 2: Web Scraping (Week 2-3)

### Target Retailers for Scraping

**Priority 1** (Largest coverage):
- Sephora.com (~10K-15K products)
- Ulta.com (~15K-20K products)
- Target.com beauty section (~5K products)

**Priority 2** (Specialty):
- Dermstore.com
- SkinStore.com
- Yesstyle.com (Asian beauty)

### Legal Considerations
- Respect robots.txt
- Rate limit requests (1-2 sec delays)
- Only scrape public product listings
- Check each site's Terms of Service

### Implementation
```python
# Pseudocode for scraper
for each retailer:
    1. Scrape product listings (brand, name, category)
    2. Extract basic info (no reviews, prices)
    3. Normalize data
    4. Add to database (deduplicate)
    5. Log source for attribution
```

**Action Items**:
1. Build web scraper with rate limiting
2. Start with Sephora (largest, well-structured)
3. Run scraper weekly to catch new products
4. Store scrape date and source

**Estimated Result**: ~150K-200K total products after scraping

## Phase 3: Crowd-Sourcing (Ongoing)

### User Contribution System

**Flow**:
```
User searches → Product not found → "Add this product" button →
Simple form (brand, name, category) → Submit →
Product added with "user_contributed" flag →
Available to all users immediately
```

**Data Quality Controls**:
1. **Auto-moderation**:
   - Check for duplicates (fuzzy matching)
   - Validate brand/product name format
   - Require minimum fields

2. **Community moderation** (Phase 4):
   - Users can report duplicates/errors
   - Admin dashboard to review flags
   - Verified users can edit products

3. **Reputation system** (Future):
   - Track user contribution quality
   - Badge for verified contributors
   - Gamification (like INCIDecoder does)

**Implementation**:
```sql
CREATE TABLE product_catalog (
  id UUID PRIMARY KEY,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  type TEXT,
  ingredients TEXT,
  source TEXT, -- 'openbeauty', 'csv', 'skincare_api', 'sephora', 'user_contributed'
  contributed_by UUID REFERENCES auth.users(id),
  verified BOOLEAN DEFAULT false,
  popularity_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast autocomplete
CREATE INDEX idx_product_search ON product_catalog
  USING GIN (to_tsvector('english', brand || ' ' || name));
```

**Estimated Result**: Grows organically, +100-500 products/month depending on usage

## Phase 4: Data Enrichment (Month 2)

### Ingredient Data
- Match products to ingredient databases
- Add ingredient analysis (like INCIDecoder)
- Flag common allergens/irritants

### Product Metadata
- Add product images (scrape or user upload)
- Add categories/subcategories
- Add price ranges
- Add availability info

## Implementation Timeline

### Week 1: Bootstrap
- [x] Download Open Beauty Facts CSV
- [ ] Parse and import to Supabase
- [ ] Import existing CSV (deduplicate)
- [ ] Fetch SkincareAPI products
- [ ] Update ProductAutocomplete to use Supabase table
- [ ] Test with "Aveeno Calm+Restore Gel Oat Cleanser"

### Week 2-3: Web Scraping
- [ ] Build Sephora scraper
- [ ] Build Ulta scraper
- [ ] Build Target scraper
- [ ] Schedule weekly scrape jobs
- [ ] Monitor data quality

### Ongoing: Crowd-Sourcing
- [ ] Add "Product not found? Add it" UI
- [ ] Build submission form
- [ ] Implement duplicate detection
- [ ] Create admin moderation dashboard

## Database Schema

```sql
-- Main product catalog
CREATE TABLE product_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT, -- cleanser, moisturizer, serum, etc.
  type TEXT, -- "Face Cleanser", "Gel Moisturizer", etc.
  ingredients TEXT,
  barcode TEXT, -- UPC/EAN if available
  source TEXT NOT NULL, -- where we got the data
  source_url TEXT, -- link to original listing
  contributed_by UUID REFERENCES auth.users(id),
  verified BOOLEAN DEFAULT false,
  popularity_score INT DEFAULT 0, -- increment when selected
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_product_brand ON product_catalog(brand);
CREATE INDEX idx_product_name ON product_catalog(name);
CREATE INDEX idx_product_search ON product_catalog
  USING GIN (to_tsvector('english', brand || ' ' || name));
CREATE UNIQUE INDEX idx_product_unique ON product_catalog(LOWER(brand), LOWER(name));

-- User contribution tracking
CREATE TABLE product_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES product_catalog(id),
  contribution_type TEXT, -- 'created', 'edited', 'verified'
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Expected Coverage After Each Phase

| Phase | Products | Coverage | Confidence |
|-------|----------|----------|------------|
| Current (CSV only) | 19K | 60% | Missing common products |
| Phase 1 (Bootstrap) | 75K | 85% | Most major brands covered |
| Phase 2 (Scraping) | 150K+ | 95% | Comprehensive US market |
| Phase 3 (Crowd) | Growing | 98%+ | Long tail coverage |

## Success Metrics

**Week 1 (Phase 1)**:
- [ ] Database has 70K+ products
- [ ] "Aveeno Calm+Restore Gel Oat Cleanser" found ✓
- [ ] Autocomplete returns results in <200ms
- [ ] 90% of test searches return results

**Week 2-3 (Phase 2)**:
- [ ] Database has 150K+ products
- [ ] 95% of random product searches succeed
- [ ] Zero duplicate products in top 100 searches

**Month 2+ (Phase 3)**:
- [ ] Users contribute 50+ new products/month
- [ ] <5% duplicate submissions
- [ ] Database grows to 200K+ products

## Data Quality Standards

1. **Required Fields**: brand, name
2. **Normalized Format**: Title case for brands, sentence case for products
3. **Deduplication**: Match on lowercase brand + name
4. **Source Attribution**: Always track where data came from
5. **Update Frequency**: Scrape retailers weekly for new products

## Questions for User

1. **Phase 1 Priority**: Should I start by downloading and importing Open Beauty Facts today?
2. **Web Scraping**: Are you comfortable with scraping Sephora/Ulta (legal gray area)?
3. **Timeline**: Ship Phase 1 this week, or wait until Phase 2 is ready?
4. **Crowd-Sourcing**: Add "user contribute" feature in Phase 1 or later?

## Resources

- [Open Beauty Facts Dataset](https://world.openbeautyfacts.org/data) - 60K products
- [SkincareAPI GitHub](https://github.com/LauraAddams/skincareAPI) - 2K products, API access
- [Cosmetics Dataset (GTS.ai)](https://gts.ai/dataset-download/cosmetics-dataset/) - 1,472 Sephora products
- [Data.gov Cosmetics](https://catalog.data.gov/dataset/?tags=cosmetics) - California Safe Cosmetics Program data
- [Bright Data Skincare Datasets](https://brightdata.com/products/datasets/skincare) - Commercial option
