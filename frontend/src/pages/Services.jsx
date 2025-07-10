import { motion } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Palette, 
  Zap, 
  Database,
  Shield,
  Search,
  Cloud,
  Users,
  Settings,
  Monitor,
  Globe
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Code />,
      title: 'Webentwicklung',
      description: 'Moderne, responsive Webanwendungen mit den neuesten Technologien.',
      features: [
        'React & Next.js Anwendungen',
        'Progressive Web Apps (PWA)',
        'Content Management Systeme',
        'API-Entwicklung',
        'Performance Optimierung'
      ],
      technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB']
    },
    {
      icon: <Smartphone />,
      title: 'App-Entwicklung',
      description: 'Native und Cross-Platform Mobile-Apps für iOS und Android.',
      features: [
        'React Native Apps',
        'Flutter Anwendungen',
        'Native iOS/Android Apps',
        'App Store Optimierung',
        'Push-Benachrichtigungen',
        'Offline-Funktionalität'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin']
    },
    {
      icon: <Palette />,
      title: 'UI/UX Design',
      description: 'Benutzerfreundliche und ansprechende Designs, die Ihre Marke zum Leben erwecken.',
      features: [
        'User Interface Design',
        'User Experience Design',
        'Prototyping & Wireframing',
        'Design Systems',
        'Brand Identity Design',
        'Usability Testing'
      ],
      technologies: ['Figma', 'Adobe XD']
    },
    {
      icon: <Database />,
      title: 'Backend-Entwicklung',
      description: 'Robuste und skalierbare Backend-Systeme für Ihre Anwendungen.',
      features: [
        'RESTful APIs',
        'GraphQL APIs',
        'Microservices Architektur',
        'Datenbankdesign',
        'Authentication & Authorization',
        'Cloud Deployment'
      ],
      technologies: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB']
    },
    {
      icon: <Search />,
      title: 'SEO & Marketing',
      description: 'Optimierung Ihrer Webseite für Suchmaschinen und digitale Marketing-Strategien.',
      features: [
        'SEO-Optimierung',
        'Content Marketing',
        'Social Media Marketing',
        'Google Ads Management',
        'Analytics & Reporting',
        'Conversion Optimierung'
      ],
      technologies: ['Google Analytics', 'Google Ads', 'Facebook Ads', 'SEMrush', 'Ahrefs']
    },
    {
      icon: <Shield />,
      title: 'Sicherheit & Compliance',
      description: 'Umfassende Sicherheitslösungen und Compliance-Beratung.',
      features: [
        'Sicherheitsaudits',
        'DSGVO-Compliance',
        'Penetration Testing',
        'Verschlüsselung',
        'Backup-Strategien',
        'Sicherheitsschulungen'
      ],
      technologies: ['SSL/TLS', 'OAuth 2.0', 'JWT', 'HTTPS', 'GDPR Tools']
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Analyse & Planung',
      description: 'Wir analysieren Ihre Anforderungen und erstellen einen detaillierten Projektplan.'
    },
    {
      number: '02',
      title: 'Design & Konzeption',
      description: 'Unsere Designer erstellen Wireframes und Mockups für Ihre Zustimmung.'
    },
    {
      number: '03',
      title: 'Entwicklung',
      description: 'Unser Entwicklungsteam implementiert Ihre Lösung mit modernsten Technologien.'
    },
    {
      number: '04',
      title: 'Testing & Qualitätssicherung',
      description: 'Umfassende Tests stellen sicher, dass alles einwandfrei funktioniert.'
    },
    {
      number: '05',
      title: 'Deployment & Launch',
      description: 'Ihre Anwendung wird sicher deployed und ist live verfügbar.'
    },
    {
      number: '06',
      title: 'Support & Wartung',
      description: 'Wir bieten kontinuierlichen Support und regelmäßige Updates.'
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Unsere Services</h1>
          <p>
            Von der ersten Idee bis zur erfolgreichen Implementierung - 
            wir bieten umfassende Lösungen für Ihre digitalen Herausforderungen.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Was wir anbieten</h2>
            <p className="section-subtitle">
              Entdecken Sie unsere umfassende Palette an digitalen Dienstleistungen, 
              die Ihr Unternehmen voranbringen.
            </p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                
                <div className="service-features">
                  <h4>Leistungen:</h4>
                  <ul>
                    {service.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="service-technologies">
                  <h4>Technologien:</h4>
                  <div className="tech-tags">
                    {service.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Unser Entwicklungsprozess</h2>
            <p className="section-subtitle">
              Ein strukturierter Ansatz für erfolgreiche Projekte und zufriedene Kunden.
            </p>
          </div>
          
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="process-step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Technologien & Tools</h2>
            <p className="section-subtitle">
              Wir arbeiten mit den modernsten Technologien und bewährten Tools.
            </p>
          </div>
          
          <div className="technologies-grid">
            <motion.div
              className="tech-category"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>Frontend</h3>
              <div className="tech-list">
                <span className="tech-item">React</span>
                <span className="tech-item">Next.js</span>
                <span className="tech-item">TypeScript</span>
                <span className="tech-item">Vue.js</span>
                <span className="tech-item">Angular</span>
                <span className="tech-item">Tailwind CSS</span>
              </div>
            </motion.div>
            
            <motion.div
              className="tech-category"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3>Backend</h3>
              <div className="tech-list">
                <span className="tech-item">Node.js</span>
                <span className="tech-item">Python</span>
                <span className="tech-item">Java</span>
                <span className="tech-item">PHP</span>
                <span className="tech-item">Go</span>
                <span className="tech-item">C#</span>
              </div>
            </motion.div>
            
            <motion.div
              className="tech-category"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>Mobile</h3>
              <div className="tech-list">
                <span className="tech-item">React Native</span>
                <span className="tech-item">Flutter</span>
                <span className="tech-item">Swift</span>
                <span className="tech-item">Kotlin</span>
              </div>
            </motion.div>
            
            <motion.div
              className="tech-category"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3>Datenbanken</h3>
              <div className="tech-list">
                <span className="tech-item">PostgreSQL</span>
                <span className="tech-item">MongoDB</span>
                <span className="tech-item">MySQL</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <div className="section-container">
          <div className="cta-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title" style={{ color: 'white' }}>
                Bereit für Ihr Projekt?
              </h2>
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Lassen Sie uns gemeinsam Ihre Vision verwirklichen. 
                Kontaktieren Sie uns für eine kostenlose Beratung.
              </p>
              <a href="/contact" className="btn btn-primary">
                Jetzt beraten lassen
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 