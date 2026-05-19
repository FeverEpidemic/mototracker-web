# MotoTracker Web Version: Project Plan

## Overview
A web-based companion application for the MotoTracker mobile app. This application will connect to the existing Supabase backend, allowing users to manage their garage, log trips, and view service records from a desktop environment. 

## Technology Stack
- **Framework:** Next.js (React) - For robust routing and server-side capabilities.
- **Backend/Auth:** Supabase Client (`@supabase/ssr` and `@supabase/supabase-js`).
- **Styling:** Vanilla CSS Modules (to maintain maximum control and modern aesthetics).
- **Icons:** Lucide React or similar modern icon set.

## Architecture
Since the mobile app handles offline-first data via Hive, the Web application will operate as a direct cloud client. It will read and write directly to the Supabase Postgres database. Data entered here will be synced down to the mobile app upon its next launch.

## Execution Milestones

### Phase 1: Foundation & Authentication
- Initialize Next.js project with App Router.
- Integrate Supabase SSR for web authentication.
- Implement Login/Register screens matching the mobile aesthetic.
- Setup Google Sign-In and Email/Password flows.

### Phase 1.5: User Onboarding
- Prevent users from seeing an empty dashboard by querying their garage on load.
- If garage is empty, redirect to a focused, premium `/onboarding` screen.
- Design `/onboarding` flow to capture the user's first motorcycle (Make, Model, Year, Odometer).
- Securely insert the onboarding record into Supabase and redirect to `/dashboard`.

### Phase 2: Layout & Dashboard Core
- Create persistent layout (Desktop Sidebar Navigation, Mobile Hamburger Menu).
- Build the core Dashboard screen aggregating data (Total Distance, Active Reminders, Recent Trips).
- Implement reusable UI components (Buttons, Cards, Modals, Data Tables).

### Phase 3: Garage Management
- Implement Motorcycle list view (Grid/Table).
- Create "Add Motorcycle" and "Edit Odometer" forms.
- Ensure realtime updates or optimistic UI when odometer changes.

### Phase 4: Trip Logging
- Implement a comprehensive Data Table for Trips (sortable by date, distance, category).
- Create forms for logging new trips and editing existing ones.
- Implement pagination or infinite scrolling for large trip histories.

### Phase 5: Service & Maintenance
- Build the Service History timeline/table.
- Implement logic to calculate service due statuses (Good, Due Soon, Due Now, Overdue) matching the mobile app's algorithm.
- Display urgent service alerts prominently on the dashboard.
