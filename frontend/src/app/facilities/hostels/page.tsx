import { Breadcrumb } from '@/components/ui';
import styles from '../../about/about.module.css';

export const metadata = {
  title: 'Hostels & Residential Life | Akal Business School',
  description: 'Explore the hostels at Akal University, providing secure, drug-free residential services with nutritious vegetarian meals and study rooms.',
};

export default function HostelsPage() {
  const features = [
    {
      title: 'Hostel Mess & Wholesome Meals',
      desc: 'For healthy nutrition, the hostel mess and canteen are designed to serve clean, healthy, and wholesome 100% vegetarian food, ensuring a well-balanced diet for all students.',
      icon: '🍽️'
    },
    {
      title: 'Air-conditioned Reading Rooms',
      desc: 'To facilitate extensive study sessions and exam preparation, fully air-conditioned reading rooms are available within the residential blocks.',
      icon: '📖'
    },
    {
      title: 'Recreation & Gymnasiums',
      desc: 'Students can unwind in the indoor gaming hall or exercise at the well-equipped outdoor gymnasium located in the campus playground.',
      icon: '🏋️'
    },
    {
      title: 'Darbar Sahib & Prayer Room',
      desc: 'For creating a peaceful, spiritual environment, a prayer room and Darbar Sahib are situated in the hostel premises, making the surroundings serene and poised.',
      icon: '🕊️'
    }
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Facilities', href: '/facilities' },
              { label: 'Hostels', href: '/facilities/hostels' },
            ]}
          />
          <h1 className={styles.heroTitle}>Residential Hostels</h1>
          <p className={styles.heroSubtitle}>
            A safe, secure, and drug-free home away from home, nurturing both academic focus and spiritual growth.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.splitGrid}>
            <div className={styles.storyContent}>
              <h2>Homely &amp; Secure Environment</h2>
              <p>
                Akal University provides separate hostel facilities for both girls and boys. These fully furnished hostels provide a safe, disciplined, and homely environment to the students, allowing them to fully focus on their academic pursuits without any external distractions.
              </p>
              <p>
                Under the strict guidance of caring wardens, the hostels are managed to remain entirely free from drug abuse, substance use, or negative influences. The security team works round-the-clock, backed by comprehensive CCTV coverage, ensuring absolute safety, especially for girl students.
              </p>
              <p>
                Nutritious, pure vegetarian food is served at very nominal charges, maintaining high standards of hygiene and health.
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-4)'
            }}>
              {features.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-5)',
                    border: '1px solid #ECECEC',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>
                    {item.icon}
                  </div>
                  <h4 style={{
                    fontWeight: 'bold',
                    fontSize: 'var(--text-sm)',
                    color: '#1A1A2E',
                    marginBottom: 'var(--space-2)'
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: 'var(--text-xs)',
                    color: '#555B6E',
                    lineHeight: '1.5'
                  }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
