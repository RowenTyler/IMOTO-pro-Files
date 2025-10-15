# iMoto Car Marketplace - Complete Website Documentation

## Table of Contents
1. [Overview](#overview)
2. [Design System](#design-system)
3. [Architecture](#architecture)
4. [Pages & Components](#pages--components)
5. [User Flows](#user-flows)
6. [Styling & Dimensions](#styling--dimensions)
7. [Interactions](#interactions)
8. [Data Structure](#data-structure)
9. [Technical Implementation](#technical-implementation)

---

## Overview

### Purpose
iMoto is a South African car marketplace platform that enables users to buy and sell vehicles. The platform provides a modern, user-friendly interface with features including vehicle listings, user authentication, profile management, saved vehicles, and real-time search.

### Key Features
- **Browse Vehicles**: Search and filter through available car listings
- **List Vehicles**: Upload and manage vehicle listings (up to 21 images per listing)
- **User Dashboard**: Manage listings, view saved vehicles, track metrics
- **Profile Management**: Complete user profile with seller information
- **Authentication**: Email/password and OAuth (Google) sign-in
- **Responsive Design**: Mobile-first approach with desktop optimization

---

## Design System

### Color Palette

#### Light Mode (Default)
\`\`\`css
Primary Colors:
- Orange: #FF6700 (Primary CTAs, accents, links)
- Dark Green: #3E5641 (Headings, primary text)
- Medium Green: #6F7F69 (Secondary text, labels)
- Light Green: #9FA791 (Borders, subtle backgrounds)
- Cream: #FFF8E0 (Hover states, backgrounds)

Neutral Colors:
- White: #FFFFFF (Main background)
- Gray Scale: #F5F5F5, #E5E5E5, #CCCCCC
- Black: #000000 (Text, overlays)

Semantic Colors:
- Success: #10B981 (Green - confirmations)
- Error: #EF4444 (Red - errors, destructive actions)
- Warning: #F59E0B (Yellow - warnings, pending states)
- Info: #3B82F6 (Blue - informational messages)
\`\`\`

#### Dark Mode
\`\`\`css
Primary Colors:
- Orange: #FF7D33 (Brighter variant for dark backgrounds)
- White: #FFFFFF (Headings, primary text)
- Light Gray: #E5E5E5 (Secondary text)

Background Colors:
- Main Background: #0A0F0A (Very dark green-black)
- Card Background: #2A352A (Dark green-gray)
- Input Background: #1F2B20 (Slightly darker than cards)
- Border Color: #4A4D45 (Subtle borders)
\`\`\`

### Typography

#### Font Family
\`\`\`css
Primary Font: Inter, system-ui, -apple-system, sans-serif
Fallback: Arial, Helvetica, sans-serif
\`\`\`

#### Font Sizes & Weights
\`\`\`css
Headings:
- H1: 2.25rem (36px) / font-weight: 700 (bold)
- H2: 1.875rem (30px) / font-weight: 700
- H3: 1.5rem (24px) / font-weight: 600 (semibold)
- H4: 1.25rem (20px) / font-weight: 600

Body Text:
- Large: 1.125rem (18px) / font-weight: 400 (regular)
- Base: 1rem (16px) / font-weight: 400
- Small: 0.875rem (14px) / font-weight: 400
- Extra Small: 0.75rem (12px) / font-weight: 400

Special:
- Button Text: 0.875rem-1rem / font-weight: 500 (medium)
- Label Text: 0.875rem / font-weight: 500
\`\`\`

### Spacing System

#### Base Unit
\`\`\`css
Base spacing unit: 0.25rem (4px)
Multiplier scale: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64
\`\`\`

#### Common Spacings
\`\`\`css
Tight:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 0.75rem (12px)

Regular:
- base: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

Loose:
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)
- 4xl: 6rem (96px)
\`\`\`

### Border Radius

\`\`\`css
Rounded Corners:
- sm: 0.25rem (4px) - Small elements
- md: 0.5rem (8px) - Buttons, inputs
- lg: 0.75rem (12px) - Cards
- xl: 1rem (16px) - Large cards
- 2xl: 1.5rem (24px) - Feature cards
- 3xl: 2rem (32px) - Hero sections
- full: 9999px - Pills, circular buttons
\`\`\`

### Shadows

\`\`\`css
Box Shadows:
- sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- base: 0 1px 3px 0 rgb(0 0 0 / 0.1)
- md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
- lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
- xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)

Custom Shadows:
- Card Hover: 0 20px 25px -5px rgb(0 0 0 / 0.15)
- Modal: 0 25px 50px -12px rgb(0 0 0 / 0.25)
\`\`\`

---

## Architecture

### Tech Stack

\`\`\`
Frontend Framework: Next.js 14+ (App Router)
Language: TypeScript
Styling: Tailwind CSS
UI Components: shadcn/ui
State Management: React Context API
Authentication: Supabase Auth
Database: Supabase (PostgreSQL)
Image Handling: Next.js Image component
Deployment: Vercel
\`\`\`

### Folder Structure

\`\`\`
/app
  /api                     # API routes
    /auth
      /callback            # OAuth callback handler
    /user
      /profile             # User profile endpoints
    /vehicles
      /[id]                # Individual vehicle operations
      /saved               # Saved vehicles operations
  /auth
    /reset-password        # Password reset page
  /dashboard               # User dashboard page
  /home                    # Landing/home page
  /login                   # Login page
  /results                 # Search results page
  /settings                # User settings page
  /upload-vehicle          # Vehicle upload page
  /vehicle-details
    /[id]                  # Dynamic vehicle details page
  /vehicle
    /[id]
      /edit                # Edit vehicle page
  layout.tsx               # Root layout
  page.tsx                 # Root redirect
  globals.css              # Global styles

/components
  /ui                      # shadcn/ui components
    button.tsx
    card.tsx
    input.tsx
    header.tsx
    ... (all shadcn components)
  advanced-filters.tsx
  car-marketplace.tsx
  dashboard.tsx
  liked-cars.tsx
  liked-cars-page.tsx
  location-page.tsx
  login-page.tsx
  my-listing-card.tsx
  profile-settings.tsx
  results-page.tsx
  theme-provider.tsx
  theme-toggle.tsx
  upload-vehicle.tsx
  UserContext.tsx          # Global user state
  vehicle-card.tsx
  vehicle-details.tsx

/hooks
  use-mobile.tsx           # Mobile detection hook
  use-saved-vehicles.ts    # Saved vehicles management
  use-toast.ts             # Toast notifications
  use-vehicles.ts          # Vehicle data fetching

/lib
  auth.ts                  # Authentication utilities
  data.ts                  # Data constants and types
  deployment-config.ts     # Deployment configuration
  error-handler.ts         # Error handling utilities
  supabase.ts              # Supabase client
  utils.ts                 # General utilities
  vehicle-service.ts       # Vehicle CRUD operations

/types
  supabase.ts              # Supabase type definitions
  user.ts                  # User type definitions
  vehicle.ts               # Vehicle type definitions

/public
  imoto-new-header.png     # Logo image

/supabase
  /migrations              # Database migrations
\`\`\`

---

## Pages & Components

### 1. Header Component

**File**: `components/ui/header.tsx`

#### Desktop Header
\`\`\`
Layout Structure:
┌─────────────────────────────────────────────────────────┐
│  [Browse][Sell][About]  [LOGO]  [Services][Contact][User] │
└─────────────────────────────────────────────────────────┘

Dimensions:
- Total Width: max-w-4xl (896px) centered
- Height: 56px (h-14)
- Background: rgba(0,0,0,0.2) with backdrop-blur
- Border: 1px solid rgba(255,255,255,0.5)
- Border Radius: Full rounded (pill shape)
- Position: Fixed top-0, z-50
- Padding: 16px (p-4) from viewport edges
\`\`\`

#### Header Sections

**Left Navigation** (3 items)
\`\`\`
- Width: ~240px
- Items: Browse | Sell | About
- Spacing: gap-8 (32px between items)
- Text: 16px, medium weight
- Color: White (hover: #FF6700)
\`\`\`

**Center Logo**
\`\`\`
- Image: 280px × 84px
- Object Fit: Contain
- Clickable: Navigates to home
\`\`\`

**Right Navigation** (3-4 items)
\`\`\`
- Width: ~240px
- Items: Services | Contact | User/Login
- Spacing: gap-6 (24px between items)
- User Avatar: 32px × 32px rounded-full
- Border: 2px solid white
\`\`\`

#### Mobile Header
\`\`\`
Layout Structure:
┌─────────────────────┐
│  [LOGO]    [Menu ≡] │
└─────────────────────┘

Dimensions:
- Width: 320px
- Height: 50px
- Top Position: 8px from top
- Horizontal Center: left-1/2 transform -translate-x-1/2
\`\`\`

**Mobile Menu (Full Screen)**
\`\`\`
Overlay:
- Background: rgba(0,0,0,0.8) with backdrop-blur
- Height: 100vh
- Z-index: 100

Content:
- Logo at top (160px × 48px)
- Navigation items: text-2xl, white
- Spacing: gap-8 (32px vertical spacing)
- Center aligned vertically and horizontally
\`\`\`

### 2. Home Page

**File**: `app/home/page.tsx`

#### Hero Section
\`\`\`
Layout:
┌──────────────────────────────────────┐
│                                      │
│         Welcome to iMoto            │
│    Find Your Perfect Vehicle        │
│                                      │
│  [Search Bar with Filters]          │
│                                      │
└──────────────────────────────────────┘

Dimensions:
- Height: min-h-screen (100vh)
- Background: Video or gradient
- Padding Top: pt-20 (80px) - accounts for header
- Content Max Width: max-w-7xl (1280px)
\`\`\`

**Hero Typography**
\`\`\`css
Main Heading:
- Font Size: 4rem (64px) on desktop, 2.5rem (40px) mobile
- Font Weight: 700 (bold)
- Color: White with text-shadow
- Line Height: 1.1
- Margin Bottom: 1.5rem (24px)

Subheading:
- Font Size: 1.5rem (24px) on desktop, 1.125rem (18px) mobile
- Font Weight: 400 (regular)
- Color: rgba(255,255,255,0.9)
- Margin Bottom: 3rem (48px)
\`\`\`

**Search Bar Component**
\`\`\`
Dimensions:
- Width: 100% max-w-4xl (896px)
- Height: 64px
- Background: White
- Border Radius: 2rem (32px)
- Shadow: 0 20px 25px -5px rgba(0,0,0,0.15)

Layout:
┌─────────┬──────────┬──────────┬─────────┐
│  Make   │  Model   │ Location │ [Search]│
└─────────┴──────────┴──────────┴─────────┘

Each Input:
- Padding: 1rem 1.5rem
- Border: None (internal dividers)
- Font Size: 1rem (16px)

Search Button:
- Background: #FF6700
- Padding: 1rem 2rem (16px 32px)
- Border Radius: 1.5rem (24px)
- Color: White
- Font Weight: 500
\`\`\`

#### Featured Cars Section
\`\`\`
Layout:
- Grid: 3 columns on desktop, 1 on mobile
- Gap: 2rem (32px)
- Padding: 4rem 1.5rem (64px 24px)
- Background: White

Card Dimensions:
- Aspect Ratio: 4:3
- Border Radius: 1rem (16px)
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Hover: Scale 1.02, shadow increases
\`\`\`

### 3. Dashboard Page

**File**: `app/dashboard/page.tsx`

#### Desktop Layout (12-column grid)
\`\`\`
┌──────────────────────────────────────────┐
│ Welcome, [Name]                          │
├─────────────────┬────────────────────────┤
│                 │                        │
│  Profile Card   │  Metrics Card          │
│  (3 cols)       │  (3 cols)              │
│                 │                        │
├─────────────────┼────────────────────────┤
│                 │  Upload Card           │
│  Subscription   │  (3 cols)              │
│  (3 cols)       │                        │
│                 ├────────────────────────┤
│                 │                        │
├─────────────────┤  Saved Cars (6 cols)   │
│                 │                        │
│                 │                        │
│                 │                        │
└─────────────────┴────────────────────────┘
│   Recently Listed Cars (3 cols)          │
└──────────────────────────────────────────┘

Grid Setup:
- display: grid
- grid-template-columns: repeat(12, 1fr)
- gap: 1rem (16px)
- padding: 1.5rem (24px)
- max-width: 7xl (1280px)
\`\`\`

#### Profile Card
\`\`\`
Dimensions:
- Columns: span 3
- Aspect Ratio: 1:1
- Border Radius: 3xl (1.5rem / 24px)
- Overflow: hidden

Content:
- Background Image: Cover
- Overlay: Gradient from transparent to rgba(0,0,0,0.7)
- Padding: 1rem (16px)

Text Layout:
- Name: 2xl (24px), bold, white
- Badge: Border 1px white/50, rounded-full
- Position: absolute bottom-0
\`\`\`

#### Metrics Card
\`\`\`
Dimensions:
- Columns: span 3
- Border Radius: 3xl (1.5rem / 24px)
- Background: Gradient from white to gray-50
- Padding: 1.25rem (20px)

Layout:
┌─────────────────────────┐
│ Listing Metrics    [👁] │
│                         │
│ 243 Total Views         │
│                         │
│ ┌─────────────────────┐ │
│ │ Total Views    243  │ │
│ │ [Progress Bar]      │ │
│ └─────────────────────┘ │
│                         │
│ ┌──────┐  ┌──────┐     │
│ │ ♥ 18 │  │ 💬 7 │     │
│ └──────┘  └──────┘     │
└─────────────────────────┘

Progress Bar:
- Height: 6px (h-1.5)
- Background: gray-100
- Fill: #FF6700
- Border Radius: full
\`\`\`

#### Upload Card
\`\`\`
Dimensions:
- Columns: span 3
- Border Radius: 3xl
- Background: Gradient #FF6700 to #FF9248
- Padding: 1.25rem (20px)
- Color: White

Layout:
- Icon: 24px × 24px at top-right
- Center Content: Plus icon 32px × 32px
- Text: 18px bold, 14px regular
- Cursor: pointer
- Hover: shadow-lg
\`\`\`

#### Subscription Card
\`\`\`
Dimensions:
- Columns: span 3
- Border Radius: 3xl
- Padding: 1.25rem (20px)

Sections:
1. Header:
   - Title + Package icon
   - Height: auto

2. Current Plan Box:
   - Background: gray-50
   - Border Radius: xl (12px)
   - Padding: 1rem (16px)
   - Margin Bottom: 1rem

3. Progress:
   - Text: 14px
   - Progress Bar: 8px height
   - Color: #FF6700

4. Premium Section:
   - Border: 2px dashed gray-300
   - Padding: 1rem
   - Button: Outline style
\`\`\`

#### Saved Cars Carousel
\`\`\`
Dimensions:
- Columns: span 6
- Border Radius: 3xl
- Aspect Ratio: 16:9
- Position: relative
- Overflow: hidden

Overlay:
- Gradient: from black/70 via black/40 to transparent
- Z-index: 10

Content Areas:
1. Top Badge:
   - "View Saved Cars" - #FF6700 background
   - Padding: 4px 12px
   - Border Radius: full

2. Bottom Content:
   - Padding: 1.5rem (24px)
   - Vehicle name: 2xl (24px) bold
   - Details: white/80
   - Price: xl (20px) #FF6700
   - Contact Button: White background

3. Indicators:
   - Position: absolute bottom-3
   - Dots: 8px × 8px
   - Active: white, width 16px
   - Inactive: white/40
\`\`\`

#### Recently Listed Cars
\`\`\`
Dimensions:
- Columns: span 3
- Border Radius: 3xl
- Background: White
- Height: 100% (matches left column)

Header:
- Padding: 1.25rem (20px)
- Border Bottom: 1px gray-200
- Flex: space-between

Scrollable Area:
- Max Height: calc(100% - header - footer)
- Overflow: auto
- Padding: 0.75rem (12px)

Car Item:
┌────┬─────────────────┬──────┐
│[Img]│ 2020 Toyota     │[Edit]│
│    │ R 250,000       │[Del] │
└────┴─────────────────┴──────┘

- Image: 64px × 48px, rounded-lg
- Gap: 12px
- Padding: 12px
- Hover: bg-gray-50
\`\`\`

### 4. Vehicle Details Page

**File**: `components/vehicle-details.tsx`

#### Layout Structure
\`\`\`
┌─────────────────────────────────────────┐
│ ← Back            R 250,000       ♥ Save │
├─────────────────────────────────────────┤
│                                         │
│          Image Gallery                  │
│                                         │
├──────────────────┬──────────────────────┤
│                  │                      │
│  Vehicle Info    │  Seller Contact      │
│  - Details Tab   │  - Name              │
│  - Report Tab    │  - Phone             │
│  - Insurance     │  - Email             │
│  - Review        │  - Location          │
│                  │  - [Contact Button]  │
│                  │                      │
│                  │  [Map]               │
└──────────────────┴──────────────────────┘
\`\`\`

#### Image Gallery (Desktop)

**Main Image + Thumbnails**
\`\`\`
Layout: 3-Section Horizontal Scrolling
- Display: flex
- Overflow-x: auto
- Snap: snap-x snap-mandatory
- Width: 100%

Section 1 (5 images):
┌─────────────────┬────────┐
│                 │  [1]   │
│   Main Image    ├────────┤
│     (2 cols)    │  [2]   │
│                 ├────────┤
│                 │  [3]   │
└─────────────────┴────────┘
                  │  [4]   │
                  └────────┘

- Main: col-span-2, height: 400px
- Thumbnails: 2x2 grid, aspect-square
- Gap: 1rem (16px)
- Border Radius: lg (12px)
- Overflow: hidden

Section 2 & 3 (8 images each):
- Grid: 2 rows × 4 columns
- Height: 400px
- Gap: 1rem
- Aspect: square
\`\`\`

**Hover Effects**
\`\`\`css
Group hover states:
- Scale: 1.05
- Overlay: rgba(0,0,0,0.2)
- Search Icon: Appears centered
- Duration: 300ms
- Timing: ease-out
\`\`\`

#### Mobile Gallery
\`\`\`
Layout: Single Carousel
- Height: 33vh
- Full width
- Swipe enabled
- Touch gestures

Controls:
1. Image Counter:
   - Position: absolute top-4 right-4
   - Background: rgba(0,0,0,0.5)
   - Padding: 4px 12px
   - Border Radius: full
   - Text: white, 14px

2. Dots Indicator:
   - Position: absolute bottom-4
   - Dots: 8px diameter
   - Active: white
   - Inactive: white/50

3. Swipe Hint:
   - Bottom-16 center
   - "Swipe to browse"
   - Animation: pulse
\`\`\`

#### Image Modal (Full Screen)
\`\`\`
Overlay:
- Position: fixed inset-0
- Z-index: 50
- Background: rgba(0,0,0,0.9)
- Display: flex center

Image Container:
- Max Height: 90vh
- Max Width: 90vw
- Object Fit: contain

Controls:
1. Close Button:
   - Top-4 right-4
   - Background: rgba(0,0,0,0.5)
   - Size: 32px × 32px
   - Icon: X (24px)

2. Navigation Arrows:
   - Left/Right absolute
   - Size: 40px × 40px
   - Background: rgba(0,0,0,0.5)
   - Hover: rgba(0,0,0,0.7)

3. Position Indicator:
   - Bottom-4 center
   - "3 / 21"
   - Background: rgba(0,0,0,0.5)
   - Padding: 4px 12px

Keyboard Support:
- Escape: Close
- Left Arrow: Previous
- Right Arrow: Next
- Double Click: Zoom toggle
\`\`\`

#### Vehicle Information Tabs
\`\`\`
Tab Bar:
- Border Bottom: 1px gray-200
- Padding: 0 1.5rem (24px)
- Gap: 2rem (32px)

Active Tab:
- Border Bottom: 2px #FF6700
- Color: #3E5641 (dark mode: white)
- Font Weight: 500

Inactive Tab:
- Color: #6F7F69 (dark mode: gray-400)
- Hover: color transition

Tab Content Area:
- Padding: 1.5rem (24px)
- Min Height: 400px
\`\`\`

**Details Tab Content**
\`\`\`
Description Section:
- Font Size: 1rem (16px)
- Line Height: 1.5
- Color: #6F7F69
- Margin Bottom: 1.5rem (24px)
- White Space: pre-wrap

Technical Grid:
- Grid: 2 cols mobile, 4 cols desktop
- Gap: 1rem (16px)
- Margin Top: 1.5rem (24px)

Each Detail Item:
┌──────────────┐
│ Make         │ ← Label (12px, gray)
│ Toyota       │ ← Value (14px, bold)
└──────────────┘
- Padding: 0.5rem (8px)
- Background: Subtle on hover
\`\`\`

**Coming Soon Tabs**
\`\`\`css
Overlay Structure:
- Position: relative
- Height: 400px

Content (Blurred):
- Filter: blur(4px)
- Opacity: 0.5
- Background: gray-50

Overlay Message:
- Position: absolute inset-0
- Background: rgba(0,0,0,0.3)
- Flex: center center
- Text: "Coming Soon" (32px, white, bold)
\`\`\`

#### Seller Contact Card
\`\`\`
Dimensions:
- Width: 33.33% (1/3 on desktop)
- Background: rgba(62,86,65,0.8)
- Backdrop Blur: lg
- Border Radius: xl (12px)
- Padding: 2rem (32px)
- Border: 1px rgba(255,255,255,0.1)

Layout:
┌─────────────────────────┐
│ Contact Seller    [👤]  │
│                         │
│ Seller                  │
│ John Doe          [You] │
│ ─────────────────────── │
│ Contact Information     │
│ 📞 +27 12 345 6789     │
│ ✉️ john@email.com      │
│ ─────────────────────── │
│ Location                │
│ 📍 Cape Town, WC       │
│                         │
│ [Contact Seller Button] │
└─────────────────────────┘

Spacing:
- Sections: gap-5 (20px)
- Border: 1px white/10
- Text: white
- Labels: gray-300 (14px)
- Values: white (16px, medium)
\`\`\`

**Contact Button**
\`\`\`css
Full Width Button:
- Background: #FF6700
- Hover: #FF7D33
- Padding: 0.5rem 1rem (8px 16px)
- Border Radius: lg (12px)
- Font Weight: 500
- Color: white
- Transition: 200ms

Mobile Behavior:
- Opens phone dialer (tel:)
- Desktop: Opens contact form modal
\`\`\`

#### Location Map
\`\`\`
Dimensions:
- Margin Top: 1.5rem (24px)
- Height: 150px
- Width: 100%
- Border Radius: xl (12px)
- Overflow: hidden
- Shadow: lg

Implementation:
- Google Maps Embed
- Shows seller location (city level)
- Zoom: Appropriate for city view
- Style: Default
- Loading: lazy
\`\`\`

### 5. Upload Vehicle Page

**File**: `components/upload-vehicle.tsx`

#### Layout Structure
\`\`\`
┌──────────────────────────────────────────┐
│ ← Back                                   │
│ List Your Vehicle                        │
├──────────────┬───────────────────────────┤
│              │                           │
│  Image       │  Vehicle Details Form     │
│  Gallery     │  - Basic Info             │
│  (1/3)       │  - Price/Mileage/Year     │
│              │  - Technical Specs        │
│  Seller      │  - Condition              │
│  Info        │  - Description            │
│  (1/3)       │                           │
│              │  [Save Button]            │
│              │  (2/3)                    │
└──────────────┴───────────────────────────┘
\`\`\`

#### Image Upload Section

**Main Image Display**
\`\`\`
Dimensions:
- Aspect Ratio: 16:9
- Width: 100%
- Border Radius: 2xl (24px)
- Background: gray-200
- Cursor: pointer
- Hover: opacity 90%

Empty State:
┌─────────────────────────┐
│         📷              │
│ Upload Vehicle Images   │
│   (Min 5, Max 21)       │
└─────────────────────────┘

- Icon: 48px × 48px
- Text: 20px bold, 14px regular
- Color: gray-500
- Center aligned

With Image:
- Object Fit: cover
- Upload button overlay: bottom-right
- Size: 32px × 32px, rounded-full
- Background: white/80
- Icon: Camera (16px)
\`\`\`

**Image Gallery Grid**
\`\`\`
Header:
- Display: flex justify-between
- Title: "Gallery (12)" - 18px bold
- Instruction: "Drag to reorder • First image is main"
- Font: 12px, gray-500

Grid Layout:
- Columns: 3
- Gap: 0.75rem (12px)
- Max Height: 240px
- Overflow: auto
- Padding: 4px

Each Thumbnail:
┌──────────────┐
│  [Grip Icon] │ ← Shows on hover
│              │
│    Image     │
│              │
│   [X Remove] │ ← Shows on hover
│ Main Image   │ ← First image only
└──────────────┘

- Aspect Ratio: 1:1
- Border Radius: lg (12px)
- Cursor: move
- Draggable: true

Drag States:
- Dragging: opacity-50, scale-95
- Drop Target: ring-2 ring-[#FF6700]
- Hover: Shows grip and remove icons

Remove Button:
- Position: absolute top-1 right-1
- Size: 16px × 16px
- Background: red-500/80
- Hover: red-600/90
- Icon: XCircle (16px)
\`\`\`

**Image Processing Indicator**
\`\`\`
Progress Bar:
┌─────────────────────────────────────┐
│ Processing images...        45%     │
│ ████████████░░░░░░░░░░░░░░░░░░     │
└─────────────────────────────────────┘

- Background: blue-50
- Border: blue-200
- Border Radius: lg
- Padding: 1rem (16px)
- Height: 8px progress bar
- Color: blue-600
- Animated transition
\`\`\`

#### Seller Information Card

**Display Mode (Not Editing)**
\`\`\`
Layout:
┌─────────────────────────────┐
│ Seller Information   [Edit] │
│                             │
│ Name                        │
│ John Doe                    │
│                             │
│ Email                       │
│ john@email.com              │
│                             │
│ Phone                       │
│ +27 12 345 6789            │
│                             │
│ Location                    │
│ Cape Town, Western Cape     │
└─────────────────────────────┘

- Border Radius: 3xl (24px)
- Padding: 1.5rem (24px)
- Background: white
- Border: 1px gray-200
\`\`\`

**Edit Mode**
\`\`\`
Layout: Same card with form fields

Fields:
1. First Name + Last Name (Grid 2 cols)
2. Phone Number
3. Email (Disabled with note)
4. Suburb + City (Grid 2 cols)
5. Province (Dropdown)

Input Styling:
- Height: 40px
- Border: 1px #9FA791
- Border Radius: lg (12px)
- Focus: 2px ring #FF6700
- Padding: 0.5rem 0.75rem

Button Change:
- [Edit] → [Save] (green-600)

Auto-save:
- Saves on every change
- No manual save required
\`\`\`

**Incomplete Profile Warning**
\`\`\`
Alert Box:
- Background: yellow-50
- Border: yellow-200
- Padding: 1rem (16px)
- Border Radius: lg
- Icon: AlertCircle (16px, yellow-600)
- Text: 14px, yellow-800

Message:
"Your seller profile is incomplete. Please fill 
out all fields and save before listing a vehicle."
\`\`\`

#### Vehicle Details Form

**Basic Information Section**
\`\`\`
Grid: 3 columns (Make, Model, Variant)

Label Style:
- Font: 14px, medium
- Color: #3E5641 (dark mode: gray-300)
- Margin Bottom: 6px

Input Style:
- Height: 40px
- Border: 1px #9FA791
- Border Radius: lg (12px)
- Padding: 0.5rem 0.75rem
- Focus: ring-2 #FF6700
- Background: white (dark: #1F2B20)

Placeholder:
- Color: gray-400
- Font: 16px
\`\`\`

**Price/Mileage/Year Section**
\`\`\`
Grid: 3 columns equal width

Price Input Special:
- Format: "R 123 456.00"
- Auto-formats as user types
- Spaces every 3 digits
- 2 decimal places enforced
- Pattern: R [integer].[2 decimals]

Mileage Input:
- Type: number
- Min: 0
- Step: 1000
- Suffix helper text: "km"

Year Input:
- Type: number
- Min: 1900
- Max: Current year
- Step: 1
\`\`\`

**Technical Specifications**
\`\`\`
Grid: 4 columns (Transmission, Fuel, Engine, Body)

Dropdowns:
- Height: 40px
- Appearance: none (custom arrow)
- Background: white
- Border: 1px #9FA791
- Border Radius: lg

Transmission Options:
- Manual
- Automatic

Fuel Options:
- Petrol
- Diesel
- Electric
- Hybrid

Engine Capacity:
- Type: Searchable dropdown
- Range: 0.8L to 8.0L+ (0.1L increments)
- Dropdown: max-height 240px, scrollable

Body Type:
- Type: Searchable dropdown with icons
- Options: Sedan, SUV, Hatchback, Bakkie, etc.
- Each option has icon (Car/Truck/Bike)
- Icon size: 16px
\`\`\`

**Condition Section**
\`\`\`
Dropdown:
- Full width
- Options:
  * Excellent
  * Good
  * Fair
  * Poor
- Default: Good
\`\`\`

**Description Section**
\`\`\`
Textarea:
- Min Height: 120px
- Width: 100%
- Border: 1px #9FA791
- Border Radius: lg
- Padding: 0.75rem
- Resize: vertical
- Font: 16px
- Line Height: 1.5

Placeholder:
"Describe your vehicle, including any special 
features, condition details, or other information 
potential buyers should know..."
\`\`\`

**Submit Button**
\`\`\`
Position: Bottom right of form
Dimensions:
- Padding: 0.5rem 1rem (8px 16px)
- Border Radius: lg
- Background: #FF6700
- Hover: #FF7D33
- Font: 16px, medium
- Color: white

States:
- Normal: "List Vehicle"
- Submitting: "Submitting..." (disabled)
- Success: Green checkmark + redirect

Progress During Submit:
┌─────────────────────────────────────┐
│ Uploading vehicle...        78%     │
│ ████████████████████░░░░░░░░░░░░   │
└─────────────────────────────────────┘
\`\`\`

### 6. Login Page

**File**: `components/login-page.tsx`

#### Layout Structure
\`\`\`
┌─────────────────────────────────┐
│          [Header]               │
│                                 │
│     ╔═══════════════════╗      │
│     ║                   ║      │
│     ║  Welcome Back     ║      │
│     ║  or               ║      │
│     ║  Create Account   ║      │
│     ║                   ║      │
│     ║  [Form Fields]    ║      │
│     ║                   ║      │
│     ║  [Sign In/Up]     ║      │
│     ║  ─── or ───       ║      │
│     ║  [Google OAuth]   ║      │
│     ║                   ║      │
│     ╚═══════════════════╝      │
│                                 │
└─────────────────────────────────┘
\`\`\`

#### Form Card
\`\`\`
Dimensions:
- Max Width: 28rem (448px)
- Background: white (dark: #2A352A)
- Border: 1px #9FA791/20
- Border Radius: 3xl (24px)
- Padding: 2rem (32px)
- Shadow: lg
- Margin: auto (centered)
\`\`\`

#### Title Section
\`\`\`
Typography:
- Heading: 36px (text-4xl), bold
- Color: #3E5641 (dark: white)
- Text Align: center
- Margin Bottom: 0.5rem (8px)

Subtitle:
- Size: 16px
- Color: #6F7F69 (dark: gray-400)
- Text Align: center
- Margin Bottom: 2rem (32px)
\`\`\`

#### Form Fields

**Sign Up Mode (4 fields)**
\`\`\`
1. First Name + Last Name (Grid 2 cols)
   - Gap: 1rem (16px)

2. Email (Full width)

3. Password (Full width with toggle)

Field Spacing: gap-6 (24px vertical)
\`\`\`

**Sign In Mode (2 fields)**
\`\`\`
1. Email (Full width)
2. Password (Full width with toggle)

Field Spacing: gap-6 (24px vertical)
\`\`\`

**Input Styling**
\`\`\`css
Label:
- Font: 14px, medium
- Color: #3E5641 (dark: gray-300)
- Margin Bottom: 4px

Input:
- Height: 40px
- Border: 1px #9FA791
- Border Radius: lg (12px)
- Padding: 0.5rem 0.75rem (8px 12px)
- Focus: ring-2 #FF6700
- Background: white (dark: #1F2B20)
- Font: 16px

Password Toggle:
- Position: absolute right-0 inset-y-0
- Padding: 0.75rem (12px)
- Icon: Eye/EyeOff (20px)
- Color: gray-500
- Cursor: pointer
\`\`\`

**Error Alert**
\`\`\`
Box:
- Background: red-50 (dark: red-900/20)
- Border: red-200 (dark: red-800)
- Padding: 0.75rem (12px)
- Border Radius: lg
- Font: 14px
- Color: red-800 (dark: red-200)
- Margin Bottom: 1rem
\`\`\`

**Submit Button**
\`\`\`css
Full Width Button:
- Height: 40px
- Background: #FF6700
- Hover: #FF7D33
- Color: white
- Font: 16px, medium
- Border Radius: lg
- Icon: LogIn/UserPlus (16px) on right
- Transition: all 200ms

Loading State:
- Text: "Processing..."
- Disabled: true
- Cursor: not-allowed
- Opacity: 0.7
\`\`\`

#### OAuth Section
\`\`\`
Divider:
┌─────────────────────────────────┐
│        ──── or ────              │
└─────────────────────────────────┘

- Margin: 1.5rem 0 (24px)
- Text: 14px, gray-500
- Border: gray-300

Google Button:
- Full width
- Height: 40px
- Border: 1px gray-300
- Background: transparent
- Hover: gray-50
- Border Radius: lg
- Font: 16px, medium

Layout:
[Google Icon] Sign in with Google
     ↓
- Icon: 20px × 20px
- Gap: 0.5rem (8px)
- Center aligned
\`\`\`

#### Toggle Link
\`\`\`
Position: Bottom center
Margin Top: 1.5rem (24px)

Text:
- "Already have an account? Sign In"
- "Don't have an account? Sign Up"
- Font: 14px
- Color: #FF6700
- Hover: underline
- Cursor: pointer
\`\`\`

#### Verification Success Screen
\`\`\`
Layout:
┌─────────────────────────────────┐
│          [Mail Icon]            │
│       Check Your Email          │
│                                 │
│  ╔═══════════════════════════╗ │
│  ║ Email sent to:            ║ │
│  ║ user@example.com          ║ │
│  ╚═══════════════════════════╝ │
│                                 │
│  Next steps:                    │
│  1. Check your inbox            │
│  2. Click verification link     │
│  3. Return to sign in           │
│                                 │
│  [Continue to Sign In]          │
│  [Resend Email]                 │
└─────────────────────────────────┘

Icon:
- Size: 64px × 64px
- Color: green-600
- Background: green-100
- Border Radius: full
- Margin: auto
\`\`\`

### 7. Search Results Page

**File**: `app/results/page.tsx`

#### Layout Structure
\`\`\`
┌──────────────────────────────────────────┐
│            [Header]                      │
├──────────────────────────────────────────┤
│ [Filters Bar]                            │
├──────────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│ │ Vehicle │  │ Vehicle │  │ Vehicle │  │
│ │  Card   │  │  Card   │  │  Card   │  │
│ └─────────┘  └─────────┘  └─────────┘  │
│                                          │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│ │ Vehicle │  │ Vehicle │  │ Vehicle │  │
│ │  Card   │  │  Card   │  │  Card   │  │
│ └─────────┘  └─────────┘  └─────────┘  │
│                                          │
│          [Load More / Pagination]        │
└──────────────────────────────────────────┘
\`\`\`

#### Filters Bar
\`\`\`
Dimensions:
- Height: 64px
- Background: white
- Border Bottom: 1px gray-200
- Padding: 0 1.5rem (24px)
- Sticky: top-0 (below header)
- Z-index: 40

Layout (Horizontal scroll on mobile):
[Make ▼] [Model ▼] [Year ▼] [Price ▼] [More ▼]

Each Filter:
- Padding: 0.5rem 1rem (8px 16px)
- Border: 1px gray-300
- Border Radius: lg
- Background: white
- Hover: gray-50
- Font: 14px, medium
- Gap: 0.5rem (8px)

Active Filter:
- Border: 2px #FF6700
- Background: #FFF8E0
- Color: #FF6700
\`\`\`

#### Results Grid
\`\`\`
Container:
- Max Width: 7xl (1280px)
- Padding: 2rem 1.5rem (32px 24px)
- Margin: auto

Grid:
- Columns: 1 (mobile), 2 (tablet), 3 (desktop)
- Gap: 2rem (32px)
- Min Height: calc(100vh - header - filters)

Results Header:
"Showing 24 of 156 vehicles"
- Font: 16px, medium
- Color: #6F7F69
- Margin Bottom: 1.5rem (24px)
\`\`\`

#### Vehicle Card Component
\`\`\`
Dimensions:
- Border Radius: lg (12px)
- Background: white (dark: gray-800)
- Shadow: md
- Hover: shadow-xl, scale-102
- Transition: all 300ms
- Cursor: pointer

Structure:
┌──────────────────────┐
│                      │
│      [Image]         │ ← 224px height
│         ♥            │   Absolute heart
│                      │
├──────────────────────┤
│ 2020 Toyota Corolla  │ ← 18px bold
│ 1.4 TSI             │ ← 14px gray
│                      │
│ R 250,000           │ ← 20px bold orange
│                      │
│ 50,000 km • Auto    │ ← 14px gray
│ Cape Town, WC       │
│ ─────────────────── │
│ [View Details]      │ ← Center, orange
└──────────────────────┘

Padding: 1rem (16px) bottom section
\`\`\`

**Image Section**
\`\`\`
Dimensions:
- Height: 224px (h-56)
- Width: 100%
- Overflow: hidden
- Position: relative

Image:
- Object Fit: cover
- Hover: scale-105 (300ms transition)

Save Button:
- Position: absolute top-3 right-3
- Size: 40px × 40px
- Background: rgba(0,0,0,0.5)
- Border Radius: full
- Icon: Heart (20px)
- Hover: background orange-500

States:
- Unsaved: outline heart, white
- Saved: filled heart, orange
\`\`\`

**Info Section**
\`\`\`
Padding: 1rem (16px)
Display: flex flex-col
Gap: 0.75rem (12px)

Title:
- Font: 18px, bold
- Color: gray-900 (dark: white)
- Truncate: single line

Variant:
- Font: 14px, regular
- Color: gray-500
- Truncate: single line

Price:
- Font: 20px, semibold
- Color: #FF6700
- Margin: 0.5rem 0 (8px)

Details:
- Font: 14px
- Color: gray-600
- Line Height: 1.5
- Format: "50,000 km • Automatic"
- Format: "Cape Town, Western Cape"

Button Area:
- Border Top: 1px gray-200
- Padding Top: 0.75rem (12px)
- Text: center, 14px, semibold
- Color: #FF6700
- Hover: #FF7D33
\`\`\`

### 8. Profile Settings Page

**File**: `components/profile-settings.tsx`

#### Layout Structure
\`\`\`
┌──────────────────────────────────────────┐
│ ← Back to Dashboard                      │
│ Profile Settings                         │
├───────────────┬──────────────────────────┤
│               │                          │
│  [Avatar]     │  [Personal Info Tab]     │
│               │  [Security Tab]          │
│  Name         │                          │
│  Email        │  ┌────────────────────┐ │
│  Phone        │  │  Form Fields       │ │
│  Location     │  │                    │ │
│               │  │                    │ │
│  [Sign Out]   │  └────────────────────┘ │
│               │  [Save Button]           │
│               │                          │
└───────────────┴──────────────────────────┘

Desktop: 1/3 left, 2/3 right
Mobile: Stacked vertically
\`\`\`

#### Profile Card (Left)
\`\`\`
Dimensions:
- Width: 33.33% (desktop)
- Border Radius: 3xl (24px)
- Background: white (dark: #2A352A)
- Border: 1px #9FA791/20
- Padding: 1.5rem (24px)

Avatar Section:
┌────────────────┐
│                │
│   [Image or]   │ ← Aspect 1:1
│   [Initials]   │   Full width
│       📷       │   Bottom right
│                │
└────────────────┘

- Border Radius: 2xl (16px)
- Background: gray-200 or profile pic
- Camera Button: 32px × 32px
- Position: absolute bottom-2 right-2

Info Section:
- Name: 24px (2xl), bold
- Email: 14px, gray-600, truncate
- Phone: 14px, with phone icon
- Location: 14px, with map pin icon
- Gap: 1rem (16px) between items

Sign Out Button:
- Margin Top: 1.5rem (24px)
- Variant: destructive (red)
- Full width
\`\`\`

#### Settings Tabs
\`\`\`
Tab List:
- Grid: 2 columns
- Background: gray-100 (dark: #1F2B20)
- Border Radius: lg (12px)
- Padding: 4px
- Margin Bottom: 1.5rem (24px)

Tab Button:
- Padding: 0.5rem 1rem (8px 16px)
- Border Radius: md (8px)
- Font: 14px, medium
- Transition: all 200ms

Active State:
- Background: #FF6700
- Color: white

Inactive State:
- Background: transparent
- Color: gray-600
- Hover: gray-200
\`\`\`

#### Personal Info Tab
\`\`\`
Form Layout:
- Display: flex flex-col
- Gap: 1rem (16px)
- Max Height: calc(100vh - header - tabs)
- Overflow: auto

Field Groups:
1. Name Row (2 cols):
   - First Name | Last Name
   - Gap: 1rem (16px)

2. Email (Full width):
   - Read-only for OAuth users
   - Helper text if disabled

3. Phone (Full width):
   - Type: tel
   - Placeholder: "+27 12 345 6789"

4. Location Row (2 cols):
   - City | Province
   - Province: Dropdown with SA provinces

Error Display:
- Background: red-50
- Border: red-200
- Padding: 0.75rem (12px)
- Border Radius: lg
- Icon + Message

Save Button:
- Position: Bottom right
- Background: #FF6700
- Icon: Save (16px)
- Text: "Save Personal Info"
\`\`\`

#### Security Tab
\`\`\`
Layout:
┌─────────────────────────────────┐
│ Change Password                 │
│ ─────────────────────────────  │
│                                 │
│ [Current Password]              │
│                                 │
│ [New Password]                  │
│                                 │
│ [Confirm New Password]          │
│                                 │
│           [Update Password]     │
│                                 │
│ ══════════════════════════════ │
│                                 │
│ Account Security                │
│ ─────────────────────────────  │
│                                 │
│ ┌─────────────────────────────┐│
│ │ Two-Factor Authentication   ││
│ │ Add extra security          ││
│ │               [Enable]      ││
│ └─────────────────────────────┘│
│                                 │
└─────────────────────────────────┘

Password Fields:
- Type: password with toggle
- Height: 40px
- Gap: 0.75rem (12px)
- Show/hide icon on right

Success Message:
- Background: green-50
- Border: green-200
- Icon: CheckCircle green
- Auto-hide after 5s

OAuth Users:
Shows message:
"Password management is handled 
through your [Provider] account"
- Background: gray-50
- Padding: 1rem (16px)
- Border Radius: lg
\`\`\`

---

## User Flows

### 1. Browse Vehicles Flow
\`\`\`
1. User lands on home page
2. Uses search bar or clicks "Browse"
3. Results page loads with filters
4. User applies filters (make, model, price, etc.)
5. Grid updates with matching vehicles
6. User clicks vehicle card
7. Vehicle details page opens
8. User can:
   - Save vehicle (if logged in)
   - Contact seller
   - View more details
   - Go back to results
\`\`\`

### 2. Sign Up Flow
\`\`\`
1. User clicks "Login" in header
2. Login page opens
3. User clicks "Don't have an account? Sign Up"
4. Form shows: First Name, Last Name, Email, Password
5. User fills form and submits
6. Verification email sent
7. "Check Your Email" screen appears
8. User checks email
9. Clicks verification link
10. Redirected to login page
11. User signs in
12. Redirected to dashboard
\`\`\`

### 3. List Vehicle Flow
\`\`\`
1. User must be logged in and verified
2. User clicks "Sell" in header or "Upload" in dashboard
3. Profile check:
   - If incomplete: Must complete profile first
   - If complete: Proceed to upload form
4. User uploads 5-21 images:
   - Drag to reorder
   - First image = main image
5. User fills vehicle details:
   - Basic info (make, model, variant)
   - Price, mileage, year
   - Technical specs
   - Condition
   - Description
6. Seller info auto-populated from profile
7. User clicks "List Vehicle"
8. Processing indicator shows
9. Success message appears
10. Redirect to dashboard
11. Vehicle appears in "Recently Listed"
\`\`\`

### 4. Save Vehicle Flow
\`\`\`
1. User must be logged in
2. User browses vehicles
3. User clicks heart icon on vehicle card
4. Heart fills with color (orange)
5. Vehicle added to saved list
6. User can view saved vehicles:
   - Dashboard > Saved Cars carousel
   - Header > Dashboard > Saved section
7. User can unsave by clicking heart again
\`\`\`

### 5. Contact Seller Flow
\`\`\`
1. User views vehicle details
2. User clicks "Contact Seller" button
3. On mobile: Opens phone dialer
4. On desktop: Opens contact form modal
5. User can:
   - See seller phone/email
   - Send message
   - View location on map
\`\`\`

### 6. Edit Profile Flow
\`\`\`
1. User navigates to Settings
2. User clicks "Edit" on Profile Card
3. Fields become editable
4. User makes changes
5. Changes auto-save (seller info)
6. Or clicks "Save" button (personal info)
7. Success message appears
8. Profile updates across app
\`\`\`

---

## Styling & Dimensions

### Responsive Breakpoints
\`\`\`css
Tailwind Breakpoints:
- sm: 640px   (Small tablets)
- md: 768px   (Tablets)
- lg: 1024px  (Laptops)
- xl: 1280px  (Desktops)
- 2xl: 1536px (Large desktops)

Custom Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
\`\`\`

### Container Widths
\`\`\`css
Page Containers:
- max-w-sm: 384px
- max-w-md: 448px
- max-w-lg: 512px
- max-w-xl: 576px
- max-w-2xl: 672px
- max-w-3xl: 768px
- max-w-4xl: 896px (Header width)
- max-w-5xl: 1024px
- max-w-6xl: 1152px (Settings page)
- max-w-7xl: 1280px (Main content)

Padding:
- Mobile: px-4 (16px)
- Tablet: px-6 (24px)
- Desktop: px-6 (24px)
\`\`\`

### Component Dimensions

#### Buttons
\`\`\`css
Sizes:
- Small: h-8 (32px) | px-3 py-1.5
- Default: h-10 (40px) | px-4 py-2
- Large: h-12 (48px) | px-6 py-3

Variants:
- Primary: bg-[#FF6700] text-white
- Secondary: bg-[#3E5641] text-white
- Outline: border-2 bg-transparent
- Ghost: bg-transparent hover:bg-gray-100
- Destructive: bg-red-500 text-white

Border Radius: lg (12px)
Font Weight: 500 (medium)
Transition: all 200ms
\`\`\`

#### Cards
\`\`\`css
Standard Card:
- Border: 1px solid rgba(159,167,145,0.2)
- Border Radius: xl (16px) or 3xl (24px)
- Background: white (dark: #2A352A)
- Shadow: md
- Padding: 1rem-2rem (16px-32px)

Hover State:
- Shadow: lg
- Transform: scale(1.02)
- Transition: 300ms

Card Grid:
- Gap: 1rem-2rem (16px-32px)
- Columns: 1 (mobile), 2-3 (desktop)
\`\`\`

#### Inputs
\`\`\`css
Text Input:
- Height: 40px (h-10)
- Border: 1px solid #9FA791
- Border Radius: lg (12px)
- Padding: 0.5rem 0.75rem (8px 12px)
- Font Size: 1rem (16px)
- Background: white (dark: #1F2B20)

Focus State:
- Ring: 2px #FF6700
- Border: #FF6700
- Outline: none

Disabled State:
- Opacity: 0.7
- Cursor: not-allowed
- Background: gray-100

Error State:
- Border: red-500
- Ring: red-500
- Background: red-50
\`\`\`

#### Dropdowns
\`\`\`css
Select:
- Height: 40px
- Border: 1px solid #9FA791
- Border Radius: lg
- Padding: 0.5rem 0.75rem
- Appearance: none (custom arrow)
- Background: white

Dropdown Menu:
- Border: 1px solid #9FA791
- Border Radius: md (8px)
- Shadow: lg
- Max Height: 240px
- Overflow: auto
- Background: white

Option:
- Padding: 0.5rem 1rem (8px 16px)
- Hover: bg-[#FFF8E0]
- Active: bg-[#FF6700] text-white
- Font: 14px
\`\`\`

#### Modals
\`\`\`css
Overlay:
- Position: fixed inset-0
- Background: rgba(0,0,0,0.5)
- Backdrop Blur: md
- Z-index: 50

Modal Content:
- Max Width: 28rem (448px)
- Background: white
- Border Radius: 2xl (16px)
- Shadow: 2xl
- Padding: 2rem (32px)
- Position: center of screen

Close Button:
- Position: absolute top-4 right-4
- Size: 32px × 32px
- Border Radius: full
- Background: gray-100
- Hover: gray-200
\`\`\`

### Animation & Transitions

#### Hover Effects
\`\`\`css
Scale Transform:
- Default: scale(1)
- Hover: scale(1.02-1.05)
- Duration: 300ms
- Timing: ease-out

Fade Effects:
- Opacity: 0 → 1
- Duration: 200ms
- Timing: ease-in-out

Shadow Transitions:
- From: shadow-md
- To: shadow-xl
- Duration: 300ms
\`\`\`

#### Loading States
\`\`\`css
Skeleton Loader:
- Background: linear-gradient(90deg, 
    #f0f0f0 25%, 
    #e0e0e0 50%, 
    #f0f0f0 75%)
- Background Size: 200% 100%
- Animation: shimmer 1.5s infinite

Spinner:
- Border: 3px solid rgba(255,103,0,0.1)
- Border Top: 3px solid #FF6700
- Border Radius: full
- Size: 20px-40px
- Animation: spin 1s linear infinite

Progress Bar:
- Height: 4px-8px
- Background: gray-200
- Fill: #FF6700
- Border Radius: full
- Transition: width 300ms ease-out
\`\`\`

#### Page Transitions
\`\`\`css
Enter:
- Opacity: 0 → 1
- Transform: translateY(10px) → translateY(0)
- Duration: 300ms
- Timing: ease-out

Exit:
- Opacity: 1 → 0
- Transform: translateY(0) → translateY(-10px)
- Duration: 200ms
- Timing: ease-in
\`\`\`

---

## Interactions

### Click/Tap Areas

\`\`\`css
Minimum Touch Target:
- Size: 44px × 44px (mobile)
- Size: 40px × 40px (desktop)

Padding for Small Elements:
- Icon buttons: p-2 (8px)
- Text buttons: px-4 py-2 (16px 8px)

Hover States:
- Background change
- Scale transform
- Color change
- Shadow increase
- Cursor: pointer
\`\`\`

### Keyboard Navigation

\`\`\`
Tab Order:
1. Skip to main content (hidden)
2. Header navigation
3. Main content
4. Form fields (top to bottom)
5. Buttons
6. Footer links

Focus Indicators:
- Ring: 2px #FF6700
- Outline: 2px offset
- Visible at all times

Keyboard Shortcuts:
- Escape: Close modals/dropdowns
- Arrow Keys: Navigate dropdowns
- Enter: Submit forms, activate buttons
- Space: Toggle checkboxes, activate buttons
- Tab: Move forward
- Shift + Tab: Move backward
\`\`\`

### Form Validation

\`\`\`
Real-time Validation:
- On blur (when field loses focus)
- On submit attempt

Error Display:
- Red border on input
- Error message below field
- Icon: AlertCircle

Success Display:
- Green border on input
- Checkmark icon
- Success message

Required Fields:
- Asterisk (*) in label
- "Required" in placeholder
- Error if empty on submit

Email Validation:
- Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Error: "Please enter a valid email"

Password Validation:
- Min Length: 6 characters
- Error: "Password must be at least 6 characters"
- Show/hide toggle available
- Strength indicator (optional)

Phone Validation:
- Pattern: South African format
- Optional: +27 prefix
- Error: "Please enter a valid phone number"

Price Validation:
- Format: "R XXX XXX.XX"
- Auto-formatting as user types
- Min: 0, Max: 99,999,999.99
- Error: "Please enter a valid price"
\`\`\`

### Touch Gestures

\`\`\`
Swipe Gestures:
- Image Gallery: Left/right swipe
- Carousel: Left/right swipe
- Threshold: 50px movement
- Velocity: Medium speed

Pinch Gestures:
- Image zoom (in modal)
- Two-finger pinch to zoom in/out
- Min scale: 1x
- Max scale: 3x

Double Tap:
- Image modal: Zoom toggle
- Quick action on mobile

Long Press:
- Context menu (future feature)
- Duration: 500ms
\`\`\`

### Scroll Behavior

\`\`\`css
Smooth Scrolling:
- scroll-behavior: smooth
- Duration: 300ms-500ms

Sticky Elements:
- Header: position: sticky, top: 0
- Filters Bar: position: sticky, top: [header-height]
- Z-index hierarchy maintained

Infinite Scroll:
- Trigger: 200px before bottom
- Load: 12-24 items per page
- Indicator: Loading spinner at bottom

Scroll to Top:
- Button appears after 500px scroll
- Position: fixed bottom-8 right-8
- Size: 48px × 48px
- Icon: ChevronUp
- Background: #FF6700
- Shadow: lg
\`\`\`

---

## Data Structure

### User Profile Schema

\`\`\`typescript
interface UserProfile {
  id: string                    // UUID from Supabase Auth
  email: string                 // Required, unique
  firstName?: string            // Optional
  lastName?: string             // Optional
  phone?: string                // Optional, format: +27 XX XXX XXXX
  suburb?: string               // Optional
  city?: string                 // Optional
  province?: string             // Optional, SA provinces
  profilePic?: string           // Optional, base64 or URL
  loginMethod: 'email' | 'google' | 'facebook' | 'apple'
  email_confirmed_at?: string   // ISO timestamp
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
}
\`\`\`

### Vehicle Schema

\`\`\`typescript
interface Vehicle {
  id: string                    // UUID
  user_id: string               // Foreign key to users
  
  // Basic Info
  make: string                  // Required, e.g., "Toyota"
  model: string                 // Required, e.g., "Corolla"
  variant?: string              // Optional, e.g., "1.4 TSI"
  year: number                  // Required, 1900-current year
  
  // Pricing & Condition
  price: number                 // Required, stored as cents
  mileage: number               // Required, in kilometers
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  
  // Technical Specs
  transmission: 'Manual' | 'Automatic'
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  engine_capacity: string       // e.g., "2.0L"
  body_type: string             // e.g., "Sedan", "SUV"
  
  // Description
  description?: string          // Optional, long text
  
  // Images
  image: string                 // Main image (first image)
  images: string[]              // Array of base64 or URLs, max 21
  
  // Seller Info (denormalized for performance)
  seller_name: string
  seller_email: string
  seller_phone: string
  seller_suburb?: string
  seller_city?: string
  seller_province?: string
  seller_profile_pic?: string
  
  // Location
  city: string
  province: string
  suburb?: string
  
  // Metadata
  status: 'active' | 'sold' | 'deleted'
  views: number                 // Default 0
  saves: number                 // Default 0
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
  deleted_at?: string           // Soft delete timestamp
  deletion_reason?: string      // Why was it deleted
}
\`\`\`

### Saved Vehicle Schema

\`\`\`typescript
interface SavedVehicle {
  id: string                    // UUID
  user_id: string               // Foreign key to users
  vehicle_id: string            // Foreign key to vehicles
  created_at: string            // ISO timestamp
}
\`\`\`

### Deleted Vehicle Schema

\`\`\`typescript
interface DeletedVehicle {
  id: string                    // Original vehicle ID
  user_id: string               // Who deleted it
  vehicle_data: Vehicle         // Full vehicle object
  deleted_at: string            // When deleted
  deletion_reason: string       // Why deleted
  // Reasons: 'sold' | 'no_longer_selling' | 
  //          'no_longer_need_service' | 'other'
}
\`\`\`

---

## Technical Implementation

### State Management

\`\`\`typescript
// Global User Context
const UserContext = createContext<{
  user: UserProfile | null
  authUser: any | null
  userProfile: UserProfile | null
  isLoading: boolean
  isEmailVerified: boolean
  listedVehicles: Vehicle[]
  savedVehicles: Vehicle[]
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  refreshUserProfile: () => Promise<void>
  deleteListedVehicle: (id: string) => Promise<void>
  refreshVehicles: () => Promise<void>
}>()
\`\`\`

### API Routes

\`\`\`typescript
// User Profile
GET    /api/user/profile
POST   /api/user/profile
PUT    /api/user/profile

// Vehicles
GET    /api/vehicles              // List all
GET    /api/vehicles/:id          // Get one
POST   /api/vehicles              // Create
PUT    /api/vehicles/:id          // Update
DELETE /api/vehicles/:id          // Delete

// Saved Vehicles
GET    /api/vehicles/saved        // List saved
POST   /api/vehicles/saved        // Save vehicle
DELETE /api/vehicles/saved/:id    // Unsave

// Authentication
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/signout
POST   /api/auth/reset-password
GET    /api/auth/callback         // OAuth callback
\`\`\`

### Database Tables

\`\`\`sql
-- Users table (managed by Supabase Auth)
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  suburb TEXT,
  city TEXT,
  province TEXT,
  profile_pic TEXT,
  login_method TEXT DEFAULT 'email',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW())),
  
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  
  transmission TEXT CHECK (transmission IN ('Manual', 'Automatic')),
  fuel TEXT CHECK (fuel IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  engine_capacity TEXT,
  body_type TEXT,
  
  description TEXT,
  
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  
  seller_name TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  seller_phone TEXT,
  seller_suburb TEXT,
  seller_city TEXT,
  seller_province TEXT,
  seller_profile_pic TEXT,
  
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  suburb TEXT,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deleted')),
  views INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deletion_reason TEXT
);

-- Saved Vehicles table
CREATE TABLE public.saved_vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

-- Deleted Vehicles table (for audit)
CREATE TABLE public.deleted_vehicles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  vehicle_data JSONB NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NOW(),
  deletion_reason TEXT
);

-- Indexes for performance
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_make_model ON public.vehicles(make, model);
CREATE INDEX idx_vehicles_price ON public.vehicles(price);
CREATE INDEX idx_vehicles_year ON public.vehicles(year);
CREATE INDEX idx_saved_vehicles_user_id ON public.saved_vehicles(user_id);
CREATE INDEX idx_saved_vehicles_vehicle_id ON public.saved_vehicles(vehicle_id);
\`\`\`

### Row Level Security (RLS)

\`\`\`sql
-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vehicles ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Vehicles Policies
CREATE POLICY "Anyone can view active vehicles"
  ON public.vehicles FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can insert own vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles"
  ON public.vehicles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles"
  ON public.vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- Saved Vehicles Policies
CREATE POLICY "Users can view own saved vehicles"
  ON public.saved_vehicles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved vehicles"
  ON public.saved_vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved vehicles"
  ON public.saved_vehicles FOR DELETE
  USING (auth.uid() = user_id);
\`\`\`

### Environment Variables

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database (auto-provided by Supabase)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url

# OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Deployment
NEXT_PUBLIC_SITE_URL=https://your-domain.com
\`\`\`

### Performance Optimizations

\`\`\`typescript
// Image Optimization
- Next.js Image component with:
  - Lazy loading
  - Responsive sizing
  - WebP format
  - Priority for above-fold images

// Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (automatic)
- Component-level splitting where needed

// Caching Strategy
- Static pages: ISR (revalidate every 60s)
- Dynamic pages: Client-side caching
- API responses: Cache-Control headers
- Images: CDN caching

// Database Queries
- Indexes on frequently queried columns
- Pagination (limit/offset)
- Select only needed columns
- Join optimization

// Bundle Size
- Tree shaking enabled
- Remove unused dependencies
- Analyze bundle with @next/bundle-analyzer
- Target < 200KB initial JS
\`\`\`

---

## Accessibility

### WCAG 2.1 AA Compliance

\`\`\`
Color Contrast:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

Keyboard Navigation:
- All interactive elements focusable
- Tab order logical
- Focus visible at all times
- Escape closes modals

Screen Readers:
- Semantic HTML elements
- ARIA labels where needed
- Alt text for all images
- Live regions for dynamic content

Forms:
- Labels associated with inputs
- Error messages announced
- Required fields indicated
- Field descriptions provided
\`\`\`

### ARIA Attributes

\`\`\`html
 Navigation 
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/">Home</a></li>
  </ul>
</nav>

 Form 
<form aria-label="Vehicle search">
  <input 
    type="text" 
    aria-label="Make of vehicle"
    aria-required="true"
    aria-describedby="make-hint"
  />
  <span id="make-hint">Enter vehicle manufacturer</span>
</form>

 Modal 
<div 
  role="dialog" 
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Contact Seller</h2>
</div>

 Loading 
<div 
  role="status" 
  aria-live="polite"
  aria-busy="true"
>
  Loading vehicles...
</div>
\`\`\`

---

## Browser Support

\`\`\`
Modern Browsers (Full Support):
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile Browsers:
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

Fallbacks:
- CSS Grid → Flexbox fallback
- CSS Variables → Static colors
- Modern JS → Babel transpilation to ES5
\`\`\`

---

## Testing Strategy

\`\`\`typescript
// Unit Tests
- Component rendering
- Utility functions
- Form validation
- Data transformations

// Integration Tests
- User authentication flow
- Vehicle CRUD operations
- Search and filter functionality
- Profile management

// E2E Tests (Playwright/Cypress)
- Complete user journeys
- Cross-browser testing
- Mobile responsiveness
- Performance metrics

// Visual Regression
- Screenshot comparison
- Component variations
- Responsive layouts
\`\`\`

---

## Deployment

### Vercel Configuration

\`\`\`json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
\`\`\`

### Build Optimization

\`\`\`javascript
// next.config.js
module.exports = {
  images: {
    domains: ['blob.v0.app', 'your-cdn.com'],
    formats: ['image/webp', 'image/avif']
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true
}
\`\`\`

---

## Future Enhancements

\`\`\`
Phase 2:
- Advanced search filters (color, features)
- Vehicle comparison tool
- Dealer accounts
- Promoted listings
- Real-time chat

Phase 3:
- AI-powered price suggestions
- Virtual vehicle tours (360° views)
- Financing calculator
- Insurance integration
- Test drive booking

Phase 4:
- Mobile apps (iOS/Android)
- Seller analytics dashboard
- Review and rating system
- Vehicle history reports
- Multi-language support
\`\`\`

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: Development Team
