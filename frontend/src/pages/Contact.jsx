import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { contactApi } from '../api/cms';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const result = await contactApi.submit(form);
      
      if (result.success) {
        setSuccess(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(result.error || 'Fehler beim Senden der Nachricht');
      }
    } catch (err) {
      setError('Fehler beim Senden der Nachricht');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Kontakt</h1>
          <p>
            Sie haben ein Projekt oder eine Frage? Schreiben Sie uns – wir melden uns schnellstmöglich zurück!
          </p>
        </motion.div>
      </section>

      {/* Kontaktformular & Infos */}
      <section className="section">
        <div className="section-container">
          <div className="contact-form-wrapper">
            <motion.form
              className="contact-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Schreiben Sie uns</h2>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Ihr Name"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Ihre E-Mail-Adresse"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Betreff</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="Betreff Ihrer Nachricht"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Nachricht</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Ihre Nachricht..."
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading || submitted}>
                <Send size={18} />
                {loading ? 'Wird gesendet...' : submitted ? 'Nachricht gesendet!' : 'Absenden'}
              </button>
              {success && <p style={{ color: 'green', marginTop: '1rem' }}>Nachricht erfolgreich versendet!</p>}
              {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            </motion.form>

            <motion.div
              className="contact-info-box"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3>Kontaktinformationen</h3>
              <p><Mail size={16} /> info@code-fjord.de</p>
              <p><Phone size={16} /> +49 174 786 1457</p>
              <p><MapPin size={16} /> Flensburg, Deutschland</p>
              <div className="map-embed" style={{ marginTop: '2rem' }}>
                <iframe
                  title="Standort CodeFjord Flensburg"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=9.33237%2C54.75019%2C9.53184%2C54.83866&amp;layer=mapnik"
                  style={{ width: '100%', height: '200px', border: 0, borderRadius: '0.5rem' }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 