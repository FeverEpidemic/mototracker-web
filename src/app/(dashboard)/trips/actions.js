'use server'

import { revalidatePath } from 'next/cache'
import {
  assertSupabaseSuccess,
  getAuthenticatedSupabase,
  readInt,
  readText,
} from '@/lib/action-utils'
import { randomUUID } from 'node:crypto'

export async function addTrip(formData) {
  const { supabase, user } = await getAuthenticatedSupabase()

  const motorcycle_id = readText(formData, 'motorcycle_id')
  const previous_odometer = readInt(formData, 'previous_odometer', { min: 0 })
  const current_odometer = readInt(formData, 'current_odometer', { min: previous_odometer })
  const distance = current_odometer - previous_odometer
  const { data: motorcycle, error: motorcycleError } = await supabase
    .from('motorcycles')
    .select('id, current_odometer')
    .eq('id', motorcycle_id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .maybeSingle()

  assertSupabaseSuccess(motorcycleError, 'Error validating motorcycle:')

  if (!motorcycle) {
    throw new Error('Motorcycle not found.')
  }

  const newTrip = {
    id: randomUUID(),
    user_id: user.id,
    motorcycle_id,
    previous_odometer,
    current_odometer,
    distance,
    duration_minutes: readInt(formData, 'duration_minutes', { min: 0, required: false }) || 0,
    category: readText(formData, 'category'),
    notes: readText(formData, 'notes', { required: false }),
    trip_date: readText(formData, 'trip_date'),
  }

  const { error } = await supabase.from('trips').insert([newTrip])
  assertSupabaseSuccess(error, 'Error adding trip:')

  if (current_odometer > motorcycle.current_odometer) {
    const { error: odometerError } = await supabase
      .from('motorcycles')
      .update({ current_odometer })
      .eq('id', motorcycle_id)
      .eq('user_id', user.id)

    assertSupabaseSuccess(odometerError, 'Error syncing motorcycle odometer:')
  }

  revalidatePath('/trips')
  revalidatePath('/garage')
  revalidatePath('/service')
  revalidatePath('/dashboard')
  revalidatePath('/analytics')
}

export async function updateTrip(formData) {
  const { supabase, user } = await getAuthenticatedSupabase()
  
  const id = readText(formData, 'id')
  const updates = {
    category: readText(formData, 'category'),
    notes: readText(formData, 'notes', { required: false }),
    trip_date: readText(formData, 'trip_date'),
    duration_minutes: readInt(formData, 'duration_minutes', { min: 0, required: false }) || 0,
  }

  const { error, count } = await supabase
    .from('trips')
    .update(updates, { count: 'exact' })
    .eq('id', id)
    .eq('user_id', user.id)

  assertSupabaseSuccess(error, 'Error updating trip:')

  if (count === 0) {
    throw new Error('Trip not found.')
  }

  revalidatePath('/trips')
  revalidatePath('/dashboard')
  revalidatePath('/analytics')
}
