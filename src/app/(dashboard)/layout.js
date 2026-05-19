import Sidebar from '@/components/layout/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import styles from './layout.module.css';

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: motorcycles } = await supabase
    .from('motorcycles')
    .select('id')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .limit(1);

  if (!motorcycles || motorcycles.length === 0) {
    redirect('/onboarding');
  }

  return (
    <div className={styles.layout}>
      <Sidebar userEmail={user?.email} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
