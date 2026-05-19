import { randomUUID } from 'node:crypto'
import { createClient } from '@/utils/supabase/server'

export const DASHBOARD_PATHS = ['/dashboard', '/garage', '/trips', '/service', '/analytics']

export async function getAuthenticatedSupabase() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

export function readText(formData, field, { required = true } = {}) {
  const value = String(formData.get(field) ?? '').trim()

  if (required && !value) {
    throw new Error(`${field.replaceAll('_', ' ')} is required.`)
  }

  return value || null
}

export function readInt(formData, field, { min = null, required = true } = {}) {
  const rawValue = formData.get(field)
  const value = rawValue === null || rawValue === '' ? NaN : Number.parseInt(rawValue, 10)

  if (required && Number.isNaN(value)) {
    throw new Error(`${field.replaceAll('_', ' ')} must be a valid number.`)
  }

  if (!Number.isNaN(value) && min !== null && value < min) {
    throw new Error(`${field.replaceAll('_', ' ')} must be at least ${min}.`)
  }

  return Number.isNaN(value) ? null : value
}

export function readFloat(formData, field, { min = null, defaultValue = 0 } = {}) {
  const rawValue = formData.get(field)
  const value = rawValue === null || rawValue === '' ? defaultValue : Number.parseFloat(rawValue)

  if (Number.isNaN(value)) {
    throw new Error(`${field.replaceAll('_', ' ')} must be a valid number.`)
  }

  if (min !== null && value < min) {
    throw new Error(`${field.replaceAll('_', ' ')} must be at least ${min}.`)
  }

  return value
}

export function createMotorcyclePayload(formData, userId) {
  const currentYear = new Date().getFullYear()
  const year = readInt(formData, 'year', { min: 1900 })

  if (year > currentYear + 1) {
    throw new Error(`year must be no later than ${currentYear + 1}.`)
  }

  return {
    id: randomUUID(),
    user_id: userId,
    name: readText(formData, 'name'),
    brand: readText(formData, 'brand'),
    model: readText(formData, 'model'),
    year,
    plate_number: readText(formData, 'plate_number', { required: false }),
    current_odometer: readInt(formData, 'current_odometer', { min: 0 }),
  }
}

export function assertSupabaseSuccess(error, message) {
  if (error) {
    console.error(message, error)
    throw new Error(error.message)
  }
}
