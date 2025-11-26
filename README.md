# SkinTwin - Phase 1 MVP

Your personal skincare product tracker. Remember what works for your skin, avoid repeating mistakes, and build your skincare knowledge over time.

## What's Built (Phase 1 MVP)

✅ **User Authentication**
- Email/password signup and login
- Secure authentication with Supabase

✅ **Product Tracking**
- Add products with name, brand, category, rating, and notes
- Categories: Cleanser, Moisturizer, Serum, Sunscreen, Treatment, Other
- Ratings: Loved It, Liked It, Neutral, Disliked It, Broke Me Out

✅ **Product List & Search**
- View all your tracked products
- Search by product name or brand
- Filter by category (cleanser, moisturizer, etc.)
- Filter by rating (loved it, broke me out, etc.)
- Sort by date added or product name

✅ **Clean, Simple UI**
- Mobile-responsive design
- Fast, intuitive interface
- Color-coded ratings for quick visual scanning

## Tech Stack

- **Frontend**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Runs locally (deploy to Vercel later)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works great)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Your `.env.local` file is already set up with your Supabase credentials
   - Make sure email confirmation is disabled in Supabase for development

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Create an account or sign in
   - Start adding products!

## How to Use

1. **Sign up** - Create an account with your email
2. **Add products** - Click "Add Product" and fill in the details
3. **Track experiences** - Use the rating system to remember how products worked
4. **Search & filter** - Find products before repurchasing
5. **Build knowledge** - Over time, identify patterns in what works for your skin

## Database Schema

The `products` table includes:
- `id` - Unique identifier
- `user_id` - Links to authenticated user
- `product_name` - Name of the product
- `brand` - Brand name (optional)
- `category` - Product category
- `rating` - Your experience rating
- `notes` - Free-form notes about the product
- `created_at` - When you added it
- `updated_at` - Last modification time

## What's Next (Future Phases)

See `VISION_BRIEF.md` for the full roadmap, including:

- Phase 2: Ingredient tracking and pattern detection
- Phase 3: Skin twin matching and community features
- Phase 4: Community discussions and shared experiences

## Development Notes

- Built following the "Ruthless Prioritization" approach from the vision brief
- MVP focuses on core value: personal product database
- Kept simple - no over-engineering, just what's needed
- Mobile-first responsive design

## Project Structure

```
skintwin/
├── app/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── AddProductForm.tsx
│   │   │   └── ProductList.tsx
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── page.tsx
├── lib/
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
├── middleware.ts
└── supabase-schema.sql
```

## License

Personal project - see full vision in VISION_BRIEF.md
