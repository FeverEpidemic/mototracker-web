'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  
  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { data: signUpData, error } = await supabase.auth.signUp(data)
  
  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (signUpData?.session) {
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/login?message=Check your email to continue the sign in process')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }
  
  if (data?.url) {
    redirect(data.url)
  }

  redirect('/login?error=' + encodeURIComponent('Unable to start Google sign in.'))
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
