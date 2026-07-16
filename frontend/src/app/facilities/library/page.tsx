import { Breadcrumb } from '@/components/ui';
import styles from '../../about/about.module.css';

export const metadata = {
  title: 'Library & Learning Centre | Akal Business School',
  description: 'Learn about the Akal University Library and Learning Centre, featuring RFID automation, Koha LMS, and digital resources.',
};

export default function LibraryPage() {
  const sections = [
    {
      title: 'RFID Automation',
      desc: 'Our library automation and security system is based on Koha Library Management Software integrated with RFID technology. This ensures smooth check-ins, check-outs, and robust inventory security.'
    },
    {
      title: 'Online Public Access Catalog (OPAC)',
      desc: 'OPAC provides students and faculty with the facility of searching, browsing, and reserving physical materials available at the library. Users can log in, check their issued book status, submit book suggestions, verify fines, and create custom reading lists.'
    },
    {
      title: 'Four Key Sections',
      desc: 'The entire library is divided into four dedicated spaces to streamline learning: (a) Stack Area, (b) Circulation Section, (c) Reference and Periodical Section, and (d) Reading Room and ICT Lab.'
    },
    {
      title: 'Sitting Capacity',
      desc: 'To support a focused and distraction-free environment, the library features two separate reading rooms for boys and girls. The total sitting capacity is 80 at a time, including the ICT Lab and Reference Section.'
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
              { label: 'Library', href: '/facilities/library' },
            ]}
          />
          <h1 className={styles.heroTitle}>Library &amp; Learning Centre</h1>
          <p className={styles.heroSubtitle}>
            A modern, digitalized hub designed to cater to the academic and research needs of students and faculty.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.splitGrid}>
            <div className={styles.storyContent}>
              <h2>Overview of Learning Centre</h2>
              <p>
                The library at Akal University has a well-stocked Library &amp; Learning Centre with silent study spaces; video viewing facilities; newspapers, magazines, and periodicals; and computers (all with Internet access, USB ports, and print facilities). The Central Library caters to the information needs of the institute&apos;s faculty, students, staff, research institutions, and industries.
              </p>
              <p>
                Priority is given to keeping library collections up-to-date, with an emphasis on main texts for undergraduate and taught postgraduate courses. Through our digital library systems, students can access a wide range of databases, digital thesis, and research papers from anywhere on campus.
              </p>

              <h3 style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)', color: '#1A1A2E' }}>E-Resources &amp; Useful Links</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--space-6)', color: '#555B6E' }}>
                <li style={{ marginBottom: 'var(--space-2)' }}>
                  <strong>NPTEL:</strong> Access to the National Programme on Technology Enhanced Learning lectures and video courses.
                </li>
                <li style={{ marginBottom: 'var(--space-2)' }}>
                  <strong>MOOCs:</strong> Access to Massive Open Online Courses platforms for curriculum enrichment.
                </li>
              </ul>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              justifyContent: 'center'
            }}>
              {sections.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#F8F9FA',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-5)',
                    borderLeft: '4px solid var(--color-gold)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <h4 style={{
                    fontWeight: 'bold',
                    fontSize: 'var(--text-sm)',
                    color: '#1A1A2E',
                    marginBottom: 'var(--space-1)'
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
