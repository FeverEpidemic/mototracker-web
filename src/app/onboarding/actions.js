'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  assertSupabaseSuccess,
  createMotorcyclePayload,
  getAuthenticatedSupabase,
} from '@/lib/action-utils'

export async function onboardUser(formData) {
  const { supabase, user } = await getAuthenticatedSupabase()
  const newMoto = createMotorcyclePayload(formData, user.id)

  const { error } = await supabase
    .from('motorcycles')
    .insert([newMoto])

  assertSupabaseSuccess(error, 'Error adding motorcycle in onboarding:')

  revalidatePath('/dashboard')
  revalidatePath('/garage')
  revalidatePath('/')
  redirect('/dashboard')
}
