import { createClient } from '@/utils/supabase/server'
import ClientTrips from './ClientTrips'

export const metadata = {
  title: 'Trips | MotoTracker Web',
}

export default async function TripsPage() {
  const supabase = await createClient()
  
  // Fetch trips and join with motorcycle details
  const { data: trips } = await supabase
    .from('trips')
    .select(`
      *,
      motorcycles (
        name,
        plate_number
      )
    `)
    .is('deleted_at', null)
    .order('trip_date', { ascending: false })
    // Limit to 100 for now; infinite scroll can be added later
    .limit(100)

  // Fetch motorcycles for the dropdown
  const { data: motorcycles } = await supabase
    .from('motorcycles')
    .select('id, name, current_odometer')
    .is('deleted_at', null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientTrips initialTrips={trips || []} motorcycles={motorcycles || []} />
    </div>
  )
}
