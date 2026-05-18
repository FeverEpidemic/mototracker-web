# MotoTracker Web - Skill & Context Document

## Project Context
MotoTracker is a system for tracking motorcycle odometers, logging trips, and managing service maintenance. The mobile app uses an offline-first architecture (Hive) that syncs to Supabase. This Web Version operates as a direct client to the same Supabase database.

## Database Entities (Supabase Schema Map)

### 1. `motorcycles`
- **id** (UUID, Primary Key)
- **user_id** (UUID, Foreign Key to Auth)
- **name** (Text)
- **brand** (Text)
- **model** (Text)
- **year** (Int)
- **plate_number** (Text)
- **current_odometer** (Int)
- **created_at** (Timestamp)
- **deleted_at** (Timestamp, null if active)

### 2. `trips`
- **id** (UUID, Primary Key)
- **motorcycle_id** (UUID, Foreign Key)
- **previous_odometer** (Int)
- **current_odometer** (Int)
- **distance** (Int)
- **duration_minutes** (Int)
- **category** (Text - e.g., 'daily', 'touring', 'errand')
- **notes** (Text)
- **trip_date** (Timestamp)
- **created_at** (Timestamp)
- **deleted_at** (Timestamp, null if active)

### 3. `service_reminders`
- **id** (UUID, Primary Key)
- **motorcycle_id** (UUID, Foreign Key)
- **service_type** (Text - e.g., 'Oil Change', 'Tire Replacement')
- **last_service_odometer** (Int)
- **interval_km** (Int)
- **created_at** (Timestamp)
- **deleted_at** (Timestamp, null if active)

### 4. `service_records`
- **id** (UUID, Primary Key)
- **motorcycle_id** (UUID, Foreign Key)
- **service_type** (Text)
- **odometer** (Int)
- **cost** (Numeric)
- **notes** (Text)
- **service_date** (Timestamp)
- **created_at** (Timestamp)
- **deleted_at** (Timestamp, null if active)

## Business Logic & Conventions

1. **Soft Deletes:** 
   The mobile app uses soft deletes (`deletedAt != null`) for synchronization purposes. The Web version must filter out deleted records in all `SELECT` queries (e.g., `.is('deleted_at', null)`).

2. **Service Status Calculation:**
   The Web app needs to calculate service statuses dynamically based on the motorcycle's `current_odometer`:
   - `kmsSinceLast` = `current_odometer` - `last_service_odometer`
   - `remaining` = `interval_km` - `kmsSinceLast`
   - **Good:** `remaining` > 500
   - **Due Soon:** `remaining` <= 500 AND `remaining` > 0
   - **Due Now/Overdue:** `remaining` <= 0

3. **Odometer Syncing:**
   When a new Trip or Service Record is added, the UI should prompt or automatically update the `current_odometer` on the `motorcycles` table if the new record's odometer is higher than the current one.
