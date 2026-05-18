'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bike, Map, Wrench, Settings, LogOut, Menu, X, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import styles from './Sidebar.module.css';
import { signOut } from '@/app/login/actions';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Garage', path: '/garage', icon: Bike },
  { name: 'Trips', path: '/trips', icon: Map },
  { name: 'Service', path: '/service', icon: Wrench },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ userEmail }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <button className={styles.mobileToggle} onClick={toggleMobile}>
        <Menu size={24} />
      </button>

      {mobileOpen && <div className={styles.overlay} onClick={toggleMobile}></div>}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Bike size={28} className={styles.logoIcon} />
            <h2>MotoTracker</h2>
          </div>
          <button className={styles.closeBtn} onClick={toggleMobile}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={20} className={styles.navIcon} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.footer}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>{userEmail?.charAt(0).toUpperCase()}</div>
            <div className={styles.userInfo}>
              <span className={styles.email}>{userEmail}</span>
            </div>
          </div>
          <form action={signOut}>
            <button className={styles.logoutBtn}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
