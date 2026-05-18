'use client';

import { useState } from 'react';
import { Plus, BellRing, Wrench } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import styles from '../garage/page.module.css'; // Reusing styles
import { addServiceRecord, addServiceReminder } from './actions';

export default function ClientService({ motorcycles, reminders, records }) {
  const [isRecordModalOpen, setRecordModalOpen] = useState(false);
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedMoto, setSelectedMoto] = useState(null);

  // Status calculation logic based on skill.md
  const getStatus = (reminder) => {
    const moto = motorcycles.find(m => m.id === reminder.motorcycle_id);
    if (!moto) return { status: 'UNKNOWN', color: 'text-secondary', remaining: 0 };

    const kmsSinceLast = moto.current_odometer - reminder.last_service_odometer;
    const remaining = reminder.interval_km - kmsSinceLast;

    if (remaining <= 0) return { status: 'OVERDUE', color: 'danger', remaining };
    if (remaining <= 500) return { status: 'DUE SOON', color: 'warning', remaining };
    return { status: 'GOOD', color: 'success', remaining };
  };

  const reminderColumns = [
    { 
      key: 'motorcycle_id', 
      label: 'Motorcycle', 
      render: (val) => motorcycles.find(m => m.id === val)?.name || 'Unknown' 
    },
    { key: 'service_type', label: 'Service Type' },
    { key: 'interval_km', label: 'Interval', render: (val) => `${val.toLocaleString()} km` },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => {
        const { status, color, remaining } = getStatus(row);
        return (
          <span style={{ color: `var(--${color})`, fontWeight: 600 }}>
            {status} ({remaining.toLocaleString()} km left)
          </span>
        );
      }
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
        onClose={() => setRecordModalOpen(false)} 
        title="Log Service Record"
      >
        <form action={async (formData) => {
          await addServiceRecord(formData);
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
              <input className={styles.input} name="odometer" type="number" required defaultValue={selectedMoto?.current_odometer || ''} />
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
            <button type="button" className={styles.secondaryButton} onClick={() => setRecordModalOpen(false)}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Save Record</button>
          </div>
        </form>
      </Modal>

      {/* Add Reminder Modal */}
      <Modal 
        isOpen={isReminderModalOpen} 
        onClose={() => setReminderModalOpen(false)} 
        title="Create Service Reminder"
      >
        <form action={async (formData) => {
          await addServiceReminder(formData);
          setReminderModalOpen(false);
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

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Last Service Odometer (km)</label>
              <input className={styles.input} name="last_service_odometer" type="number" required defaultValue={selectedMoto?.current_odometer || ''} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Interval (km)</label>
              <input className={styles.input} name="interval_km" type="number" required placeholder="e.g. 5000" />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => setReminderModalOpen(false)}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Create Reminder</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
