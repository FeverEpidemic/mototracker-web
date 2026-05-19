'use server'

import { revalidatePath } from 'next/cache'
import { randomUUID } from 'node:crypto'
import {
  assertSupabaseSuccess,
  getAuthenticatedSupabase,
  readFloat,
  readInt,
  readText,
} from '@/lib/action-utils'

export async function addServiceRecord(formData) {
  const { supabase, user } = await getAuthenticatedSupabase()

  const motorcycle_id = readText(formData, 'motorcycle_id')
  const odometer = readInt(formData, 'odometer', { min: 0 })
  const service_type = readText(formData, 'service_type')
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

  const newRecord = {
    id: randomUUID(),
    user_id: user.id,
    motorcycle_id,
    service_type,
    odometer,
    cost: readFloat(formData, 'cost', { min: 0 }),
    notes: readText(formData, 'notes', { required: false }),
    service_date: readText(formData, 'service_date'),
  }

  const { error } = await supabase.from('service_records').insert([newRecord])
  assertSupabaseSuccess(error, 'Error adding service record:')

  // Auto-update associated service reminder to reset the interval if it exists
  const { data: reminder, error: reminderLookupError } = await supabase
    .from('service_reminders')
    .select('id')
    .eq('motorcycle_id', motorcycle_id)
    .eq('user_id', user.id)
    .eq('service_type', service_type)
    .maybeSingle()

  assertSupabaseSuccess(reminderLookupError, 'Error finding service reminder:')

  if (reminder) {
    const { error: reminderError } = await supabase
      .from('service_reminders')
      .update({ last_service_odometer: odometer })
      .eq('id', reminder.id)
      .eq('user_id', user.id)

    assertSupabaseSuccess(reminderError, 'Error updating service reminder:')
  }

  if (odometer > motorcycle.current_odometer) {
    const { error: odometerError } = await supabase
      .from('motorcycles')
      .update({ current_odometer: odometer })
      .eq('id', motorcycle_id)
      .eq('user_id', user.id)

    assertSupabaseSuccess(odometerError, 'Error syncing motorcycle odometer:')
  }

  revalidatePath('/service')
  revalidatePath('/garage')
  revalidatePath('/dashboard')
  revalidatePath('/analytics')
}

export async function addServiceReminder(formData) {
  const { supabase, user } = await getAuthenticatedSupabase()
  const motorcycle_id = readText(formData, 'motorcycle_id')
  const { data: motorcycle, error: motorcycleError } = await supabase
    .from('motorcycles')
    .select('id')
    .eq('id', motorcycle_id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .maybeSingle()

  assertSupabaseSuccess(motorcycleError, 'Error validating motorcycle:')

  if (!motorcycle) {
    throw new Error('Motorcycle not found.')
  }

  const last_service_odometer = readInt(formData, 'last_service_odometer', { min: 0, required: false })
  const interval_km = readInt(formData, 'interval_km', { min: 1, required: false })
  const last_service_date = readText(formData, 'last_service_date', { required: false })
  const interval_months = readInt(formData, 'interval_months', { min: 1, required: false })

  const hasOdometer = last_service_odometer !== null && interval_km !== null
  const hasTime = last_service_date !== null && interval_months !== null

  if (!hasOdometer && !hasTime) {
    throw new Error('Please configure either an Odometer Interval or a Date/Time Interval for the reminder.')
  }

  const newReminder = {
    id: randomUUID(),
    user_id: user.id,
    motorcycle_id,
    service_type: readText(formData, 'service_type'),
    last_service_odometer,
    interval_km,
    last_service_date,
    interval_months,
  }

  const { error } = await supabase.from('service_reminders').insert([newReminder])
  assertSupabaseSuccess(error, 'Error adding service reminder:')

  revalidatePath('/service')
  revalidatePath('/dashboard')
}

export async function updateServiceReminder(formData) {
  const { supabase, user } = await getAuthenticatedSupabase()
  const id = readText(formData, 'id')
  
  const { data: reminder, error: reminderError } = await supabase
    .from('service_reminders')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .maybeSingle()

  assertSupabaseSuccess(reminderError, 'Error validating service reminder:')

  if (!reminder) {
    throw new Error('Service reminder not found.')
  }

  const last_service_odometer = readInt(formData, 'last_service_odometer', { min: 0, required: false })
  const interval_km = readInt(formData, 'interval_km', { min: 1, required: false })
  const last_service_date = readText(formData, 'last_service_date', { required: false })
  const interval_months = readInt(formData, 'interval_months', { min: 1, required: false })

  const hasOdometer = last_service_odometer !== null && interval_km !== null
  const hasTime = last_service_date !== null && interval_months !== null

  if (!hasOdometer && !hasTime) {
    throw new Error('Please configure either an Odometer Interval or a Date/Time Interval for the reminder.')
  }

  const updatedFields = {
    service_type: readText(formData, 'service_type'),
    last_service_odometer,
    interval_km,
    last_service_date,
    interval_months,
  }

  const { error } = await supabase
    .from('service_reminders')
    .update(updatedFields)
    .eq('id', id)
    .eq('user_id', user.id)

  assertSupabaseSuccess(error, 'Error updating service reminder:')

  revalidatePath('/service')
  revalidatePath('/dashboard')
}
