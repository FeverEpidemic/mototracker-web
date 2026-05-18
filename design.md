# MotoTracker Web Design System

## Aesthetic Vision
The web version must feel like a **premium, state-of-the-art dashboard**. While the mobile app is optimized for quick entry on the go, the web version should leverage larger screens to show comprehensive data. 
- **Dark Mode Native:** Deep, immersive dark backgrounds.
- **Dynamic Interactions:** Smooth hover effects, subtle transitions on table rows, and glassmorphism elements.

## Color Palette
Derived from the mobile application to maintain brand consistency:

### Backgrounds & Surfaces
- **App Background:** `#020617` (Deep Slate)
- **Card/Surface:** `#0F172A` (Slate 800)
- **Secondary Surface:** `#1E293B` (Slate 700)
- **Borders/Dividers:** `#334155` (Slate 600)

### Accents & Typography
- **Primary Accent:** `#2563EB` (Vibrant Blue)
- **Secondary Accent:** `#38BDF8` (Light Blue / Info)
- **Text Primary:** `#F8FAFC` (Slate 50)
- **Text Secondary:** `#94A3B8` (Slate 400)

### Status Indicators
- **Success:** `#22C55E` (Green - Good Condition)
- **Warning:** `#F59E0B` (Yellow - Due Soon)
- **Danger:** `#EF4444` (Red - Overdue/Due Now)

## Typography
- **Primary Font:** `Inter` or `Outfit` (Google Fonts).
- Clean, sans-serif, highly legible for data tables and numbers.

## Layout Structure
- **Desktop (md and up):** 
  - Persistent left sidebar (approx 250px wide) containing navigation (Dashboard, Garage, Trips, Service, Settings).
  - Top header containing User Profile, global actions (e.g., "Quick Add Trip"), and a breadcrumb or page title.
  - Main content area with a max-width wrapper (e.g., 1200px) to prevent excessive stretching on ultrawide monitors.
- **Mobile (sm):**
  - Bottom navigation bar or top header with a hamburger menu (offcanvas drawer).
  - Single-column stacked layout for cards and lists.

## Component Guidelines
1. **Data Tables:** Use generous padding, subtle row hover states (background color change), and clearly aligned numeric columns.
2. **Forms:** Input fields should have a solid background (`#1E293B`), no visible borders until focused, and a primary blue ring on focus.
3. **Cards:** Add subtle drop shadows or a very faint 1px border to distinguish from the dark background. Use `border-radius: 12px` or `16px`.
