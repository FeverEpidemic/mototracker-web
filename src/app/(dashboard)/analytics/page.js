import { createClient } from '@/utils/supabase/server'
import AnalyticsClient from './AnalyticsClient'

export const metadata = {
  title: 'Analytics | MotoTracker',
}

export default async function AnalyticsPage() {
  const supabase = await createClient()
  
  // Fetch trips for user
  const { data: { user } } = await supabase.auth.getUser()
  const { data: trips } = await supabase
    .from('trips')
    .select(`*, motorcycles!inner(user_id)`)
    .eq('motorcycles.user_id', user.id)
    .is('deleted_at', null)
    .order('trip_date', { ascending: true })

  // Data processing for charts
  const distanceByMonth = {}
  const distanceByCategory = {}
  
  trips?.forEach(trip => {
    // 1. Group by Month (e.g., 'Jan 2026')
    const date = new Date(trip.trip_date)
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' })
    if (!distanceByMonth[month]) distanceByMonth[month] = 0
    distanceByMonth[month] += trip.distance

    // 2. Group by Category
    const cat = trip.category || 'Uncategorized'
    if (!distanceByCategory[cat]) distanceByCategory[cat] = 0
    distanceByCategory[cat] += trip.distance
  })

  // Format data for Recharts
  const monthlyData = Object.keys(distanceByMonth).map(month => ({
    name: month,
    distance: distanceByMonth[month]
  }))

  const categoryData = Object.keys(distanceByCategory).map(cat => ({
    name: cat,
    value: distanceByCategory[cat]
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <AnalyticsClient monthlyData={monthlyData} categoryData={categoryData} />
    </div>
  )
}
