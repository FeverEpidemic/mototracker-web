import { createClient } from '@/utils/supabase/server'
import ClientService from './ClientService'

export const metadata = {
  title: 'Service | MotoTracker Web',
}

export default async function ServicePage() {
  const supabase = await createClient()
  
  const [{ data: motorcycles }, { data: reminders }, { data: records }] = await Promise.all([
    supabase
      .from('motorcycles')
      .select('id, name, current_odometer, plate_number')
      .is('deleted_at', null),
    supabase
      .from('service_reminders')
      .select('id, motorcycle_id, service_type, last_service_odometer, interval_km, last_service_date, interval_months')
      .is('deleted_at', null),
    supabase
      .from('service_records')
      .select('id, motorcycle_id, service_type, odometer, cost, notes, service_date')
      .is('deleted_at', null)
      .order('service_date', { ascending: false })
      .limit(100),
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientService 
        motorcycles={motorcycles || []} 
        reminders={reminders || []} 
        records={records || []} 
      />
    </div>
  )
}
