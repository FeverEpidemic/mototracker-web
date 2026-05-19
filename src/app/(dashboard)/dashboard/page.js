import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';
import Link from 'next/link';
import { calculateReminderStatus } from '@/lib/reminder-utils';

export default async function Home() {
  const supabase = await createClient();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    { data: motorcycles },
    { data: reminders },
    { count: recentTripCount },
    { data: serviceRecords },
  ] = await Promise.all([
    supabase.from('motorcycles').select('id, name, current_odometer').is('deleted_at', null),
    supabase.from('service_reminders').select('id, motorcycle_id, service_type, last_service_odometer, interval_km, last_service_date, interval_months').is('deleted_at', null),
    supabase
      .from('trips')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .gte('trip_date', oneWeekAgo.toISOString()),
    supabase.from('service_records').select('motorcycle_id, cost').is('deleted_at', null),
  ]);

  // Metrics calculation
  const totalDistance = (motorcycles || []).reduce((sum, m) => sum + (m.current_odometer || 0), 0);
  
  const costMap = {};
  (serviceRecords || []).forEach(record => {
    const cost = parseFloat(record.cost) || 0;
    costMap[record.motorcycle_id] = (costMap[record.motorcycle_id] || 0) + cost;
  });
  
  let urgentReminders = [];
  let dueSoonCount = 0;
  let overdueCount = 0;

  (reminders || []).forEach(reminder => {
    const moto = (motorcycles || []).find(m => m.id === reminder.motorcycle_id);
    if (moto) {
      const { status, kmRemaining, daysRemaining } = calculateReminderStatus(reminder, moto.current_odometer);
      if (status === 'OVERDUE') {
        overdueCount++;
        urgentReminders.push({ ...reminder, motoName: moto.name, status, kmRemaining, daysRemaining });
      } else if (status === 'DUE SOON') {
        dueSoonCount++;
        urgentReminders.push({ ...reminder, motoName: moto.name, status, kmRemaining, daysRemaining });
      }
    }
  });

  const totalUrgent = dueSoonCount + overdueCount;

  const getRemainingMessage = (alert) => {
    const parts = [];
    if (alert.kmRemaining !== null) {
      if (alert.kmRemaining <= 0) {
        parts.push(`Overdue by ${Math.abs(alert.kmRemaining).toLocaleString()} km`);
      } else {
        parts.push(`Due in ${alert.kmRemaining.toLocaleString()} km`);
      }
    }
    if (alert.daysRemaining !== null) {
      if (alert.daysRemaining <= 0) {
        parts.push(`Overdue by ${Math.abs(alert.daysRemaining)} ${Math.abs(alert.daysRemaining) === 1 ? 'day' : 'days'}`);
      } else {
        parts.push(`Due in ${alert.daysRemaining} ${alert.daysRemaining === 1 ? 'day' : 'days'}`);
      }
    }
    return parts.join(' or ');
  };

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
            <p className={styles.cardValue}>{recentTripCount || 0} <span className={styles.unit}>this week</span></p>
          </div>
          <div className={styles.card}>
            <h3>Total Service Cost</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
              {(motorcycles || []).map(moto => {
                const cost = costMap[moto.id] || 0;
                return (
                  <div key={moto.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{moto.name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                      Rp {cost.toLocaleString('id-ID')}
                    </span>
                  </div>
                );
              })}
              {(motorcycles || []).length === 0 && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No motorcycles in garage</div>
              )}
            </div>
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
                      {getRemainingMessage(alert)}
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
