import { createClient } from '@/utils/supabase/server'
import ClientTrips from './ClientTrips'

export const metadata = {
  title: 'Trips | MotoTracker Web',
}

export default async function TripsPage() {
  const supabase = await createClient()
  
  const [{ data: trips }, { data: motorcycles }] = await Promise.all([
    supabase
      .from('trips')
      .select(`
        id,
        motorcycle_id,
        category,
        distance,
        duration_minutes,
        notes,
        trip_date,
        previous_odometer,
        current_odometer,
        motorcycles (
          name,
          plate_number
        )
      `)
      .is('deleted_at', null)
      .order('trip_date', { ascending: false })
      .limit(100),
    supabase
      .from('motorcycles')
      .select('id, name, current_odometer')
      .is('deleted_at', null),
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientTrips initialTrips={trips || []} motorcycles={motorcycles || []} />
    </div>
  )
}
