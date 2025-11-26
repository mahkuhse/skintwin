# Skincare Tracker & Skin Twin Platform
## Vision Brief

**Version:** 1.0  
**Date:** November 25, 2025  
**Author:** [Your Name]

---

## Executive Summary

A personal skincare management tool that helps users track product experiences, build institutional knowledge about what works for their skin, and eventually connect with "skin twins" - people with similar skin who can share insights and recommendations.

---

## Problem Statement

### The Core Problem
People battling acne and other skin concerns accumulate years of experience with products, advice from dermatologists, tips from Reddit and YouTube, and personal trial-and-error. However, this valuable knowledge exists only in fragmented mental databases that:

- **Fade over time** - "Didn't I try something like this before? Did I like it?"
- **Lead to repeated mistakes** - Re-purchasing products that previously caused breakouts
- **Waste money** - Buying products without remembering similar alternatives you've already tested
- **Prevent learning** - Unable to identify patterns (e.g., "All products with niacinamide break me out")
- **Isolate users** - Hard to find people with truly similar skin who can provide relevant advice

### Current Solutions Fall Short
- **Spreadsheets** - Too manual, not designed for this use case
- **Notes apps** - Unstructured, hard to search and compare
- **Reddit/forums** - Other people's experiences, not your own searchable database
- **Skincare apps** - Focus on routines and schedules, not experience tracking and pattern recognition

---

## Target Users

### Primary User (Phase 1)
**The Skincare Journeyer**
- Has been dealing with acne or other skin concerns for months/years
- Has tried 10+ products over time
- Reads skincare content (Reddit, YouTube derms, blogs)
- Often can't remember if they've tried something before
- Wants to make informed decisions based on their own history
- May or may not be technical

### Secondary User (Phase 2+)
**The Community Seeker**
- Wants advice from people with similar skin, not generic recommendations
- Interested in learning from others' experiences
- Willing to share their own journey to help others

---

## User Stories

### Phase 1: Personal Product Database

**As a skincare user, I want to:**

1. **Log a product I've tried** so I remember my experience with it
   - Product name, brand, category (cleanser, moisturizer, treatment, etc.)
   - When I used it (date range)
   - My experience (liked it, broke me out, too harsh, perfect, etc.)
   - Detailed notes (texture, smell, how my skin reacted)
   - Key ingredients if I know them

2. **Search my product history** before buying something new
   - "Have I tried CeraVe moisturizer before?"
   - "Show me all cleansers I've tried"
   - "What products broke me out?"

3. **Identify patterns in what works/doesn't work** for my skin
   - "Do products with niacinamide break me out?"
   - "Which moisturizers did I actually like?"
   - Tag products by ingredients and see trends

3a. **Understand what ingredients do** in plain language
   - Automatically decode product ingredients using services like INCIDecoder
   - See what each ingredient does (hydrating, exfoliating, anti-acne, etc.)
   - Get pattern insights: "You tend to break out from products with fatty alcohols"
   - Learn which beneficial ingredients your skin loves

3b. **Track product reformulations** to avoid confusion and bad repurchases
   - Log multiple versions/formulations of the same product over time
   - Note when a brand reformulated a product (e.g., "CeraVe Moisturizing Cream - 2022 formula")
   - Compare experiences between old and new formulations
   - Get alerts: "Warning: This product has been reformulated since you last tried it"
   - See ingredient changes between versions
   - Community reports: "5 users noted the new formula causes breakouts vs 2 with old formula"

4. **Store advice and learnings** I've gathered over time
   - Tips from YouTube dermatologists
   - Reddit wisdom that resonated
   - Blog posts with good information
   - Personal observations about my skin

5. **Access educational resources** to understand my skin better
   - Skin type tests
   - Techniques (e.g., the "wait and see" oiliness test)
   - Ingredient education
   - Common skincare myths

### Phase 2: Community & Skin Twins

**As a community member, I want to:**

6. **Find my "skin twin"** - someone with similar skin characteristics
   - Similar skin type (oily, dry, combination, sensitive)
   - Similar concerns (acne, redness, texture, etc.)
   - Similar reactions to common products

7. **Browse routines and experiences** from my skin twins
   - See what products worked for them
   - Learn from their journey
   - Get personalized recommendations based on real similarity

8. **Discuss experiences** with people who understand my skin
   - Private messages or community discussions
   - Share photos of progress (optional)
   - Ask questions to people with proven similar skin

9. **Contribute to the community** by sharing my experience
   - Help others who are where I was months/years ago
   - Build credibility through consistent tracking

---

## Key Experiences & User Flows

### Experience 1: Adding a Product (The Core Loop)

**Scenario:** User just finished a product or wants to log something they're currently using.

**Flow:**
1. Click "Add Product"
2. Enter product name (autocomplete from database if it exists)
3. Select category (cleanser, moisturizer, serum, etc.)
4. Rate experience: Simple scale or tags (Holy Grail, Liked, Neutral, Disliked, Broke Me Out)
5. Add dates used (from/to or just a period)
6. Add notes (free-form - what did you like/dislike, how did skin react)
7. Optionally add ingredients or product details
8. Save

**Design Principles:**
- Must be FAST - shouldn't take more than 60 seconds
- Mobile-friendly (people often shop while out)
- Low friction - can always add more details later

### Experience 2: Pre-Purchase Search

**Scenario:** User is at the store or shopping online, considering a product.

**Flow:**
1. Quick search from home screen
2. Type product name or brand
3. See if they've tried it before
4. If yes: See their previous rating and notes
5. If no: See if they've tried similar products (same category, brand, or ingredients)
6. Decision: Buy with confidence or skip it

**Design Principles:**
- Fast search, mobile-optimized
- Clear visual indicators (green = liked, red = broke me out)
- Show most relevant information first

### Experience 3: Pattern Discovery

**Scenario:** User suspects an ingredient doesn't work for them.

**Flow:**
1. Browse products by ingredient or use filter
2. See all products containing niacinamide (for example)
3. Notice most are rated "Broke Me Out" or "Disliked"
4. Confirm hypothesis - avoid niacinamide going forward

**Design Principles:**
- Tagging and filtering system
- Visual pattern recognition
- Ability to save insights ("Note: Avoid niacinamide")

### Experience 4: Finding a Skin Twin (Phase 2)

**Scenario:** User wants to find someone with similar skin for recommendations.

**Flow:**
1. Complete skin profile (skin type, main concerns, product overlap)
2. Algorithm matches with users who have:
   - Similar skin characteristics
   - Rated common products similarly
   - Geographic proximity (optional, for product availability)
3. Browse skin twin's product list and ratings
4. See products they loved that user hasn't tried
5. Optionally message or follow their journey

**Design Principles:**
- Privacy-first (opt-in for community features)
- Clear matching criteria transparency
- Focus on quality matches over quantity

---

## Ruthless Prioritization: Ship Fast Framework

### The Real MVP (What You MUST Build First)

**Core Loop Only:**
1. **User can create an account** (email + password, keep it simple)
2. **User can add a product** with:
   - Name
   - Category (dropdown: cleanser, moisturizer, serum, sunscreen, treatment, other)
   - Rating (simple: Loved It, Liked It, Neutral, Disliked It, Broke Me Out)
   - Notes (optional text field)
3. **User can view their product list**
   - Simple table or card view
   - Sort by date added or rating
4. **User can search/filter products**
   - By name
   - By category
   - By rating

**That's it for v0.1. Ship this in 1 week.**

---

### What to Explicitly CUT from MVP

❌ **Cut from Phase 1:**
- Ingredient tracking (do manually in notes if needed)
- Photos
- Date ranges (just log when you add it)
- Educational content
- Knowledge base
- Timeline views
- Complex filtering
- Product autocomplete from database
- Edit/delete (add later if needed, but v1 is append-only)

❌ **Don't Even Think About Yet:**
- Ingredient decoder integration (Phase 2 only)
- Community features
- Skin twin matching
- Any social features
- Fancy UI/animations
- Mobile app (PWA is fine)

---

### Build Order (Week by Week)

**Week 1: Bare Bones MVP**
- Set up project (Next.js + Supabase is fastest)
- Basic auth (Supabase handles this)
- Product form (add only)
- Product list view
- Basic search

**Week 2: Make It Usable**
- Edit/delete products
- Better filtering (category, rating)
- Improve UI/UX based on your usage
- Deploy and test with yourself

**Week 3: First Real Value**
- Pattern detection: "Show me all products I broke out from"
- Better search (fuzzy matching)
- Mobile responsive polish
- Share with 2-3 friends for feedback

**Week 4+: Decide Based on Learning**
- If you're using it daily → Add ingredient decoder
- If friends love it → Add more features
- If it's not sticky → Figure out why before building more

---

### The "Would I Pay For This?" Test

Before building ANY feature, ask:
- "Would I personally use this feature weekly?"
- "Does this feature help me avoid buying bad products?"
- "Can I build this in < 2 days?"

If any answer is "no," cut it or delay it.

---

### Ingredient Decoder: Phase 2 Only

**Why wait:**
- Adds complexity (API integration, data storage, UI for showing ingredients)
- Core value works without it (you can note ingredients manually)
- Need to validate people actually use the basic tracker first
- Pattern detection can work on manual tags initially

**When to add:**
- After 2+ weeks of daily personal use
- After validating friends actually use it
- After you've manually tracked 20+ products and felt the pain of manual ingredient entry

**How to add smartly:**
- Start simple: Just fetch and display ingredients
- Then: Add pattern detection ("You rated 4/5 products with cetearyl alcohol badly")
- Finally: Proactive warnings ("This product has cetearyl alcohol which you tend to react badly to")

---

## Phased Development Approach

### Phase 1: Personal Database (MVP)
**Goal:** Create a functional personal skincare product tracker that you'll actually use

**Core Features (Absolute Minimum):**
- User authentication (email/password via Supabase or similar)
- Add products (name, category, rating, notes)
- View product list (sortable, basic UI)
- Search products by name
- Filter by category and rating

**Nice-to-Haves (Only if Phase 1 is working well):**
- Edit/delete products
- Date tracking (when started/stopped)
- Better mobile responsiveness
- Product photos

**Success Metrics:**
- You use it for 2 weeks straight
- You successfully check it before buying something
- You've logged 15+ products
- Adding a product takes <60 seconds

**Timeline:** 1 week for bare bones, 2 weeks to polish

---

### Phase 2: Enhanced Personal Features
**Goal:** Make the personal tracker more powerful and insightful

**Additional Features:**
- **Ingredient decoder integration** (INCIDecoder API or similar)
  - Automatically fetch ingredient lists for products
  - Plain language explanations of what ingredients do
  - Flag potentially problematic ingredients based on user history
- Ingredient tracking and pattern detection
- Knowledge base section (save tips, articles, advice)
- Educational content (skin type tests, techniques)
- Product photos and before/after tracking
- Timeline view of skincare journey
- Export data

**Success Metrics:**
- Users discover patterns in their data
- Users learn which ingredients work/don't work for their skin
- Users regularly add knowledge items
- Users refer to educational content

**Timeline:** 2-3 weeks

---

### Phase 3: Community Foundation
**Goal:** Enable skin twin matching and community features

**Additional Features:**
- Enhanced user profiles (skin type, concerns, demographics)
- Matching algorithm for skin twins
- Browse other users' product lists (privacy-controlled)
- Follow/friend system
- Product recommendation engine based on skin twins

**Success Metrics:**
- Users find at least 2-3 good skin twin matches
- Users discover new products through twins
- Positive feedback on recommendation quality

**Timeline:** 3-4 weeks

---

### Phase 4: Community Interaction
**Goal:** Enable discussion and deeper community engagement

**Additional Features:**
- Messaging between skin twins
- Community forums/discussions
- Progress photo sharing (optional)
- Routine sharing
- Upvoting/helpful markers on products and advice

**Success Metrics:**
- Active discussions and messages
- Community retention and engagement
- User-generated content quality

**Timeline:** 3-4 weeks

---

## Community Data Sources & Skin Twin Matching Strategies

### The Core Insight

The idea: Find "skin twins" by matching users with highly specific skin characteristics. For example, finding people with "oily, dehydrated, acne-prone skin with cystic acne" rather than just generic "acne-prone" matches.

**Why this is powerful:**
- Skincare advice is only useful if it comes from someone with truly similar skin
- Generic recommendations ("try this for acne") often fail because skin varies so much
- Finding someone with your exact combination of characteristics is like finding a cheat code
- Reddit (especially r/SkincareAddiction) has millions of authentic, detailed skin descriptions

### Option A: Reddit Web Crawling (High Value, High Risk)

**The Concept:**
- Crawl Reddit (r/SkincareAddiction, r/acne, etc.) for posts mentioning skin characteristics
- Extract skin type descriptors using keyword matching or NLP
- Match users to Reddit posters with similar descriptions
- Surface relevant posts, routines, and product recommendations

**Example Use Case:**
User describes their skin as "oily, dehydrated, cystic acne"
→ System finds Reddit posts from users with identical descriptors
→ Shows what products/routines worked for those Redditors
→ User can read full context and follow those users' journeys

**Pros:**
- Massive existing dataset (years of Reddit posts)
- Authentic, detailed skin descriptions
- Real product experiences and outcomes
- Users already trust Reddit for this type of advice
- No need to build community from scratch

**Cons:**
- **Privacy concerns**: Reddit users didn't consent to being matched
- **Legal risk**: May violate Reddit's Terms of Service
  - Commercial use restrictions
  - Rate limiting on API
  - Potential for API access revocation
- **Technical complexity**: 
  - Need NLP to extract skin types from freeform text
  - Data quality varies (sarcasm, jokes, misleading info)
  - Ongoing crawling infrastructure and maintenance
  - Storage of potentially sensitive data
- **GDPR/privacy laws**: Storing personal data from public posts has legal implications
- **Ethics**: Connecting real usernames to sensitive health info feels invasive
- **Sustainability**: Reddit could change API access or TOS at any time

**If Pursuing This Path:**
1. Consult with a lawyer about Reddit TOS compliance
2. Research GDPR/CCPA implications of storing public Reddit data
3. Consider anonymizing Reddit usernames in your system
4. Implement explicit user consent for any data storage
5. Have a plan for API access loss (what if Reddit cuts you off?)
6. Start with manual testing before building automated infrastructure

**Realistic Timeline:** Phase 4+ only, after legal review

---

### Option B: Build Native Community (Lower Risk, Slower Growth)

**The Concept:**
- Users in YOUR app fill out structured skin profiles
- Algorithm matches users based on:
  - Skin type (oily, dry, combination, sensitive)
  - Primary concerns (acne, redness, texture, aging, etc.)
  - Product overlap (products they've both tried and rated similarly)
  - Optional: Age, climate, gender
- Users opt-in to community features explicitly

**Pros:**
- **Clean legal/ethical position**: Users knowingly consent
- **Structured data**: Easier to match accurately than freeform text
- **Privacy-controlled**: Users decide what to share
- **Quality**: Only people serious enough to track products
- **Sustainable**: You own the platform and data
- **Trust**: Users know matches come from your community

**Cons:**
- **Cold start problem**: Need critical mass of users before matching works
- **Slower growth**: Can't leverage existing Reddit userbase
- **User effort**: People need to fill out profiles and track products
- **Competition**: Competing for attention with established platforms

**Growth Strategy:**
1. Start with friends and local community (10-20 users)
2. Partner with dermatology offices or skincare communities
3. Content marketing (blog posts about your own skin journey)
4. Leverage your own Reddit posts to drive traffic (organic, not scraped)
5. Wait for network effects to kick in

**Realistic Timeline:** Phase 3 (after validating personal tracker works)

---

### Option C: Hybrid Approach (Best of Both Worlds)

**The Concept:**
- Build native community as foundation (Option B)
- Let users OPTIONALLY link their Reddit username
- With explicit consent, analyze their Reddit post history
- Match them with both in-app users AND similar Reddit posters
- Aggregate insights from Reddit without storing personal data long-term

**How It Works:**
1. User signs up and tracks products in your app
2. User sees "Connect Reddit to find more matches?" (100% optional)
3. User authorizes Reddit OAuth
4. System analyzes their r/SkincareAddiction posts temporarily
5. Shows potential matches from Reddit with links to relevant posts
6. User manually evaluates and saves useful insights
7. No long-term storage of Reddit data (stay within TOS)

**Pros:**
- Gets value from Reddit without unsolicited scraping
- User consent makes it legal and ethical
- Native community still grows independently
- Best matching accuracy (structured + unstructured data)

**Cons:**
- Complex to build (two matching systems)
- Still need legal review for Reddit integration
- Users must have Reddit accounts
- Reddit OAuth adds dependency

**Realistic Timeline:** Phase 4+ (after native community is established)

---

### Option D: Reddit Search Tool (Lowest Risk)

**The Concept:**
- Don't scrape or store Reddit data at all
- Build a smart search interface for Reddit
- Help users search r/SkincareAddiction better
- "Find posts from people with [your skin type]"
- Users manually evaluate matches

**Example:**
User inputs: "oily, dehydrated, cystic acne"
→ Tool generates optimized Reddit search queries
→ Shows results with highlighted skin type mentions
→ User clicks through to Reddit to read
→ User can save insights to their knowledge base in your app

**Pros:**
- Stays within Reddit TOS (just facilitating search)
- No legal risk (not storing data)
- Simple to build (API calls + UI)
- Still provides value (better discovery)
- No privacy concerns

**Cons:**
- Less powerful than automated matching
- Requires manual user effort
- Dependent on Reddit search quality
- No pattern detection across matches

**Realistic Timeline:** Could be Phase 2 feature (lightweight)

---

### Option E: Manual Reddit Research (Phase 1 Reality)

**The Concept:**
- YOU personally crawl Reddit manually
- Find users who seem to have similar skin
- Copy valuable insights into your knowledge base
- Share patterns you notice with friends using your app
- No automation, no scraping, no risk

**Pros:**
- Zero legal/ethical concerns
- You're already doing this anyway
- Can start today
- Validates the concept before building tech
- Highest quality curation

**Cons:**
- Doesn't scale
- Manual effort required
- Only helps you, not other users (initially)

**Realistic Timeline:** Now through Phase 2

---

### Recommended Strategy: Progressive Enhancement

**Phase 1-2: Manual Research**
- Use Reddit manually for your own learning
- Build personal tracker and knowledge base
- Prove to yourself that tracking works

**Phase 3: Native Community**
- Launch community features with structured profiles
- Match users within your app
- Get to 50-100 active users

**Phase 4: Evaluate Reddit Integration**
- If native community is working: Consider Option D (search tool)
- If growth is slow: Consider Option C (opt-in Reddit linking)
- Never do Option A (unsolicited crawling) without legal counsel

**Phase 5+: Advanced Matching**
- NLP on your own community's product notes
- Pattern detection across matched users
- Predictive recommendations
- Potentially official Reddit partnership if you have traction

---

### Key Decision Criteria

**Before building ANY Reddit integration, ask:**

1. **Legal**: Have you consulted a lawyer about Reddit TOS?
2. **Ethical**: Would you be comfortable if Reddit users knew you were doing this?
3. **Technical**: Do you have infrastructure for ongoing crawling/maintenance?
4. **Privacy**: How will you handle GDPR/CCPA requirements?
5. **Necessity**: Can you achieve similar outcomes with native community?
6. **Sustainability**: What if Reddit changes API access tomorrow?

**Green lights to proceed:**
- All legal questions answered satisfactorily
- User consent is explicit and informed
- You have a lawyer's blessing
- You're providing clear value to both sides (your users AND Reddit users)

**Red flags to stop:**
- Any legal ambiguity
- Scraping without consent
- Storing sensitive data without protection
- No plan for API access loss

---

### The Pragmatic Path Forward

**What to build now:**
- Personal tracker (Phase 1)
- Knowledge base for saving Reddit insights manually (Phase 2)
- Reddit search helper tool (Phase 2, low-risk)

**What to validate first:**
- Do people actually use the personal tracker consistently?
- Do your friends want skin twin matching?
- Is there demand beyond your immediate circle?

**What to defer:**
- Any automated Reddit crawling (Phase 4+ only)
- Complex NLP for skin type extraction
- Large-scale community features

**What to never do without legal review:**
- Scraping Reddit at scale
- Storing Reddit usernames with skin conditions
- Anything that feels ethically questionable

---

## Technical Vision

### Architecture Considerations

**Platform Choice:**
- **Web app first** - Accessible from phone and desktop
- Responsive design for mobile (primary use case)
- Progressive Web App (PWA) for mobile-like experience
- Native mobile apps in future if traction warrants

**Technology Stack (Recommendations):**
- **Frontend:** React or Next.js (familiar, good ecosystem)
- **Backend:** Node.js/Express or Python/FastAPI
- **Database:** PostgreSQL (structured data, good for relationships)
- **Authentication:** Clerk, Supabase Auth, or Firebase Auth
- **Hosting:** Vercel, Netlify, or Railway (easy deployment)

**Key Technical Requirements:**
- Fast search/filtering (indexed database queries)
- Mobile-responsive UI
- Offline capability (PWA) for viewing data
- Data export functionality
- Privacy controls for Phase 3+

---

### Data Model (Initial)

**Users**
- ID, email, name, created_at
- Skin profile (type, concerns) - Phase 2+

**Products**
- ID, user_id, product_name, brand, category
- Rating (scale or enum)
- Date started, date ended
- Notes (text)
- Created_at, updated_at

**Ingredients** (Phase 2)
- ID, name, common_names
- Description, comedogenic rating

**Product_Ingredients** (Phase 2)
- Links products to ingredients

**Knowledge_Items** (Phase 2)
- ID, user_id, title, content, source, tags
- Created_at

**Skin_Twin_Matches** (Phase 3)
- Links users to their matches with similarity scores

---

## Design Principles

### Core Values

1. **Privacy First**
   - Personal data is private by default
   - Opt-in for all community features
   - Clear controls over what's shared
   - Ability to export and delete data

2. **Simplicity**
   - Don't overwhelm with features
   - Make common tasks fast and easy
   - Progressive disclosure of complexity

3. **Trust & Accuracy**
   - User's own data is the source of truth
   - Educational content should be evidence-based
   - Transparent about how matching works

4. **Mobile-Optimized**
   - Most interactions happen while shopping or doing skincare
   - Fast, thumb-friendly interface
   - Works well on various screen sizes

### UI/UX Guidelines

- **Clean and minimal** - Not cluttered with skincare imagery
- **Fast interaction** - No unnecessary clicks or forms
- **Visual feedback** - Clear indicators of product ratings
- **Smart defaults** - Pre-fill what you can, minimize typing
- **Gentle colors** - Calm, not overly feminine or medical
- **Accessible** - Works for all users, including those with visual needs

---

## Success Criteria

### Phase 1 Success Looks Like:
- You personally use it for 2+ weeks without abandoning
- Adding a product takes <60 seconds
- You've successfully avoided re-buying a product that didn't work
- You've discovered at least one pattern in your data
- 5-10 beta users find it valuable

### Long-term Success Looks Like:
- 1,000+ active users tracking their skincare
- 70%+ users return to app when considering new products
- Strong skin twin matches (verified by users)
- Community generates valuable discussions
- Positive testimonials about finding solutions

---

## Risks & Mitigations

### Risk 1: Too Ambitious for Solo Build
**Mitigation:** Strict phased approach, MVP first, validate before building community features

### Risk 2: Low User Retention
**Mitigation:** Make core value (personal database) strong enough to stand alone, focus on building habit

### Risk 3: Privacy Concerns with Community Features
**Mitigation:** Privacy-first design, opt-in for all sharing, clear controls, legal review before Phase 3

### Risk 4: Matching Algorithm Complexity
**Mitigation:** Start simple (skin type + product overlap), iterate based on feedback, don't over-engineer

### Risk 5: User-Generated Content Quality/Safety
**Mitigation:** Start with small beta community, implement reporting, moderation tools before scaling

---

## Open Questions to Resolve

1. **Authentication:** Social login (Google/Apple) or email/password?
2. **Product Database:** Build our own or integrate with existing API (like Amazon or Skincare Database)?
3. **Photos:** Allow before/after photos in Phase 1 or wait until Phase 2?
4. **Monetization:** Free forever, freemium, or subscription? (Decide before Phase 3)
5. **Community Size:** Limit beta to certain number? Invite-only initially?

---

## Next Steps

1. **Review and refine this brief** - Add your specific thoughts and priorities
2. **Set up development environment** - Choose tech stack based on your comfort level
3. **Build Phase 1 MVP with Claude Code**
   - Start with basic authentication
   - Build product CRUD (Create, Read, Update, Delete)
   - Add search and filter
   - Create simple dashboard
4. **Use it yourself for 2 weeks** - Dogfood heavily
5. **Iterate based on your experience** - What's missing? What's annoying?
6. **Share with 3-5 close friends** who deal with skincare concerns
7. **Decide on Phase 2** based on Phase 1 learnings

---

## Resources to Reference

- **r/SkincareAddiction** - See how people currently discuss products and seek advice
- **Skincare ingredient databases** - CosDNA, INCIDecoder for inspiration
- **Similar apps** - SkinSort, TroveSkin (study what they do well/poorly)
- **Design inspiration** - Simple, clean health tracking apps

---

## Appendix: Feature Ideas for Later

*Parking lot for ideas that don't fit Phase 1-4 but worth capturing:*

- **Product reformulation tracking** (Phase 2+)
  - Version/batch tracking for products
  - Compare old vs new formulas
  - Alert users when trying a reformulated product
  - Community-sourced reformulation reports
- Routine builder (morning/evening routines with your products)
- Reminder system for repurchasing holy grails
- Price tracking integration
- Ingredient learn mode (flashcards for common ingredients)
- Dermatologist verification badges for educational content
- Location-based product availability
- Integration with pharmacy/retailer APIs
- AI-powered ingredient analysis from product photos
- Seasonal routine variations
- Skin diary with daily notes and triggers
- Batch/lot number tracking for identifying specific problematic batches

