'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import styles from '../garage/page.module.css'; // Reusing the same styles
import { addTrip, updateTrip } from './actions';

export default function ClientTrips({ initialTrips, motorcycles }) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editTrip, setEditTrip] = useState(null);
  const [selectedMoto, setSelectedMoto] = useState(null);

  // Helper to handle motorcycle selection and pre-fill previous_odometer
  const handleMotoChange = (e) => {
    const motoId = e.target.value;
    const moto = motorcycles.find(m => m.id === motoId);
    setSelectedMoto(moto);
  };

  const columns = [
    { 
      key: 'trip_date', 
      label: 'Date', 
      sortable: true,
      render: (val) => new Date(val).toLocaleDateString()
    },
    { 
      key: 'motorcycles', 
      label: 'Motorcycle', 
      sortable: false,
      render: (val) => val?.name || 'Unknown'
    },
    { key: 'category', label: 'Category', sortable: true },
    { 
      key: 'distance', 
      label: 'Distance', 
      sortable: true,
      render: (val) => `${val.toLocaleString()} km`
    },
    { 
      key: 'duration_minutes', 
      label: 'Duration', 
      sortable: true,
      render: (val) => val ? `${val} min` : '-'
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button 
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            setEditTrip(row);
          }}
        >
          Edit Details
        </button>
      )
    }
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Trip Log</h1>
          <p className={styles.pageSubtitle}>View your riding history and log new trips</p>
        </div>
        <button className={styles.primaryButton} onClick={() => setAddModalOpen(true)}>
          <Plus size={20} /> Log New Trip
        </button>
      </header>
      
      <main className={styles.main}>
        <DataTable 
          columns={columns}
          data={initialTrips}
        />
      </main>

      {/* Add Trip Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setSelectedMoto(null);
          setAddModalOpen(false);
        }} 
        title="Log New Trip"
      >
        <form action={async (formData) => {
          await addTrip(formData);
          setSelectedMoto(null);
          setAddModalOpen(false);
        }} className={styles.form}>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Motorcycle</label>
            <select className={styles.input} name="motorcycle_id" required onChange={handleMotoChange} defaultValue="">
              <option value="" disabled>Select a motorcycle</option>
              {motorcycles.map(m => (
                <option key={m.id} value={m.id}>{m.name} (Odo: {m.current_odometer})</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Trip Date</label>
              <input className={styles.input} name="trip_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select className={styles.input} name="category" required defaultValue="daily">
                <option value="daily">Daily Commute</option>
                <option value="touring">Touring</option>
                <option value="errand">Errand</option>
                <option value="track">Track Day</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Previous Odometer</label>
              <input 
                className={styles.input} 
                name="previous_odometer" 
                type="number" 
                required 
                key={selectedMoto?.id || 'empty-previous-odometer'}
                defaultValue={selectedMoto?.current_odometer || ''}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>End Odometer</label>
              <input className={styles.input} name="current_odometer" type="number" min={selectedMoto?.current_odometer || 0} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Duration (minutes)</label>
              <input className={styles.input} name="duration_minutes" type="number" placeholder="Optional" />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Notes</label>
            <textarea className={styles.input} name="notes" rows="3" placeholder="How was the ride?"></textarea>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => {
              setSelectedMoto(null);
              setAddModalOpen(false);
            }}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Save Trip</button>
          </div>
        </form>
      </Modal>

      {/* Edit Trip Details Modal */}
      <Modal 
        isOpen={!!editTrip} 
        onClose={() => setEditTrip(null)} 
        title="Edit Trip Details"
      >
        <form action={async (formData) => {
          await updateTrip(formData);
          setEditTrip(null);
        }} className={styles.form}>
          <input type="hidden" name="id" value={editTrip?.id || ''} />
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Trip Date</label>
              <input 
                className={styles.input} 
                name="trip_date" 
                type="date" 
                required 
                defaultValue={editTrip?.trip_date ? new Date(editTrip.trip_date).toISOString().split('T')[0] : ''} 
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select className={styles.input} name="category" required defaultValue={editTrip?.category || 'daily'}>
                <option value="daily">Daily Commute</option>
                <option value="touring">Touring</option>
                <option value="errand">Errand</option>
                <option value="track">Track Day</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Duration (minutes)</label>
            <input 
              className={styles.input} 
              name="duration_minutes" 
              type="number" 
              defaultValue={editTrip?.duration_minutes || ''} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Notes</label>
            <textarea 
              className={styles.input} 
              name="notes" 
              rows="3" 
              defaultValue={editTrip?.notes || ''}
            ></textarea>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => setEditTrip(null)}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Update Trip</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
