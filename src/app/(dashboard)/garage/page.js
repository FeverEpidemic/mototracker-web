import { createClient } from '@/utils/supabase/server'
import ClientGarage from './ClientGarage'

export const metadata = {
  title: 'Garage | MotoTracker Web',
}

export default async function GaragePage() {
  const supabase = await createClient()
  const { data: motorcycles } = await supabase
    .from('motorcycles')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientGarage initialMotorcycles={motorcycles || []} />
    </div>
  )
}
