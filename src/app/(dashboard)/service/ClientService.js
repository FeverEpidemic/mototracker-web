'use client';

import { useState } from 'react';
import { Plus, BellRing, Wrench } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import styles from '../garage/page.module.css'; // Reusing styles
import { addServiceRecord, addServiceReminder, updateServiceReminder } from './actions';
import { calculateReminderStatus } from '@/lib/reminder-utils';

export default function ClientService({ motorcycles, reminders, records }) {
  const [isRecordModalOpen, setRecordModalOpen] = useState(false);
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedMoto, setSelectedMoto] = useState(null);
  const [editReminder, setEditReminder] = useState(null);

  // Status calculation logic based on reminder-utils
  const getStatus = (reminder) => {
    const moto = motorcycles.find(m => m.id === reminder.motorcycle_id);
    if (!moto) return { status: 'UNKNOWN', color: 'text-secondary', kmRemaining: null, daysRemaining: null };
    return calculateReminderStatus(reminder, moto.current_odometer);
  };

  const reminderColumns = [
    { 
      key: 'motorcycle_id', 
      label: 'Motorcycle', 
      render: (val) => motorcycles.find(m => m.id === val)?.name || 'Unknown' 
    },
    { key: 'service_type', label: 'Service Type' },
    { 
      key: 'interval', 
      label: 'Interval', 
      render: (_, row) => {
        const parts = [];
        if (row.interval_km) {
          parts.push(`${row.interval_km.toLocaleString()} km`);
        }
        if (row.interval_months) {
          parts.push(`${row.interval_months} ${row.interval_months === 1 ? 'month' : 'months'}`);
        }
        return parts.join(' or ') || '-';
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => {
        const { status, color, kmRemaining, daysRemaining } = getStatus(row);
        
        const details = [];
        if (kmRemaining !== null) {
          if (kmRemaining <= 0) {
            details.push(`${Math.abs(kmRemaining).toLocaleString()} km overdue`);
          } else {
            details.push(`${kmRemaining.toLocaleString()} km left`);
          }
        }
        if (daysRemaining !== null) {
          if (daysRemaining <= 0) {
            details.push(`${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'day' : 'days'} overdue`);
          } else {
            details.push(`${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`);
          }
        }
        
        const detailStr = details.length > 0 ? ` (${details.join(' / ')})` : '';

        return (
          <span style={{ color: `var(--${color})`, fontWeight: 600 }}>
            {status}{detailStr}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          className={styles.editButton}
          onClick={() => {
            setEditReminder(row);
            setSelectedMoto(motorcycles.find(m => m.id === row.motorcycle_id));
          }}
        >
          Edit
        </button>
      )
    }
  ];

  const recordColumns = [
    { 
      key: 'service_date', 
      label: 'Date', 
      render: (val) => new Date(val).toLocaleDateString()
    },
    { 
      key: 'motorcycle_id', 
      label: 'Motorcycle', 
      render: (val) => motorcycles.find(m => m.id === val)?.name || 'Unknown' 
    },
    { key: 'service_type', label: 'Type' },
    { key: 'odometer', label: 'Odometer', render: (val) => `${val.toLocaleString()} km` },
    { key: 'cost', label: 'Cost', render: (val) => `Rp ${parseFloat(val).toLocaleString('id-ID')}` },
    { key: 'notes', label: 'Notes' }
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Service & Maintenance</h1>
          <p className={styles.pageSubtitle}>Track service history and active reminders</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className={styles.secondaryButton} style={{ color: '#fff' }} onClick={() => setReminderModalOpen(true)}>
            <BellRing size={20} /> Add Reminder
          </button>
          <button className={styles.primaryButton} onClick={() => setRecordModalOpen(true)}>
            <Wrench size={20} /> Log Service
          </button>
        </div>
      </header>
      
      <main className={styles.main}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Active Reminders</h2>
          <DataTable 
            columns={reminderColumns}
            data={reminders}
          />
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Service History</h2>
          <DataTable 
            columns={recordColumns}
            data={records}
          />
        </div>
      </main>

      {/* Log Service Record Modal */}
      <Modal 
        isOpen={isRecordModalOpen} 
        onClose={() => {
          setSelectedMoto(null);
          setRecordModalOpen(false);
        }} 
        title="Log Service Record"
      >
        <form action={async (formData) => {
          await addServiceRecord(formData);
          setSelectedMoto(null);
          setRecordModalOpen(false);
        }} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Motorcycle</label>
            <select className={styles.input} name="motorcycle_id" required onChange={(e) => setSelectedMoto(motorcycles.find(m => m.id === e.target.value))} defaultValue="">
              <option value="" disabled>Select a motorcycle</option>
              {motorcycles.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Service Type</label>
              <input className={styles.input} name="service_type" required placeholder="Oil Change, Tires, etc." />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Service Date</label>
              <input className={styles.input} name="service_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Odometer (km)</label>
              <input
                className={styles.input}
                name="odometer"
                type="number"
                min="0"
                required
                key={selectedMoto?.id || 'empty-service-odometer'}
                defaultValue={selectedMoto?.current_odometer || ''}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cost (Rp)</label>
              <input className={styles.input} name="cost" type="number" placeholder="0" />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Notes</label>
            <textarea className={styles.input} name="notes" rows="3" placeholder="Additional details"></textarea>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => {
              setSelectedMoto(null);
              setRecordModalOpen(false);
            }}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Save Record</button>
          </div>
        </form>
      </Modal>

      {/* Add Reminder Modal */}
      <Modal 
        isOpen={isReminderModalOpen} 
        onClose={() => {
          setSelectedMoto(null);
          setReminderModalOpen(false);
        }} 
        title="Create Service Reminder"
      >
        <form action={async (formData) => {
          try {
            await addServiceReminder(formData);
            setSelectedMoto(null);
            setReminderModalOpen(false);
          } catch (e) {
            alert(e.message);
          }
        }} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Motorcycle</label>
            <select className={styles.input} name="motorcycle_id" required onChange={(e) => setSelectedMoto(motorcycles.find(m => m.id === e.target.value))} defaultValue="">
              <option value="" disabled>Select a motorcycle</option>
              {motorcycles.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Service Type</label>
            <input className={styles.input} name="service_type" required placeholder="e.g. Oil Change" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
            {/* Odometer Section */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Odometer Interval (Optional)</h4>
              <div className={styles.row} style={{ margin: 0, gap: '1rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>Last Service Odometer (km)</label>
                  <input
                    className={styles.input}
                    name="last_service_odometer"
                    type="number"
                    min="0"
                    key={selectedMoto?.id || 'empty-reminder-odometer'}
                    defaultValue={selectedMoto?.current_odometer || ''}
                    placeholder="e.g. 10000"
                  />
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>Interval (km)</label>
                  <input className={styles.input} name="interval_km" type="number" min="1" placeholder="e.g. 5000" />
                </div>
              </div>
            </div>

            {/* Time/Date Section */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date/Time Interval (Optional)</h4>
              <div className={styles.row} style={{ margin: 0, gap: '1rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>Last Service Date</label>
                  <input 
                    className={styles.input} 
                    name="last_service_date" 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]} 
                  />
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>Interval (months)</label>
                  <input className={styles.input} name="interval_months" type="number" min="1" placeholder="e.g. 6" />
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
              * You must configure either Odometer Interval, Date/Time Interval, or both.
            </p>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => {
              setSelectedMoto(null);
              setReminderModalOpen(false);
            }}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Create Reminder</button>
          </div>
        </form>
      </Modal>

      {/* Edit Reminder Modal */}
      <Modal 
        isOpen={!!editReminder} 
        onClose={() => {
          setSelectedMoto(null);
          setEditReminder(null);
        }} 
        title="Edit Service Reminder"
      >
        <form action={async (formData) => {
          try {
            await updateServiceReminder(formData);
            setSelectedMoto(null);
            setEditReminder(null);
          } catch (e) {
            alert(e.message);
          }
        }} className={styles.form}>
          <input type="hidden" name="id" value={editReminder?.id || ''} />
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Motorcycle</label>
            <input 
              className={styles.input} 
              type="text" 
              disabled 
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
              value={motorcycles.find(m => m.id === editReminder?.motorcycle_id)?.name || ''} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Service Type</label>
            <input 
              className={styles.input} 
              name="service_type" 
              required 
              defaultValue={editReminder?.service_type || ''} 
              placeholder="e.g. Oil Change" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
            {/* Odometer Section */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Odometer Interval (Optional)</h4>
              <div className={styles.row} style={{ margin: 0, gap: '1rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>Last Service Odometer (km)</label>
                  <input
                    className={styles.input}
                    name="last_service_odometer"
                    type="number"
                    min="0"
                    key={editReminder ? `odometer-${editReminder.id}` : 'empty-edit-reminder-odometer'}
                    defaultValue={editReminder?.last_service_odometer !== null && editReminder?.last_service_odometer !== undefined ? editReminder.last_service_odometer : ''}
                    placeholder="e.g. 10000"
                  />
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>Interval (km)</label>
                  <input 
                    className={styles.input} 
                    name="interval_km" 
                    type="number" 
                    min="1" 
                    key={editReminder ? `interval-${editReminder.id}` : 'empty-edit-reminder-interval'}
                    defaultValue={editReminder?.interval_km !== null && editReminder?.interval_km !== undefined ? editReminder.interval_km : ''}
                    placeholder="e.g. 5000" 
                  />
                </div>
              </div>
            </div>

            {/* Time/Date Section */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date/Time Interval (Optional)</h4>
              <div className={styles.row} style={{ margin: 0, gap: '1rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>Last Service Date</label>
                  <input 
                    className={styles.input} 
                    name="last_service_date" 
                    type="date" 
                    key={editReminder ? `date-${editReminder.id}` : 'empty-edit-reminder-date'}
                    defaultValue={editReminder?.last_service_date ? new Date(editReminder.last_service_date).toISOString().split('T')[0] : ''} 
                  />
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>Interval (months)</label>
                  <input 
                    className={styles.input} 
                    name="interval_months" 
                    type="number" 
                    min="1" 
                    key={editReminder ? `months-${editReminder.id}` : 'empty-edit-reminder-months'}
                    defaultValue={editReminder?.interval_months !== null && editReminder?.interval_months !== undefined ? editReminder.interval_months : ''}
                    placeholder="e.g. 6" 
                  />
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
              * You must configure either Odometer Interval, Date/Time Interval, or both.
            </p>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => {
              setSelectedMoto(null);
              setEditReminder(null);
            }}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Save Changes</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
