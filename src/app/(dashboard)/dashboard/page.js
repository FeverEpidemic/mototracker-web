import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch data
  const { data: motorcycles } = await supabase.from('motorcycles').select('id, name, current_odometer').is('deleted_at', null);
  const { data: reminders } = await supabase.from('service_reminders').select('*').is('deleted_at', null);
  
  // Calculate date 7 days ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const { data: recentTrips } = await supabase
    .from('trips')
    .select('id')
    .is('deleted_at', null)
    .gte('trip_date', oneWeekAgo.toISOString());

  // Metrics calculation
  const totalDistance = (motorcycles || []).reduce((sum, m) => sum + (m.current_odometer || 0), 0);
  
  let urgentReminders = [];
  let dueSoonCount = 0;
  let overdueCount = 0;

  (reminders || []).forEach(reminder => {
    const moto = (motorcycles || []).find(m => m.id === reminder.motorcycle_id);
    if (moto) {
      const remaining = reminder.interval_km - (moto.current_odometer - reminder.last_service_odometer);
      if (remaining <= 0) {
        overdueCount++;
        urgentReminders.push({ ...reminder, motoName: moto.name, status: 'OVERDUE', remaining });
      } else if (remaining <= 500) {
        dueSoonCount++;
        urgentReminders.push({ ...reminder, motoName: moto.name, status: 'DUE SOON', remaining });
      }
    }
  });

  const totalUrgent = dueSoonCount + overdueCount;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Overview of your garage and upcoming services</p>
        </div>
        <Link href="/trips" className={styles.primaryButton}>
          Quick Add Trip
        </Link>
      </header>
      
      <main className={styles.main}>
        <div className={styles.dashboardGrid}>
          <div className={styles.card}>
            <h3>Total Distance</h3>
            <p className={styles.cardValue}>{totalDistance.toLocaleString()} <span className={styles.unit}>km</span></p>
          </div>
          <div className={styles.card} style={totalUrgent > 0 ? { borderColor: 'var(--warning)' } : {}}>
            <h3>Active Reminders</h3>
            <p className={`${styles.cardValue} ${totalUrgent > 0 ? styles.warning : ''}`}>
              {totalUrgent} <span className={styles.unit}>{totalUrgent === 1 ? 'Alert' : 'Alerts'}</span>
            </p>
          </div>
          <div className={styles.card}>
            <h3>Recent Trips</h3>
            <p className={styles.cardValue}>{(recentTrips || []).length} <span className={styles.unit}>this week</span></p>
          </div>
        </div>

        {urgentReminders.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Action Required</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {urgentReminders.map(alert => (
                <div key={alert.id} style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: alert.status === 'OVERDUE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${alert.status === 'OVERDUE' ? 'var(--danger)' : 'var(--warning)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ color: 'var(--foreground)', fontSize: '1.1rem' }}>{alert.motoName}: {alert.service_type}</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {alert.status === 'OVERDUE' 
                        ? `Overdue by ${Math.abs(alert.remaining).toLocaleString()} km`
                        : `Due in ${alert.remaining.toLocaleString()} km`
                      }
                    </p>
                  </div>
                  <Link href="/service" className={styles.secondaryButton} style={{ backgroundColor: 'var(--surface)', borderColor: 'transparent' }}>
                    Log Service
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
