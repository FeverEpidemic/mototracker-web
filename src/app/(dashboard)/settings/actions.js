'use server'

import { createClient } from '@/utils/supabase/server'

export async function updatePassword(formData) {
  const supabase = await createClient()
  const newPassword = formData.get('password')
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    throw new Error(error.message)
  }
}
