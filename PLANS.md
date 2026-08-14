# MarketPlace App — Implementation Plan

> React Native + Expo · Clerk Auth · Supabase DB + Storage  
> Target: Nigeria · Currency: ₦ · MVP / v1

---

## Table of Contents

1. [Tech Stack & Versions](#1-tech-stack--versions)
2. [Folder Structure](#2-folder-structure)
3. [Environment Variables](#3-environment-variables)
4. [Supabase Setup](#4-supabase-setup)
5. [Clerk Setup](#5-clerk-setup)
6. [Clerk ↔ Supabase JWT Integration](#6-clerk--supabase-jwt-integration)
7. [Database Schema](#7-database-schema)
8. [Row Level Security (RLS) Policies](#8-row-level-security-rls-policies)
9. [Supabase Storage](#9-supabase-storage)
10. [Build Order — Screen by Screen](#10-build-order--screen-by-screen)
11. [Key Implementation Details](#11-key-implementation-details)
12. [Navigation Structure](#12-navigation-structure)
13. [API / Data Layer Patterns](#13-api--data-layer-patterns)
14. [Deployment Checklist](#14-deployment-checklist)
15. [Assumptions & Risks Reference](#15-assumptions--risks-reference)

---

## 1. Tech Stack & Versions

| Tool          | Version / Notes                                    |
| ------------- | -------------------------------------------------- |
| Expo SDK      | **51** (latest stable)                             |
| React Native  | via Expo SDK 51                                    |
| Expo Router   | **v3** (file-based routing)                        |
| Clerk RN SDK  | `@clerk/clerk-expo` latest                         |
| Supabase JS   | `@supabase/supabase-js` v2                         |
| React Query   | `@tanstack/react-query` v5 (data fetching + cache) |
| Zustand       | v4 (lightweight global state)                      |
| Image Picker  | `expo-image-picker`                                |
| Location      | `expo-location`                                    |
| Map View      | `react-native-maps`                                |
| Image Display | `expo-image` (better caching than RN Image)        |
| Form handling | `react-hook-form` + `zod` validation               |
| Styling       | `StyleSheet` + `nativewind` (Tailwind for RN)      |

> **Do not upgrade Expo SDK mid-project.** Pin the version in `package.json` and only upgrade intentionally.

---

## 2. Folder Structure

```
marketplace/
├── app/                          # Expo Router — all screens live here
│   ├── (auth)/                   # Auth group — no tab bar
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/                   # Main app — bottom tab bar
│   │   ├── _layout.tsx           # Tab bar config
│   │   ├── index.tsx             # Home
│   │   ├── search.tsx            # Search + filter
│   │   ├── create.tsx            # Create listing (sellers only)
│   │   ├── saved.tsx             # Saved listings
│   │   └── profile.tsx           # Profile
│   ├── listing/
│   │   └── [id].tsx              # Listing detail (dynamic route)
│   ├── seller-apply.tsx          # Seller application form
│   ├── admin/
│   │   ├── _layout.tsx
│   │   └── index.tsx             # Super admin — pending sellers
│   └── _layout.tsx               # Root layout (Clerk provider)
│
├── components/
│   ├── ui/                       # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── BottomSheet.tsx
│   ├── listing/
│   │   ├── ListingCard.tsx       # Card used in home + search
│   │   ├── ListingGrid.tsx       # Grid wrapper
│   │   ├── PhotoCarousel.tsx     # Detail screen carousel
│   │   ├── FilterPanel.tsx       # Search filters
│   │   └── CategoryPills.tsx     # Horizontal category scroll
│   └── layout/
│       ├── ScreenHeader.tsx
│       └── EmptyState.tsx
│
├── lib/
│   ├── supabase.ts               # Supabase client (singleton)
│   ├── clerk.ts                  # Clerk token helper
│   └── utils.ts                  # formatPrice, formatPhone, etc.
│
├── hooks/
│   ├── useListings.ts
│   ├── useSavedListings.ts
│   ├── useSellerApplication.ts
│   └── useCurrentUser.ts
│
├── services/
│   ├── listings.ts               # All listing DB calls
│   ├── users.ts                  # User DB calls
│   ├── saved.ts                  # Save/unsave logic
│   └── storage.ts                # Photo upload helpers
│
├── stores/
│   └── filterStore.ts            # Zustand — search filters
│
├── constants/
│   ├── categories.ts             # Category list
│   └── theme.ts                  # Colors, font sizes
│
├── types/
│   └── index.ts                  # TypeScript types for all entities
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── .env.local                    # Never commit — see section 3
├── app.json
├── package.json
└── tsconfig.json
```

---

## 3. Environment Variables

Create `.env.local` at the root. **Never commit this file.**

```bash
# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Clerk Webhook Secret (used server-side / Supabase Edge Function)
CLERK_WEBHOOK_SECRET=whsec_...
```

Add `.env.local` to `.gitignore` immediately.

---

## 4. Supabase Setup

### Steps in the Supabase Dashboard

1. Create a new project — choose region closest to Nigeria (Europe West is closest currently)
2. Go to **Settings → API** — copy `Project URL` and `anon public` key
3. Go to **Authentication → JWT Settings** — you will paste Clerk's JWKS URL here (see Section 6)
4. Enable **Row Level Security** on all tables (do this before writing any data)
5. Create a **Storage bucket** called `listing-photos` — set to **Public** so photo URLs work without auth

---

## 5. Clerk Setup

1. Create a Clerk application at `clerk.com`
2. Enable **Email/Password**, **Google OAuth**, **Apple OAuth** sign-in methods
3. In Clerk Dashboard → **JWT Templates** → create a new template named `supabase`:
   ```json
   {
     "aud": "authenticated",
     "role": "authenticated"
   }
   ```
4. Copy the **JWKS URL** from Clerk (looks like `https://your-app.clerk.accounts.dev/.well-known/jwks.json`)
5. In Clerk Dashboard → **Webhooks** → create a webhook pointing to your Supabase Edge Function (Section 6) for the `user.created` event

---

## 6. Clerk ↔ Supabase JWT Integration

This is the most critical integration. Do this before writing any screens.

### Step 1 — Tell Supabase to trust Clerk tokens

In **Supabase Dashboard → Settings → API → JWT Settings**:

- Set `JWT Secret` to `JWKS URL` mode
- Paste your Clerk JWKS URL

### Step 2 — Supabase client with Clerk token

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/clerk-expo";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export function useSupabaseClient() {
  const { getToken } = useAuth();

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        const clerkToken = await getToken({ template: "supabase" });
        const headers = new Headers(options?.headers);
        headers.set("Authorization", `Bearer ${clerkToken}`);
        return fetch(url, { ...options, headers });
      },
    },
  });
}
```

> Use this hook everywhere you query Supabase. RLS uses the Clerk JWT to identify the user.

### Step 3 — Sync Clerk user to Supabase on sign-up

Create a **Supabase Edge Function** (`supabase/functions/clerk-webhook/index.ts`):

```typescript
import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  const payload = await req.json();

  if (payload.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = payload.data;
    const email = email_addresses[0]?.email_address;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    await supabase.from("users").insert({
      clerk_id: id,
      email,
      full_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      is_seller: false,
      is_super_admin: false,
    });
  }

  return new Response("ok", { status: 200 });
});
```

Deploy with: `supabase functions deploy clerk-webhook`

---

## 7. Database Schema

Run these SQL statements in **Supabase → SQL Editor** in order.

```sql
-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
create table users (
  id             uuid primary key default gen_random_uuid(),
  clerk_id       text unique not null,
  full_name      text not null,
  email          text unique not null,
  is_seller      boolean default false,
  is_super_admin boolean default false,
  created_at     timestamptz default now()
);

-- ─────────────────────────────────────────
-- SELLER APPLICATIONS
-- ─────────────────────────────────────────
create table seller_applications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  status     text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- LISTINGS
-- ─────────────────────────────────────────
create type listing_category as enum (
  'apartment', 'self-con', 'semi-self-contained', 'land', 'items', 'others'
);

create type listing_status as enum ('active', 'sold', 'deleted');

create table listings (
  id               uuid primary key default gen_random_uuid(),
  seller_id        uuid references users(id) on delete cascade,
  title            text not null,
  description      text,
  category         listing_category not null,
  price            numeric(12, 2) not null,
  address          text not null,
  lat              double precision,
  lng              double precision,
  whatsapp_number  text not null,
  call_number      text,
  status           listing_status default 'active',
  created_at       timestamptz default now()
);

-- Index for common queries
create index listings_category_idx on listings(category);
create index listings_status_idx on listings(status);
create index listings_seller_idx on listings(seller_id);
create index listings_created_idx on listings(created_at desc);

-- ─────────────────────────────────────────
-- LISTING PHOTOS
-- ─────────────────────────────────────────
create table listing_photos (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  url        text not null,
  "order"    int default 0,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- SAVED LISTINGS
-- ─────────────────────────────────────────
create table saved_listings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, listing_id)             -- prevent duplicate saves
);
```

---

## 8. Row Level Security (RLS) Policies

Enable RLS on every table, then apply these policies.

```sql
-- Enable RLS
alter table users              enable row level security;
alter table seller_applications enable row level security;
alter table listings           enable row level security;
alter table listing_photos     enable row level security;
alter table saved_listings     enable row level security;

-- Helper function to get current user's Supabase id from Clerk JWT
create or replace function get_my_user_id()
returns uuid as $$
  select id from users
  where clerk_id = auth.jwt() ->> 'sub'
  limit 1;
$$ language sql stable;

-- ── USERS ──
create policy "Users can read own row"
  on users for select using (clerk_id = auth.jwt() ->> 'sub');

create policy "Users can update own row"
  on users for update using (clerk_id = auth.jwt() ->> 'sub');

-- ── LISTINGS ──
create policy "Anyone authenticated can read active listings"
  on listings for select using (status = 'active');

create policy "Sellers can insert own listings"
  on listings for insert
  with check (
    seller_id = get_my_user_id() and
    exists (select 1 from users where id = get_my_user_id() and is_seller = true)
  );

create policy "Sellers can update own listings"
  on listings for update
  using (seller_id = get_my_user_id());

-- ── LISTING PHOTOS ──
create policy "Anyone authenticated can read photos"
  on listing_photos for select using (true);

create policy "Sellers can insert photos for own listings"
  on listing_photos for insert
  with check (
    exists (
      select 1 from listings
      where id = listing_id and seller_id = get_my_user_id()
    )
  );

-- ── SAVED LISTINGS ──
create policy "Users can read own saved listings"
  on saved_listings for select using (user_id = get_my_user_id());

create policy "Users can save listings"
  on saved_listings for insert with check (user_id = get_my_user_id());

create policy "Users can unsave listings"
  on saved_listings for delete using (user_id = get_my_user_id());

-- ── SELLER APPLICATIONS ──
create policy "Users can submit own application"
  on seller_applications for insert with check (user_id = get_my_user_id());

create policy "Users can read own application"
  on seller_applications for select using (user_id = get_my_user_id());
```

> **Super admin access** (approve/reject sellers): For v1, you will do this directly in the Supabase Dashboard by setting `is_seller = true` on the users table. The in-app admin screen (Phase 5) will use the service role key via an Edge Function — never expose the service role key in the mobile app.

---

## 9. Supabase Storage

```sql
-- Run in SQL editor to set up storage policy for listing-photos bucket
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true);

-- Allow authenticated users to upload
create policy "Authenticated users can upload photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-photos');

-- Public read
create policy "Public read listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

-- Sellers can delete own photos
create policy "Users can delete own photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-photos' and auth.uid()::text = (storage.foldername(name))[1]);
```

### Photo upload helper

```typescript
// services/storage.ts
export async function uploadListingPhoto(
  supabase: SupabaseClient,
  userId: string,
  listingId: string,
  uri: string,
  order: number,
): Promise<string> {
  const ext = uri.split(".").pop();
  const path = `${userId}/${listingId}/${order}.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from("listing-photos")
    .upload(path, blob, { contentType: `image/${ext}` });

  if (error) throw error;

  const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);

  return data.publicUrl;
}
```

---

## 10. Build Order — Screen by Screen

Build in this exact order. Each phase is shippable before the next begins.

---

### Phase 0 — Project Bootstrap (Day 1)

```bash
npx create-expo-app@latest marketplace --template blank-typescript
cd marketplace
npx expo install expo-router expo-image expo-image-picker expo-location
npx expo install react-native-maps
npm install @clerk/clerk-expo @supabase/supabase-js
npm install @tanstack/react-query zustand
npm install react-hook-form zod @hookform/resolvers
npm install nativewind tailwindcss
```

- Set up Expo Router (file-based navigation)
- Configure `app.json` with bundle identifier (`com.yourname.marketplace`)
- Set up `.env.local`
- Set up `lib/supabase.ts` and `lib/clerk.ts`
- Set up `constants/theme.ts` with brand colors
- Set up `constants/categories.ts`

```typescript
// constants/categories.ts
export const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Apartment", value: "apartment" },
  { label: "Self-Con", value: "self-con" },
  { label: "Semi Self-Contained", value: "semi-self-contained" },
  { label: "Land", value: "land" },
  { label: "Items", value: "items" },
  { label: "Others", value: "others" },
];
```

---

### Phase 1 — Auth Screens (Days 1–2)

**Goal:** User can sign up, sign in, and be redirected to home.

Screens to build:

- `app/(auth)/onboarding.tsx` — 2 slides with "Get Started" CTA
- `app/(auth)/sign-in.tsx` — Email/password + Google + Apple buttons
- `app/(auth)/sign-up.tsx` — Full name, email, password + Google + Apple
- `app/_layout.tsx` — Root layout with `<ClerkProvider>`, redirect logic

**Redirect logic in root `_layout.tsx`:**

```typescript
const { isSignedIn, isLoaded } = useAuth()

if (!isLoaded) return <SplashScreen />
if (!isSignedIn) redirect('/(auth)/onboarding')
else redirect('/(tabs)')
```

**Testing checkpoint:** Can sign up with email, sign in with Google, land on tabs.

---

### Phase 2 — Home + Listing Card (Days 3–5)

**Goal:** Home screen shows real listings from Supabase. Listing card component is reusable.

Screens + components:

- `components/listing/ListingCard.tsx`
  - Photo, title, price (₦ formatted), address, save heart icon
- `components/listing/CategoryPills.tsx`
  - Horizontal scroll of category tabs, first tab = "All"
- `app/(tabs)/index.tsx` — Home screen
  - Search bar (navigates to search screen on press)
  - CategoryPills
  - "Featured Deals" horizontal scroll (most recent 6)
  - "Recent Listings" vertical FlatList

**Data hook:**

```typescript
// hooks/useListings.ts
export function useListings(category?: string) {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: ["listings", category],
    queryFn: async () => {
      let query = supabase
        .from("listings")
        .select("*, listing_photos(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
```

**Price formatting:**

```typescript
// lib/utils.ts
export function formatPrice(price: number): string {
  return `₦${price.toLocaleString("en-NG")}`;
}
```

**Testing checkpoint:** Home screen shows listings filtered by category pill taps.

---

### Phase 3 — Listing Detail Screen (Days 5–7)

**Goal:** Tapping a listing card opens full detail with WhatsApp/call actions.

Screen: `app/listing/[id].tsx`

Components:

- `components/listing/PhotoCarousel.tsx` — swipeable, shows `1/6` counter
- Static map with a single pin (`react-native-maps`)
- WhatsApp button
- Call button
- Save/heart toggle

**WhatsApp deep link:**

```typescript
// lib/utils.ts
export function formatWhatsAppUrl(phone: string, message?: string): string {
  // Normalize Nigerian number to +234 format
  const normalized = phone.startsWith('0')
    ? '+234' + phone.slice(1)
    : phone
  const encoded = encodeURIComponent(message ?? '')
  return `https://wa.me/${normalized}?text=${encoded}`
}

// Usage in screen
<Pressable onPress={() => Linking.openURL(formatWhatsAppUrl(listing.whatsapp_number))}>
  <Text>Chat on WhatsApp</Text>
</Pressable>
```

**Testing checkpoint:** Photos swipe correctly, WhatsApp opens with correct number, map pin shows right location.

---

### Phase 4 — Search + Filter (Days 7–9)

**Goal:** Users can search by keyword, filter by category, price range, and address.

Screens + components:

- `app/(tabs)/search.tsx`
- `components/listing/FilterPanel.tsx` — bottom sheet with filters
- `stores/filterStore.ts` — Zustand store for active filters

**Filter store:**

```typescript
// stores/filterStore.ts
import { create } from "zustand";

interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  address: string;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  category: "all",
  minPrice: 0,
  maxPrice: 100_000_000,
  address: "",
  setFilter: (key, value) => set((s) => ({ ...s, [key]: value })),
  clearFilters: () =>
    set({ category: "all", minPrice: 0, maxPrice: 100_000_000, address: "" }),
}));
```

**Search query (Supabase):**

```typescript
let query = supabase
  .from("listings")
  .select("*, listing_photos(*)")
  .eq("status", "active")
  .gte("price", minPrice)
  .lte("price", maxPrice)
  .order("created_at", { ascending: false });

if (category !== "all") query = query.eq("category", category);
if (address) query = query.ilike("address", `%${address}%`);
if (keyword) query = query.ilike("title", `%${keyword}%`);
```

**Testing checkpoint:** Filter panel opens, applying filters updates results, clearing resets.

---

### Phase 5 — Saved Listings (Day 9–10)

**Goal:** Users can save/unsave listings and see them in the Saved tab.

Screens + logic:

- `app/(tabs)/saved.tsx` — category-filterable grid of saved listings
- Save toggle integrated into `ListingCard` and listing detail screen

**Save service:**

```typescript
// services/saved.ts
export async function toggleSave(
  supabase: SupabaseClient,
  userId: string,
  listingId: string,
  isSaved: boolean,
) {
  if (isSaved) {
    return supabase
      .from("saved_listings")
      .delete()
      .match({ user_id: userId, listing_id: listingId });
  } else {
    return supabase
      .from("saved_listings")
      .insert({ user_id: userId, listing_id: listingId });
  }
}
```

**Testing checkpoint:** Heart toggles, saved count updates, Saved tab reflects changes.

---

### Phase 6 — Create Listing (Days 10–13)

**Goal:** Approved sellers can publish a listing with up to 6 photos.

Screen: `app/(tabs)/create.tsx`

Form fields (react-hook-form + zod):

```typescript
const listingSchema = z.object({
  title: z.string().min(3, "Title too short"),
  category: z.enum([
    "apartment",
    "self-con",
    "semi-self-contained",
    "land",
    "items",
    "others",
  ]),
  price: z.number().positive("Price must be positive"),
  address: z.string().min(5),
  description: z.string().optional(),
  whatsapp_number: z
    .string()
    .regex(/^(\+234|0)[0-9]{10}$/, "Invalid Nigerian number"),
  call_number: z.string().optional(),
});
```

**Create listing flow:**

1. User fills form
2. User picks up to 6 photos from device gallery (`expo-image-picker`)
3. On submit → create `listings` row first (get listing `id`)
4. Upload each photo to Supabase Storage at `userId/listingId/0.jpg` etc.
5. Insert rows into `listing_photos`
6. Navigate to listing detail

**GPS for lat/lng:**

```typescript
const location = await Location.getCurrentPositionAsync({});
setValue("lat", location.coords.latitude);
setValue("lng", location.coords.longitude);
```

**Guard — non-sellers see "Apply to Sell" instead of create form.**

**Testing checkpoint:** Seller creates listing, photos visible in Supabase Storage, listing appears on home feed.

---

### Phase 7 — Seller Application (Day 13–14)

**Goal:** Non-sellers can apply; you (super admin) can approve them.

Screens:

- `app/seller-apply.tsx` — simple form (name pre-filled, "Apply" button)
- `app/admin/index.tsx` — list of pending applications with Approve/Reject

**Approve action (Edge Function or service role key — never in app directly):**

Create a Supabase Edge Function:

```typescript
// supabase/functions/approve-seller/index.ts
Deno.serve(async (req) => {
  const { applicationId, userId, action } = await req.json();
  const supabase = createClient(url, serviceRoleKey);

  if (action === "approve") {
    await supabase.from("users").update({ is_seller: true }).eq("id", userId);
    await supabase
      .from("seller_applications")
      .update({ status: "approved" })
      .eq("id", applicationId);
  } else {
    await supabase
      .from("seller_applications")
      .update({ status: "rejected" })
      .eq("id", applicationId);
  }

  return new Response("ok");
});
```

The admin screen calls this Edge Function with the super admin's Clerk token.

**Guard the admin screen:**

```typescript
const { user } = useCurrentUser()
if (!user?.is_super_admin) return <Redirect href="/(tabs)" />
```

**Testing checkpoint:** Apply as test user, approve in admin screen, user can now create listings.

---

### Phase 8 — Profile Screen (Day 14–15)

**Goal:** Users see their info, listings (if seller), saved count, settings, and can log out.

Screen: `app/(tabs)/profile.tsx`

Sections:

- Avatar (initials fallback), name, email, role badge (Buyer / Seller)
- My Listings (sellers only) — links to a list of their own listings
- Saved count
- Settings row → Appearance, Help Centre, Terms & Conditions, About
- Logout button (`signOut()` from Clerk)
- Delete Account button (marks user deleted — soft delete for v1)

---

### Phase 9 — Polish & Edge Cases (Days 15–18)

- Empty states for every screen (no listings, no saved, no results)
- Loading skeletons for listing cards
- Error boundaries with retry buttons
- Pull-to-refresh on Home and Search
- Sold badge on sold listings
- Seller can edit listing (same form, pre-filled)
- Seller can delete listing (confirm dialog → sets status = 'deleted')
- Seller can mark listing as sold (sets status = 'sold', shows Sold badge)
- Invalid photo handling (corrupt file → skip with error toast)
- Network error handling (show toast, don't crash)

---

## 11. Key Implementation Details

### WhatsApp Number Validation

Nigerian numbers: start with `0` or `+234`, followed by 10 digits.

```typescript
// Valid formats accepted:
// 08012345678  → wa.me/+2348012345678
// +2348012345678 → wa.me/+2348012345678

export function normalizeNigerianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return `+${digits}`;
}
```

### Price Display

Always display with ₦ and comma separators. Never show decimals for round numbers.

```typescript
export function formatPrice(price: number): string {
  if (price % 1 === 0) {
    return `₦${Math.floor(price).toLocaleString("en-NG")}`;
  }
  return `₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}
```

### Photo Upload Order

Always upload photos in parallel for speed:

```typescript
const uploadedUrls = await Promise.all(
  photos.map((uri, i) =>
    uploadListingPhoto(supabase, userId, listingId, uri, i),
  ),
);
```

### Map — Static Pin Only

```typescript
import MapView, { Marker } from 'react-native-maps'

<MapView
  style={{ height: 200, borderRadius: 12 }}
  initialRegion={{
    latitude: listing.lat ?? 6.5244,     // fallback: Lagos
    longitude: listing.lng ?? 3.3792,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
  scrollEnabled={false}
  zoomEnabled={false}
>
  <Marker coordinate={{ latitude: listing.lat, longitude: listing.lng }} />
</MapView>
```

---

## 12. Navigation Structure

```
Root _layout.tsx
│
├── (auth) group          ← No tab bar
│   ├── onboarding
│   ├── sign-in
│   └── sign-up
│
├── (tabs) group          ← Tab bar visible
│   ├── index (Home)
│   ├── search
│   ├── create            ← Tab button = "+" (sellers) or "Apply" (buyers)
│   ├── saved
│   └── profile
│
├── listing/[id]          ← No tab bar (pushed on stack)
├── seller-apply          ← No tab bar
└── admin/index           ← No tab bar (super admin only)
```

---

## 13. API / Data Layer Patterns

All data fetching goes through React Query + service functions. Never call Supabase directly from a screen component.

```
Screen → hook (useListings) → service (listings.ts) → supabase client
```

Always handle loading + error states in hooks:

```typescript
const { data, isLoading, error, refetch } = useListings();
```

Use `queryClient.invalidateQueries` after any mutation (create, update, delete) to keep the cache fresh.

---

## 14. Deployment Checklist

### Before first TestFlight / Play Console upload

- [ ] App name decided and set in `app.json`
- [ ] Bundle ID set (`com.yourname.marketplace`)
- [ ] App icon and splash screen designed and added
- [ ] All `.env` variables set in Expo EAS secrets
- [ ] Clerk production keys (not dev keys) configured
- [ ] Supabase RLS tested with a real user token (not service role)
- [ ] Supabase Storage bucket is public
- [ ] Edge Functions deployed (`clerk-webhook`, `approve-seller`)
- [ ] Clerk webhook URL points to deployed Edge Function
- [ ] Google Maps API key added for `react-native-maps` (iOS + Android keys)
- [ ] Apple sign-in entitlements configured in Expo

### Build with EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform all --profile preview   # for TestFlight/internal testing
eas build --platform all --profile production # for App Store / Play Store
```

---

## 15. Assumptions & Risks Reference

| ID  | Item                                                                     | Status                             |
| --- | ------------------------------------------------------------------------ | ---------------------------------- |
| A1  | Login required to browse                                                 | Confirmed — revisit in v1.1        |
| A2  | Seller approval = manual via Supabase Dashboard first, then in-app admin | Phase 7                            |
| A3  | No listing expiry                                                        | Confirmed                          |
| A4  | Supabase free tier sufficient for v1                                     | Monitor storage usage              |
| A5  | GPS used for lat/lng on listing creation                                 | Phase 6                            |
| A6  | No content moderation on listings for v1                                 | Known risk                         |
| A7  | Clerk user synced to Supabase via webhook                                | Phase 0                            |
| R1  | Clerk ↔ Supabase JWT — must work before any RLS-protected query          | Day 1                              |
| R2  | Login wall may slow early growth                                         | Accepted for v1                    |
| R3  | No app name yet                                                          | Needed before any store submission |
| R4  | 1GB Supabase Storage fills up with photos                                | Monitor — upgrade if needed        |
| R5  | No spam/scam protection                                                  | Manual removal only                |
| R6  | Manual seller approval won't scale                                       | In-app admin screen in Phase 7     |
| R7  | WhatsApp number not validated at DB level                                | Zod validates in form              |

---

## v2 — Things to NOT build now but NOT paint yourself into a corner on

- **Push notifications** — Use Expo Notifications, but don't design DB or Edge Functions around it yet. Just leave room in the `users` table for an `expo_push_token` column.
- **In-app chat** — Keeping contact external (WhatsApp) for v1 is fine. If you add chat later, it'll be a new table and a new tab — no existing code breaks.
- **Guest browsing** — Easy to add: just remove the redirect-to-auth guard on the home screen. The rest of the app already handles unauthenticated vs authenticated states via Clerk's `useAuth()`.
- **Monetization** — A `subscription_tier` column on `users` and feature flags is all you need. Add when ready.
- **Multiple images per listing in different orders** — The `listing_photos.order` column is already there. Drag-to-reorder is a v2 UI feature only.

---

_Generated from architecture interview — Aug 2026_
