import { createClient } from '@/utils/supabase/server'
import ClientService from './ClientService'

export const metadata = {
  title: 'Service | MotoTracker Web',
}

export default async function ServicePage() {
  const supabase = await createClient()
  
  // Fetch motorcycles for forms and context
  const { data: motorcycles } = await supabase
    .from('motorcycles')
    .select('id, name, current_odometer, plate_number')
    .is('deleted_at', null)

  // Fetch service reminders
  const { data: reminders } = await supabase
    .from('service_reminders')
    .select('*')
    .is('deleted_at', null)

  // Fetch service records (history)
  const { data: records } = await supabase
    .from('service_records')
    .select('*')
    .is('deleted_at', null)
    .order('service_date', { ascending: false })
    .limit(100)

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
