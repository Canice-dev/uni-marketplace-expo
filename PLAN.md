MarketPlace V1 Development Plan

1. Product Goal

Build and launch a fast, simple V1 of MarketPlace for universitystudents.

MarketPlace is a student-focused marketplace where users can discoverproperties, gadgets, furniture, and other useful items fromtrusted/admin-approved listings instead of searching through multipleWhatsApp groups.

V1 principle

Build the smallest useful marketplace first. Do not build every ideain the design mockup.

The V1 should make this flow work extremely well:

Sign up → Browse → Search/filter → View listing → Save → Contactseller/admin

Admins should be able to:

Sign in → Create listing → Upload photos → Publish/approve → Managelistings

2. Recommended V1 Stack

Mobile

React Native

Expo

Expo Router

TypeScript

NativeWind

React Native Reanimated where animation is actually useful

Backend

Supabase

PostgreSQL database

Authentication

Storage

Row Level Security

Images

Use Supabase Storage for listing images.

Icons

Lucide React Native or another lightweight icon library

State / Data

Start simple:

React hooks

Context only where needed

Supabase queries directly from feature services

Do not introduce Redux/Zustand unless V1 actually needs it.

3. V1 Design Direction

Use the approved light-mode design as the visual reference.

Theme

White / off-white background

Very dark charcoal primary buttons

Black text

Soft gray secondary surfaces

Subtle cyan accent

Very subtle blue/cyan gradient only for branding or selected states

Soft shadows

Rounded cards

Clean spacing

Minimal borders

Premium Apple/Android-inspired UI

Important

Do not use bright blue as the main button color.

Primary button

Dark charcoal/black with a subtle cyan glow or cyan edge whereappropriate.

Examples:

#111418

#171A1F

Accent

Use cyan sparingly:

#19D3E6

Background

#FFFFFF

#F7F8FA

Text

Primary: #111111

Secondary: #6B7280

Borders

#E5E7EB

4. V1 Screens

Only build these screens for the first release.

A. Splash

Purpose:

Show MarketPlace branding

Very short loading state

Check authentication

Navigate to the correct screen

Elements:

MarketPlace logo

Small tagline

Minimal animation

B. Welcome / Onboarding

One strong onboarding screen is enough for V1.

Copy:

Everything you need, in one place.

Find properties, gadgets, furniture and useful items from trustedstudent-focused listings.

Buttons:

Get Started

Sign In

Do not create a long onboarding carousel for V1.

5. Authentication

Sign Up

Fields:

Full name

Email

Password

Actions:

Create account

Continue with Google if configured

Go to Sign In

Sign In

Fields:

Email

Password

Actions:

Sign In

Forgot password

Continue with Google if configured

Go to Sign Up

V1 authentication rule

Keep authentication simple.

Apple Sign In can be added after launch if it slows development.

6. Home

This is the most important screen.

Header

Greeting

Notification icon

Search bar

Example:

Good morning 👋

Search properties, gadgets, items...

Featured Listings

Horizontal cards.

Use this for:

Featured properties

Limited-time offers

Promoted listings

Each card should show:

Image

Category

Title

Location

Price

Save icon

Optional discount badge

Categories

Keep categories simple:

Houses

Apartments

Land

Gadgets

Furniture

Other

Recent Listings

Vertical list.

Each item:

Image

Title

Location

Price

Category

Save button

7. Search

Search should support both properties and general items.

Search input

Placeholder:

Search anything...

Categories

All

Houses

Apartments

Land

Gadgets

Furniture

Other

Filters

V1 filters:

Minimum price

Maximum price

Category

Location

Sort by

Sort options:

Newest

Price: Low to High

Price: High to Low

Do not build complicated map search in V1.

8. Search Results

Show:

Number of results

Sort button

Listing cards

Example:

236 results

Each listing:

Image

Title

Location

Price

Category

Save button

Empty state:

No listings found

Try changing your filters or search term.

9. Listing Details

This is the second most important screen after Home.

Header

Back

Save

Share

Image gallery

Large listing image.

Support multiple images.

Information

Show:

Title

Category

Price

Location

Description

Listing date

Seller/admin information

For properties, optionally show:

Bedrooms

Bathrooms

Size

Do not overcomplicate property specifications for V1.

Actions

Primary:

Contact

Secondary:

Make an Offer only if the backend supports it.

For V1, a simple Contact action is enough.

10. Saved

Users can save listings.

Show:

Saved listing cards

Category filters

Allow:

Open listing

Remove from saved

Empty state:

Nothing saved yet

Save listings you want to come back to.

11. Profile

Profile should remain simple.

Show:

Profile picture

Name

Email

Account type

Menu:

My Listings

Saved

Notifications

Settings

Help

Logout

Delete Account

12. Admin / Listing Creation

This is essential because MarketPlace is admin-driven.

Only admins should access listing management.

Admin Dashboard

Show:

Total listings

Active listings

Sold listings

Pending listings

Actions:

Add listing

Manage listings

Do not build advanced analytics in V1.

13. Create Listing

Admin can create:

Property

Gadget

Furniture

Other item

Fields:

Title

Category

Description

Price

Location

Images

Property-specific optional fields:

Bedrooms

Bathrooms

Size

Actions:

Publish Listing

14. Manage Listings

Admin can:

View listings

Edit listing

Delete listing

Mark as sold

Feature/unfeature listing

Keep this screen simple.

15. Notifications

V1 notification examples:

New property listed

New item available

Your listing was published

Your listing was marked as sold

For the first release, notifications can initially be stored in thedatabase and displayed inside the app.

Real push notifications can be added immediately after the coremarketplace works.

16. Settings

Keep V1 settings small.

Settings

Notification preferences

Privacy

Account

Change password

Help

About MarketPlace

Account actions:

Logout

Delete account

17. Do NOT Build in V1

These features can wait.

Avoid for now

Payments

In-app checkout

Complex messaging system

Real-time chat

Map-based search

Reviews and ratings

Seller verification system

AI recommendations

Advanced analytics

Referral system

Loyalty points

Multi-vendor payments

Complex bidding

Subscription/paywall

Apple Sign In if it blocks launch

Complex push-notification infrastructure

The goal is to get real users browsing real listings as quickly aspossible.

18. Database Structure

Use Supabase PostgreSQL.

profiles

id
full_name
email
avatar_url
role
created_at

role:

user
admin

properties / listings

Prefer one general listings table for V1 because MarketPlace is notonly for properties.

id
title
description
category
price
location
city
state
images
is_featured
is_sold
status
created_by
created_at
updated_at

Possible categories:

house
apartment
land
gadget
furniture
vehicle
other

Possible status:

published
draft
archived

saved_listings

id
user_id
listing_id
created_at

Add a unique constraint on:

user_id + listing_id

This prevents duplicate saves.

notifications

id
user_id
title
message
type
is_read
created_at

19. Storage

Create a Supabase Storage bucket:

listing-images

Image path example:

listing-images/{listing_id}/{image_id}.jpg

Only authorized admins should upload listing images.

Public users can read published listing images.

20. Row Level Security

RLS must be enabled.

Basic rules:

Listings

Public users:

Can read published listings.

Admins:

Can create listings.

Can update listings.

Can delete listings.

Saved listings

Users:

Can create their own saves.

Can read their own saves.

Can delete their own saves.

Profiles

Users:

Can read/update their own profile.

Admins:

Can manage listings.

Never solve RLS errors by permanently disabling RLS.

21. Navigation

Use Expo Router.

Recommended structure:

app/
├── \_layout.tsx
├── index.tsx
│
├── (auth)/
│ ├── welcome.tsx
│ ├── sign-in.tsx
│ └── sign-up.tsx
│
├── (tabs)/
│ ├── \_layout.tsx
│ ├── index.tsx
│ ├── search.tsx
│ ├── saved.tsx
│ └── profile.tsx
│
├── listing/
│ └── [id].tsx
│
├── admin/
│ ├── index.tsx
│ ├── create.tsx
│ └── listings.tsx
│
├── notifications.tsx
└── settings.tsx

Bottom navigation:

Home
Search

- Saved
  Profile

The + button opens listing creation for admins.

For normal users, hide or disable the admin action.

22. Component System

Build reusable components before building every screen.

Core components

Button
Input
SearchBar
ListingCard
FeaturedCard
CategoryChip
FilterChip
PriceRange
Avatar
IconButton
SectionHeader
EmptyState
LoadingState
BottomSheet
Modal

Button variants

primary
secondary
ghost
danger

Primary button:

Dark charcoal

White text

Rounded

Subtle cyan accent

23. Listing Card

Create one reusable listing card and use it everywhere.

Card should support:

image
title
price
location
category
isFeatured
isSaved
isSold

Do not create separate card implementations for Home, Search and Saved.

24. Loading States

Use skeleton loaders for:

Home

Search results

Listing details

Saved listings

Avoid showing a blank screen while data loads.

25. Error Handling

Every network request should have:

Loading state

Success state

Empty state

Error state

Example:

Something went wrong

We couldn't load the listings.

Try Again

26. Development Order

Build in this order to reach V1 quickly.

Phase 1 --- Foundation

Create Expo project

Configure TypeScript

Configure NativeWind

Set up Expo Router

Create theme tokens

Create reusable Button/Input/Card components

Set up Supabase

Configure environment variables

Phase 2 --- Authentication

Sign Up

Sign In

Auth session handling

Profile creation

Role handling

Protected routes

At the end:

A user can create an account and sign in.

Phase 3 --- Listings

Create database tables

Create Storage bucket

Admin listing creation

Image upload

Publish listing

Home listing feed

Listing details

At the end:

An admin can publish a listing and users can see it.

Phase 4 --- Discovery

Search

Category filtering

Price filtering

Location filtering

Sorting

Search results

At the end:

A user can find a specific item quickly.

Phase 5 --- Saved

Save listing

Unsave listing

Saved screen

Sync saves with Supabase

Phase 6 --- Profile

Profile

Settings

Notifications

Logout

Delete account

Phase 7 --- Admin

Admin dashboard

Manage listings

Edit listing

Delete listing

Mark sold

Feature listing

Phase 8 --- Polish

Loading skeletons

Empty states

Error handling

Animations

Image optimization

Keyboard handling

Android testing

iOS testing if available

Performance cleanup

App icon and splash screen

27. V1 Definition of Done

V1 is ready when this complete journey works:

Normal user

Open app
↓
Welcome
↓
Sign Up
↓
Home
↓
Search
↓
Filter
↓
Open listing
↓
Save listing
↓
View Saved
↓
View Profile
↓
Logout

Admin

Sign In
↓
Admin Dashboard
↓
Create Listing
↓
Upload Images
↓
Publish
↓
Listing appears on Home
↓
Edit / Delete / Mark Sold

If these two flows work reliably, V1 is complete.

28. Speed Rules

To develop faster:

Rule 1

Do not perfect every screen before connecting the backend.

Build:

UI → backend → test → polish

Rule 2

Use mock data only long enough to build the first UI.

Then connect Supabase early.

Rule 3

Reuse components.

One ListingCard should power:

Home

Search

Saved

Admin

Rule 4

Do not build features because they look good in the design mockup.

Only build features that help the core marketplace loop.

Rule 5

Keep the first database schema small.

Add columns only when a real feature requires them.

29. Suggested V1 Milestones

Milestone 1

UI foundation

Theme

Navigation

Components

Home UI

Milestone 2

Authentication

Sign up

Sign in

Sessions

Roles

Milestone 3

Marketplace

Database

Admin create listing

Image upload

Home feed

Listing details

Milestone 4

Discovery

Search

Filters

Categories

Sorting

Milestone 5

User features

Saved

Profile

Notifications

Settings

Milestone 6

Admin

Manage listings

Edit

Delete

Sold

Featured

Milestone 7

Launch polish

Error handling

Loading states

Performance

Testing

Production build

30. Future V2

After real users start using MarketPlace, consider:

Real-time messaging

Seller/user chat

Offers

Payments

Verified sellers

Reviews

Ratings

Map search

Push notifications

Recommendation system

Admin analytics

Featured listing payments

Premium subscriptions

AI-powered search

Only add these after learning what users actually need.

Final Product Principle

MarketPlace should not try to become a huge marketplace on day one.

The V1 objective is simple:

Help a student find something useful quickly, understand thelisting, save it, and contact the person/admin responsible for it.

Build that loop extremely well first.
