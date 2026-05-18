'use client';

import { useState } from 'react';
import styles from '../garage/page.module.css'; // Reusing layout styles
import { updatePassword } from './actions';
import { signOut } from '@/app/login/actions';

export default function ClientSettings({ userEmail }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordUpdate = async (formData) => {
    setMessage('');
    setError('');
    const pwd1 = formData.get('password');
    const pwd2 = formData.get('confirm_password');
    
    if (pwd1 !== pwd2) {
      setError('Passwords do not match.');
      return;
    }
    if (pwd1.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    try {
      await updatePassword(formData);
      setMessage('Password updated successfully.');
      document.getElementById('password-form').reset();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>Manage your account preferences</p>
        </div>
      </header>
      
      <main className={styles.main}>
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className={styles.card}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: 600 }}>Account Information</h3>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input className={styles.input} type="email" disabled value={userEmail || ''} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              Your email is managed by your authentication provider.
            </p>
          </div>

          <div className={styles.card}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: 600 }}>Change Password</h3>
            {message && <div className={styles.message}>{message}</div>}
            {error && <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
            
            <form id="password-form" action={handlePasswordUpdate} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>New Password</label>
                <input className={styles.input} name="password" type="password" required placeholder="••••••••" />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm New Password</label>
                <input className={styles.input} name="confirm_password" type="password" required placeholder="••••••••" />
              </div>
              <div className={styles.formActions} style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.primaryButton}>Update Password</button>
              </div>
            </form>
          </div>

          <div className={styles.card} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--danger)', fontSize: '1.1rem', fontWeight: 600 }}>Danger Zone</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Logging out will securely end your current session across the web application.
            </p>
            <form action={signOut}>
              <button type="submit" className={styles.secondaryButton} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                Sign Out of MotoTracker
              </button>
            </form>
          </div>

        </div>
      </main>
    </>
  );
}
