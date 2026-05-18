'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import styles from './page.module.css';
import { addMotorcycle, updateOdometer } from './actions';

export default function ClientGarage({ initialMotorcycles }) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editMoto, setEditMoto] = useState(null);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'plate_number', label: 'Plate', sortable: false },
    { 
      key: 'current_odometer', 
      label: 'Odometer', 
      render: (val) => `${val.toLocaleString()} km` 
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button 
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            setEditMoto(row);
          }}
        >
          Update Odo
        </button>
      )
    }
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Garage</h1>
          <p className={styles.pageSubtitle}>Manage your motorcycles and update odometers</p>
        </div>
        <button className={styles.primaryButton} onClick={() => setAddModalOpen(true)}>
          <Plus size={20} /> Add Motorcycle
        </button>
      </header>
      
      <main className={styles.main}>
        <DataTable 
          columns={columns}
          data={initialMotorcycles}
        />
      </main>

      {/* Add Motorcycle Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        title="Add Motorcycle"
      >
        <form action={async (formData) => {
          await addMotorcycle(formData);
          setAddModalOpen(false);
        }} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nickname</label>
            <input className={styles.input} name="name" required placeholder="e.g. Daily Commuter" />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Brand</label>
              <input className={styles.input} name="brand" required placeholder="Honda" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Model</label>
              <input className={styles.input} name="model" required placeholder="CBR500R" />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Year</label>
              <input className={styles.input} name="year" type="number" required placeholder="2022" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Plate Number</label>
              <input className={styles.input} name="plate_number" required placeholder="ABC-123" />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Current Odometer (km)</label>
            <input className={styles.input} name="current_odometer" type="number" required placeholder="12500" />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => setAddModalOpen(false)}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Save Motorcycle</button>
          </div>
        </form>
      </Modal>

      {/* Edit Odometer Modal */}
      <Modal 
        isOpen={!!editMoto} 
        onClose={() => setEditMoto(null)} 
        title="Update Odometer"
      >
        <form action={async (formData) => {
          await updateOdometer(formData);
          setEditMoto(null);
        }} className={styles.form}>
          <input type="hidden" name="id" value={editMoto?.id || ''} />
          <p className={styles.label} style={{ marginBottom: '-0.5rem' }}>
            Updating for: <strong style={{color: 'var(--foreground)'}}>{editMoto?.name} ({editMoto?.plate_number})</strong>
          </p>
          <div className={styles.inputGroup}>
            <label className={styles.label}>New Odometer (km)</label>
            <input 
              className={styles.input} 
              name="current_odometer" 
              type="number" 
              required 
              defaultValue={editMoto?.current_odometer}
              min={editMoto?.current_odometer}
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => setEditMoto(null)}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>Update</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
