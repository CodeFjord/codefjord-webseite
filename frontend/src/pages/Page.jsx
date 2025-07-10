import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pagesApi } from '../api/cms';

const Page = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug;
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError('');
        
        const pageData = await pagesApi.getBySlug(slug);
        if (pageData) {
          setPage(pageData);
        } else {
          setError('Seite nicht gefunden');
        }
      } catch (err) {
        console.error('Error loading page:', err);
        setError('Fehler beim Laden der Seite');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPage();
    }
  }, [slug]);

  // Markdown zu HTML konvertieren (einfache Implementierung)
  const markdownToHtml = (markdown) => {
    if (!markdown) return '';
    
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner">Lade...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <h1>Seite nicht gefunden</h1>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Zur Startseite
        </button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="page-not-found">
        <h1>Seite nicht gefunden</h1>
        <p>Die angeforderte Seite konnte nicht geladen werden.</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Zur Startseite
        </button>
      </div>
    );
  }

  return (
    <div className="dynamic-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>{page.title}</h1>
          {page.metaDescription && (
            <p>{page.metaDescription}</p>
          )}
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="section-container">
          <motion.div
            className="page-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div 
              className="content-html"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(page.content) }}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Page; 