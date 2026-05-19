'use server'

import { revalidatePath } from 'next/cache'
import {
  assertSupabaseSuccess,
  createMotorcyclePayload,
  DASHBOARD_PATHS,
  getAuthenticatedSupabase,
  readInt,
  readText,
} from '@/lib/action-utils'

export async function addMotorcycle(formData) {
  const { supabase, user } = await getAuthenticatedSupabase()
  const newMoto = createMotorcyclePayload(formData, user.id)

  const { error } = await supabase
    .from('motorcycles')
    .insert([newMoto])

  assertSupabaseSuccess(error, 'Error adding motorcycle:')

  DASHBOARD_PATHS.forEach((path) => revalidatePath(path))
}

export async function updateOdometer(formData) {
  const { supabase, user } = await getAuthenticatedSupabase()
  const id = readText(formData, 'id')
  const current_odometer = readInt(formData, 'current_odometer', { min: 0 })

  const { error, count } = await supabase
    .from('motorcycles')
    .update({ current_odometer }, { count: 'exact' })
    .eq('id', id)
    .eq('user_id', user.id)

  assertSupabaseSuccess(error, 'Error updating odometer:')

  if (count === 0) {
    throw new Error('Motorcycle not found.')
  }

  revalidatePath('/dashboard')
  revalidatePath('/garage')
  revalidatePath('/service')
  revalidatePath('/analytics')
}
