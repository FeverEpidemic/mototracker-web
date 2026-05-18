import Link from 'next/link';
import { Bike, ShieldCheck, Zap, BarChart3, ChevronRight, Activity, Wrench, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export const metadata = {
  title: 'MotoTracker | Your Ultimate Garage Companion',
  description: 'Track odometers, log trips, and manage service maintenance for all your motorcycles from one powerful dashboard.',
};

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Dynamic Animated Background Gradients */}
      <div className={styles.bgGlow1}></div>
      <div className={styles.bgGlow2}></div>

      {/* Navigation */}
      <nav className={`${styles.nav} ${styles.fadeIn}`}>
        <div className={styles.logo}>
          <div className={styles.logoIconWrapper}>
            <Bike size={24} className={styles.logoIcon} />
          </div>
          <h2>MotoTracker</h2>
        </div>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.loginBtn}>
            Sign In
          </Link>
          <Link href="/login" className={styles.signupBtn}>
            Get Started
          </Link>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={`${styles.badge} ${styles.fadeInUp}`} style={{ animationDelay: '0.1s' }}>
              <span className={styles.badgePulse}></span>
              MotoTracker Web v2.0 is Live
            </div>
            
            <h1 className={`${styles.title} ${styles.fadeInUp}`} style={{ animationDelay: '0.2s' }}>
              The Ultimate Command Center <br />
              <span className={styles.highlight}>For Your Garage.</span>
            </h1>
            
            <p className={`${styles.subtitle} ${styles.fadeInUp}`} style={{ animationDelay: '0.3s' }}>
              Seamlessly track odometers, log your favorite trips, and never miss a service interval again. Engineered exclusively for riders who demand precision.
            </p>
            
            <div className={`${styles.ctaWrapper} ${styles.fadeInUp}`} style={{ animationDelay: '0.4s' }}>
              <Link href="/login" className={styles.primaryCta}>
                Enter Garage <ArrowRight size={20} className={styles.ctaArrow} />
              </Link>
              <a href="#features" className={styles.secondaryCta}>
                Explore Features
              </a>
            </div>
          </div>

          {/* Abstract Dashboard UI Preview */}
          <div className={`${styles.heroPreview} ${styles.fadeInUp}`} style={{ animationDelay: '0.6s' }}>
            <div className={styles.glassCard}>
              <div className={styles.glassHeader}>
                <div className={styles.dots}>
                  <span></span><span></span><span></span>
                </div>
                <div className={styles.glassTitle}>Dashboard Overview</div>
              </div>
              <div className={styles.glassBody}>
                <div className={styles.mockWidget}>
                  <Activity size={20} color="var(--primary)" />
                  <div>
                    <h4>Total Distance</h4>
                    <p>12,450 km</p>
                  </div>
                </div>
                <div className={styles.mockWidget}>
                  <Wrench size={20} color="var(--warning)" />
                  <div>
                    <h4>Active Alerts</h4>
                    <p style={{ color: 'var(--warning)' }}>1 Due Soon</p>
                  </div>
                </div>
                <div className={styles.mockWidget}>
                  <BarChart3 size={20} color="var(--secondary)" />
                  <div>
                    <h4>Recent Trips</h4>
                    <p>5 this week</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements behind the card */}
            <div className={styles.floatingElement1}></div>
            <div className={styles.floatingElement2}></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.features}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Precision Tools for Riders</h2>
            <p className={styles.sectionSubtitle}>Everything you need to maintain peak performance.</p>
          </div>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconGlow}>
                <BarChart3 size={28} className={styles.featureIcon} />
              </div>
              <h3>Precision Tracking</h3>
              <p>Keep exact logs of your current odometer readings. Every trip and service record synchronizes automatically with your cloud garage.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconGlow}>
                <Zap size={28} className={styles.featureIcon} />
              </div>
              <h3>Optimized for Speed</h3>
              <p>Built with Next.js and Supabase for instantaneous optimistic UI updates. Fast, reliable, and perfectly synced across all your devices.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconGlow}>
                <ShieldCheck size={28} className={styles.featureIcon} />
              </div>
              <h3>Service Intelligence</h3>
              <p>Dynamic algorithms calculate exactly when your next maintenance is due, ensuring your bike stays in peak condition on every ride.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.logo}>
            <Bike size={20} className={styles.logoIcon} />
            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>MotoTracker</span>
          </div>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} MotoTracker Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
