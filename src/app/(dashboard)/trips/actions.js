'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTrip(formData) {
  const supabase = await createClient()

  const motorcycle_id = formData.get('motorcycle_id')
  const previous_odometer = parseInt(formData.get('previous_odometer'))
  const current_odometer = parseInt(formData.get('current_odometer'))
  const distance = current_odometer - previous_odometer

  const newTrip = {
    motorcycle_id,
    previous_odometer,
    current_odometer,
    distance: distance > 0 ? distance : 0,
    duration_minutes: parseInt(formData.get('duration_minutes')) || 0,
    category: formData.get('category'),
    notes: formData.get('notes'),
    trip_date: formData.get('trip_date'),
  }

  const { error } = await supabase.from('trips').insert([newTrip])
  if (error) {
    console.error('Error adding trip:', error)
    throw new Error(error.message)
  }

  // Odometer Syncing Rule: Update if the new trip's odometer is higher
  const { data: moto } = await supabase
    .from('motorcycles')
    .select('current_odometer')
    .eq('id', motorcycle_id)
    .single()

  if (moto && current_odometer > moto.current_odometer) {
    await supabase
      .from('motorcycles')
      .update({ current_odometer })
      .eq('id', motorcycle_id)
  }

  revalidatePath('/trips')
  revalidatePath('/garage')
  revalidatePath('/')
}

export async function updateTrip(formData) {
  const supabase = await createClient()
  
  const id = formData.get('id')
  const updates = {
    category: formData.get('category'),
    notes: formData.get('notes'),
    trip_date: formData.get('trip_date'),
    duration_minutes: parseInt(formData.get('duration_minutes')) || 0,
  }

  const { error } = await supabase
    .from('trips')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating trip:', error)
    throw new Error(error.message)
  }

  revalidatePath('/trips')
}
