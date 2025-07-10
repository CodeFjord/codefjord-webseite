import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  Building, 
  Users,
  Filter,
  ExternalLink,
  Github,
  Loader
} from 'lucide-react';
import { portfolioApi } from '../api/cms';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load portfolio data from CMS
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioApi.getAll();
        setProjects(data);
      } catch (err) {
        setError('Fehler beim Laden der Portfolio-Projekte');
        console.error('Portfolio loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const filters = [
    { id: 'all', label: 'Alle Projekte', icon: <Filter /> },
    { id: 'web', label: 'Webentwicklung', icon: <Globe /> },
    { id: 'mobile', label: 'App-Entwicklung', icon: <Smartphone /> }
  ];

  // Helper function to categorize projects based on category field
  const getProjectCategory = (project) => {
    if (project.category) {
      return project.category;
    }
    // Fallback: categorize based on description if no category field
    const desc = project.description.toLowerCase();
    if (desc.includes('mobile') || desc.includes('app') || desc.includes('react native') || desc.includes('flutter')) {
      return 'mobile';
    }
    return 'web';
  };

  // Filter projects
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => getProjectCategory(project) === activeFilter);

  // Get featured projects (first 2 projects)
  const featuredProjects = projects.slice(0, 2);

  if (loading) {
    return (
      <div className="portfolio-page">
        <section className="hero">
          <div className="hero-content">
            <div className="loading-state">
              <Loader className="loading-spinner" />
              <p>Portfolio wird geladen...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-page">
        <section className="hero">
          <div className="hero-content">
            <div className="error-state">
              <h1>Fehler beim Laden</h1>
              <p>{error}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Unser Portfolio</h1>
          <p>
            Entdecken Sie unsere erfolgreich umgesetzten Projekte und 
            lassen Sie sich von unseren Lösungen inspirieren.
          </p>
        </motion.div>
      </section>

      {/* Filter Section */}
      <section className="section">
        <div className="section-container">
          <div className="filter-container">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>

          {/* Featured Projects */}
          {activeFilter === 'all' && featuredProjects.length > 0 && (
            <div className="featured-section">
              <h2 className="section-title">Ausgewählte Projekte</h2>
              <div className="featured-grid">
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="featured-project"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="featured-image">
                      {project.image ? (
                        <img src={`https://api.code-fjord.de/uploads/${project.image}`} alt={project.title} />
                      ) : (
                        <span className="project-emoji">💼</span>
                      )}
                    </div>
                    <div className="featured-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-category">
                        <span className="tech-tag">{project.category || 'Web'}</span>
                      </div>
                      <div className="project-links">
                        {project.link && (
                          <a href={project.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} />
                            Live Demo
                          </a>
                        )}
                        <Link to={`/portfolio/${project.id}`} className="btn btn-secondary">
                          Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="portfolio-grid">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="portfolio-item"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="portfolio-image">
                    {project.image ? (
                      <img src={`https://api.code-fjord.de/uploads/${project.image}`} alt={project.title} />
                    ) : (
                      <span className="project-emoji">💼</span>
                    )}
                  </div>
                  <div className="portfolio-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="portfolio-meta">
                      <span className="badge badge-category">{project.category || 'Web'}</span>
                      {project.status && <span className={`badge badge-status badge-status-${project.status}`}>{project.status}</span>}
                      {project.featured && <span className="badge badge-featured">Featured</span>}
                      {project.published === false ? <span className="badge badge-unpublished">Unveröffentlicht</span> : <span className="badge badge-published">Veröffentlicht</span>}
                      {project.client && <span className="badge badge-client">{project.client}</span>}
                    </div>
                    {project.technologies && (
                      <div className="portfolio-tags">
                        {(project.technologies || '').split(',').map((tech, idx) => (
                          <span key={idx} className="tag">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div className="project-links">
                      {project.link && (
                        <a href={project.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} />
                          Demo
                        </a>
                      )}
                      <Link to={`/portfolio/${project.id}`} className="btn btn-secondary">
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Keine Projekte gefunden</h3>
              <p>Für den ausgewählten Filter wurden keine Projekte gefunden.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Bereit für Ihr nächstes Projekt?</h2>
          <p>Lassen Sie uns gemeinsam Ihre Ideen in die Realität umsetzen.</p>
          <a href="/contact" className="btn btn-primary">
            Projekt starten
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Portfolio; 