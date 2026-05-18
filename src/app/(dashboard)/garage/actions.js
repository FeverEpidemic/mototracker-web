'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMotorcycle(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const newMoto = {
    user_id: user.id,
    name: formData.get('name'),
    brand: formData.get('brand'),
    model: formData.get('model'),
    year: parseInt(formData.get('year')),
    plate_number: formData.get('plate_number'),
    current_odometer: parseInt(formData.get('current_odometer')),
  }

  const { error } = await supabase
    .from('motorcycles')
    .insert([newMoto])

  if (error) {
    console.error('Error adding motorcycle:', error)
    throw new Error(error.message)
  }

  revalidatePath('/garage')
  revalidatePath('/')
}

export async function updateOdometer(formData) {
  const supabase = await createClient()
  
  const id = formData.get('id');
  const newOdometer = formData.get('current_odometer');

  const { error } = await supabase
    .from('motorcycles')
    .update({ current_odometer: parseInt(newOdometer) })
    .eq('id', id)

  if (error) {
    console.error('Error updating odometer:', error)
    throw new Error(error.message)
  }

  revalidatePath('/garage')
  revalidatePath('/')
}
