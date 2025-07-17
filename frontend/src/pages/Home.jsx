import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Palette, 
  Zap, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const services = [
    {
      icon: <Code />,
      title: 'Webentwicklung',
      description: 'Moderne, responsive Webanwendungen mit React, Node.js und modernen Technologien.'
    },
    {
      icon: <Smartphone />,
      title: 'App-Entwicklung',
      description: 'Native und Cross-Platform Apps für iOS und Android mit React Native und Flutter.'
    },
    {
      icon: <Palette />,
      title: 'UI/UX Design',
      description: 'Benutzerfreundliche und ansprechende Designs, die Ihre Marke zum Leben erwecken.'
    },
    {
      icon: <Zap />,
      title: 'Performance Optimierung',
      description: 'Schnelle, effiziente Anwendungen mit modernsten Optimierungstechniken.'
    }
  ];

  const features = [
    'Moderne Technologien (React, Node.js, TypeScript)',
    'Responsive Design für alle Geräte',
    'SEO-optimierte Webseiten',
    'Sichere und skalierbare Lösungen',
    '24/7 Support und Wartung',
    'Agile Entwicklungsmethoden'
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Ihre digitale Zukunft beginnt hier</h1>
          <p>
            CodeFjord entwickelt innovative Web- und Mobile-Anwendungen, 
            die Ihr Unternehmen in die digitale Zukunft führen.
          </p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">
              Projekt starten
            </Link>
            <Link to="/portfolio" className="btn btn-secondary">
              Portfolio ansehen
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Unsere Services</h2>
            <p className="section-subtitle">
              Von der Konzeption bis zur Implementierung - wir begleiten Sie durch 
              den gesamten Entwicklungsprozess.
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="section-container">
          {/*
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="section-container">
          <div className="features-content">
            <motion.div
              className="features-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Warum CodeFjord?</h2>
              <p className="section-subtitle">
                Wir kombinieren technische Expertise mit kreativem Design, 
                um Lösungen zu schaffen, die Ihr Unternehmen voranbringen.
              </p>
              <ul className="features-list-modern">
                {features.map((feature, index) => (
                  <li key={index} className="feature-item-modern">
                    <span className="feature-icon-modern">
                      <CheckCircle size={20} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/services" className="btn btn-primary">
                Alle Services ansehen
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              className="features-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="code-preview">
                <div className="code-header">
                  <div className="code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>app.jsx</span>
                </div>
                <div className="code-content">
                  <pre>
{`import React from 'react';

const App = () => {
  return (
    <div className="app">
      <h1>Willkommen bei CodeFjord</h1>
      <p>Ihre digitale Zukunft beginnt hier</p>
    </div>
  );
};

export default App;`}
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>
            Bereit für Ihr nächstes Projekt?
          </h2>
          <p>
            Lassen Sie uns gemeinsam Ihre Vision in die digitale Realität umsetzen.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Kostenlose Beratung
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home; 