'use server'

import { createClient } from '@/utils/supabase/server'
import { readText } from '@/lib/action-utils'

export async function updatePassword(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const newPassword = readText(formData, 'password')

  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    throw new Error(error.message)
  }
}
