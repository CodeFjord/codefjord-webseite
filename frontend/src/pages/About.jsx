import { motion } from 'framer-motion';
import { HeartHandshake, Lightbulb, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { teamMembersApi } from '../api/cms';

const values = [
  {
    icon: <HeartHandshake size={32} />, title: 'Partnerschaft',
    text: 'Wir arbeiten eng mit unseren Kunden zusammen und setzen auf langfristige Beziehungen.'
  },
  {
    icon: <Lightbulb size={32} />, title: 'Innovation',
    text: 'Wir lieben neue Technologien und entwickeln kreative, zukunftssichere Lösungen.'
  },
  {
    icon: <ShieldCheck size={32} />, title: 'Verlässlichkeit',
    text: 'Transparenz, Sicherheit und Qualität stehen bei uns an erster Stelle.'
  }
];

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const members = await teamMembersApi.getAll();
        setTeamMembers(members);
      } catch (error) {
        console.error('Fehler beim Laden der Team-Mitglieder:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Über CodeFjord</h1>
          <p>
            Wir sind ein leidenschaftliches Team aus Entwicklern, das Unternehmen digital nach vorne bringt.
          </p>
        </motion.div>
      </section>

      {/* Firmenprofil */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Unsere Mission</h2>
            <p className="section-subtitle">
              Wir entwickeln digitale Produkte, die begeistern und echten Mehrwert schaffen – von der Idee bis zum Launch und darüber hinaus.
            </p>
          </div>
          <div className="about-content">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p>
                CodeFjord steht für innovative Softwareentwicklung, agile Prozesse und partnerschaftliche Zusammenarbeit. Unser Team vereint langjährige Erfahrung mit frischem Denken und setzt auf modernste Technologien, um individuelle Lösungen für unsere Kunden zu schaffen.
              </p>
              <ul className="about-values">
                {values.map((value, idx) => (
                  <li key={idx} className="about-value">
                    {value.icon}
                    <div>
                      <strong>{value.title}</strong>
                      <p>{value.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Unser Team</h2>
            <p className="section-subtitle">
              Ein interdisziplinäres Team mit Leidenschaft für Technologie und Design.
            </p>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Lade Team-Mitglieder...</p>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="team-grid">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.id}
                  className="team-member"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="team-avatar">
                    {member.imageUrl ? (
                      <img 
                        src={member.imageUrl} 
                        alt={member.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      member.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    )}
                  </div>
                  <h3>{member.name}</h3>
                  <p style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{member.role}</p>
                  {member.bio && <p>{member.bio}</p>}
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Keine Team-Mitglieder verfügbar.</p>
            </div>
          )}
        </div>
      </section>

      {/* Werte Section */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Was uns auszeichnet</h2>
            <p className="section-subtitle">
              Unsere Werte und unser Anspruch an Qualität machen uns zum idealen Partner für Ihr Projekt.
            </p>
          </div>
          <div className="about-values-grid">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                className="about-value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="about-value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 