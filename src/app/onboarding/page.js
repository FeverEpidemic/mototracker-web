'use client'

import { useState, useTransition } from 'react'
import { Bike, AlertCircle } from 'lucide-react'
import { onboardUser } from './actions'
import styles from './page.module.css'

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState(null)

  // Local validation state
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [odometer, setOdometer] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    // Client-side validations
    if (!name || !brand || !model || !year || !odometer) {
      setError('Please fill in all required fields.')
      return
    }

    const yearVal = parseInt(year)
    const odometerVal = parseInt(odometer)
    const currentYear = new Date().getFullYear()

    if (isNaN(yearVal) || yearVal < 1900 || yearVal > currentYear + 1) {
      setError(`Please enter a valid manufacture year between 1900 and ${currentYear + 1}.`)
      return
    }

    if (isNaN(odometerVal) || odometerVal < 0) {
      setError('Please enter a valid odometer reading.')
      return
    }

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('brand', brand.trim())
    formData.append('model', model.trim())
    formData.append('year', year)
    formData.append('plate_number', plateNumber.trim())
    formData.append('current_odometer', odometer)

    startTransition(async () => {
      try {
        await onboardUser(formData)
      } catch (err) {
        setError(err.message || 'An unexpected error occurred. Please try again.')
      }
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.onboardingCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Bike size={32} />
          </div>
          <h1 className={styles.title}>Welcome to MotoTracker!</h1>
          <p className={styles.subtitle}>
            Let&apos;s get your digital garage started. To explore the dashboard, please add your first motorcycle.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="name">
              Motorcycle Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="e.g. My Daily Ride, Weekend Cruiser"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              disabled={isPending}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="brand">
                Brand / Make <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                id="brand"
                placeholder="e.g. Honda, Yamaha"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={styles.input}
                disabled={isPending}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="model">
                Model <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                id="model"
                placeholder="e.g. CBR 250RR, NMAX"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={styles.input}
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="year">
                Year <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="number"
                id="year"
                placeholder="e.g. 2022"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={styles.input}
                disabled={isPending}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="plate">
                Plate Number
              </label>
              <input
                type="text"
                id="plate"
                placeholder="e.g. B 1234 ABC (Optional)"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className={styles.input}
                disabled={isPending}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="odometer">
              Current Odometer (km) <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="number"
              id="odometer"
              placeholder="e.g. 12500"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className={styles.input}
              disabled={isPending}
              required
            />
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className={styles.spinner} />
                <span>Creating Garage...</span>
              </>
            ) : (
              <span>Add Motorcycle & Start</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
