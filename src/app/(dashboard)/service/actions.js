'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addServiceRecord(formData) {
  const supabase = await createClient()

  const motorcycle_id = formData.get('motorcycle_id')
  const odometer = parseInt(formData.get('odometer'))
  const service_type = formData.get('service_type')

  const newRecord = {
    motorcycle_id,
    service_type,
    odometer,
    cost: parseFloat(formData.get('cost')) || 0,
    notes: formData.get('notes'),
    service_date: formData.get('service_date'),
  }

  const { error } = await supabase.from('service_records').insert([newRecord])
  if (error) {
    console.error('Error adding service record:', error)
    throw new Error(error.message)
  }

  // Auto-update associated service reminder to reset the interval if it exists
  const { data: reminder } = await supabase
    .from('service_reminders')
    .select('id')
    .eq('motorcycle_id', motorcycle_id)
    .eq('service_type', service_type)
    .single()

  if (reminder) {
    await supabase
      .from('service_reminders')
      .update({ last_service_odometer: odometer })
      .eq('id', reminder.id)
  }

  // Odometer Syncing Rule: Update if the new record's odometer is higher
  const { data: moto } = await supabase
    .from('motorcycles')
    .select('current_odometer')
    .eq('id', motorcycle_id)
    .single()

  if (moto && odometer > moto.current_odometer) {
    await supabase
      .from('motorcycles')
      .update({ current_odometer: odometer })
      .eq('id', motorcycle_id)
  }

  revalidatePath('/service')
  revalidatePath('/garage')
  revalidatePath('/')
}

export async function addServiceReminder(formData) {
  const supabase = await createClient()

  const newReminder = {
    motorcycle_id: formData.get('motorcycle_id'),
    service_type: formData.get('service_type'),
    last_service_odometer: parseInt(formData.get('last_service_odometer')),
    interval_km: parseInt(formData.get('interval_km')),
  }

  const { error } = await supabase.from('service_reminders').insert([newReminder])
  if (error) {
    console.error('Error adding service reminder:', error)
    throw new Error(error.message)
  }

  revalidatePath('/service')
  revalidatePath('/')
}
