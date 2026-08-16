## V1

Build the smallest useful marketplace first. Do not build every ideain the design mockup.

The V1 should make this flow work extremely well:

Sign up → Browse → Search/filter → View listing → Save → Contactseller/admin

Admins should be able to:

Sign in → Create listing → Upload photos → Publish/approve → Managelistings

# Design Direction

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

# Screens

Only build these screens for the first release.

- Splash

Purpose:

Show MarketPlace branding

Very short loading state

Check authentication

Navigate to the correct screen

Elements:

MarketPlace logo

Small tagline

Minimal animation

- Welcome

One strong onboarding screen is enough for V1.

Copy:

Everything you need, in one place.

Find properties, gadgets, furniture and useful items from trustedstudent-focused listings.

Buttons:

Get Started

Sign In

Do not create a long onboarding carousel for V1.

- Authentication

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

# Home

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

# Search

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

# Search Results

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

# Listing Details

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

# Saved

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

# Profile

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

# Admin / Listing Creation

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

# Create Listing

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

# Manage Listings

Admin can:

View listings

Edit listing

Delete listing

Mark as sold

Feature/unfeature listing

Keep this screen simple.

# Notifications

V1 notification examples:

New property listed

New item available

Your listing was published

Your listing was marked as sold

For the first release, notifications can initially be stored in thedatabase and displayed inside the app.

Real push notifications can be added immediately after the coremarketplace works.

# Settings

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

# Do NOT Build in V1

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

# Database Structure

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

# Storage

Create a Supabase Storage bucket:

listing-images

Image path example:

listing-images/{listing_id}/{image_id}.jpg

Only authorized admins should upload listing images.

Public users can read published listing images.

# Row Level Security

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

# Loading States

Use skeleton loaders for:

Home

Search results

Listing details

Saved listings

Avoid showing a blank screen while data loads.

# Error Handling

Every network request should have:

Loading state

Success state

Empty state

Error state

Example:

Something went wrong

We couldn't load the listings.

Try Again

# FINAL TOUCHES

App icon and splash screen

## V2

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
