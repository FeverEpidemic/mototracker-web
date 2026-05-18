import { createClient } from '@/utils/supabase/server'
import ClientSettings from './ClientSettings'

export const metadata = {
  title: 'Settings | MotoTracker Web',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientSettings userEmail={user?.email} />
    </div>
  )
}
