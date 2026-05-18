import Sidebar from '@/components/layout/Sidebar';
import { createClient } from '@/utils/supabase/server';
import styles from './layout.module.css';

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={styles.layout}>
      <Sidebar userEmail={user?.email} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
