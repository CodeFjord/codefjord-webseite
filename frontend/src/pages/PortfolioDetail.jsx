import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  User, 
  Tag, 
  Loader,
  Globe,
  Smartphone,
  Code,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { portfolioApi } from '../api/cms';

const PortfolioDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load portfolio project from CMS
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const data = await portfolioApi.getById(slug);
        setProject(data);
      } catch (err) {
        setError('Projekt nicht gefunden');
        console.error('Portfolio project loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProject();
    }
  }, [slug]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Get status icon and label
  const getStatusInfo = (status) => {
    switch (status) {
      case 'live':
        return { icon: <CheckCircle size={16} />, label: 'Live', color: 'text-green-600' };
      case 'demo':
        return { icon: <Zap size={16} />, label: 'Demo', color: 'text-orange-600' };
      case 'development':
        return { icon: <Clock size={16} />, label: 'In Entwicklung', color: 'text-blue-600' };
      default:
        return { icon: <Code size={16} />, label: 'Projekt', color: 'text-gray-600' };
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'mobile':
        return <Smartphone size={16} />;
      case 'web':
      default:
        return <Globe size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="portfolio-detail-page">
        <section className="hero">
          <div className="hero-content">
            <div className="loading-state">
              <Loader className="loading-spinner" />
              <p>Projekt wird geladen...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="portfolio-detail-page">
        <section className="hero">
          <div className="hero-content">
            <div className="error-state">
              <h1>Projekt nicht gefunden</h1>
              <p>{error || 'Das gesuchte Projekt existiert nicht.'}</p>
              <Link to="/portfolio" className="btn btn-primary">
                <ArrowLeft size={16} />
                Zurück zum Portfolio
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const statusInfo = getStatusInfo(project.status);

  return (
    <div className="portfolio-detail-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/portfolio" className="back-link">
            <ArrowLeft size={16} />
            Zurück zum Portfolio
          </Link>
          <div className="project-meta">
            <div className="meta-item">{getCategoryIcon(project.category)}<span className="capitalize">{project.category || 'Web'}</span></div>
            <div className={`meta-item ${statusInfo.color}`}>{statusInfo.icon}<span>{statusInfo.label}</span></div>
            {project.featured && <span className="badge badge-featured">Featured</span>}
            {project.published === false ? <span className="badge badge-unpublished">Unveröffentlicht</span> : <span className="badge badge-published">Veröffentlicht</span>}
            {project.client && (<div className="meta-item"><User size={16} /><span>{project.client}</span></div>)}
            {project.completionDate && (<div className="meta-item"><Calendar size={16} /><span>{formatDate(project.completionDate)}</span></div>)}
            {project.slug && (<div className="meta-item"><Tag size={16} /><span>Slug: {project.slug}</span></div>)}
          </div>
          <h1 className="project-title">{project.title}</h1>
          <p className="project-excerpt">{project.description}</p>
          {project.technologies && (
            <div className="project-tags">
              <Tag size={14} />
              <div className="tags-list">
                {(project.technologies || '').split(',').map((tech, idx) => (
                  <span key={idx} className="tag">{tech.trim()}</span>
                ))}
              </div>
            </div>
          )}
          <div className="project-links">
            {project.url && (
              <a href={project.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                <Github size={16} />
                GitHub
              </a>
            )}
          </div>
        </motion.div>
      </section>
      {/* Project Content */}
      {project.content && (
        <section className="section">
          <div className="section-container">
            <motion.article
              className="project-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div 
                className="content-body"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </motion.article>
          </div>
        </section>
      )}
      {/* Project Image */}
      {project.image && (
        <section className="section">
          <div className="section-container">
            <motion.div
              className="project-image-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src={`https://api.code-fjord.de/uploads/${project.image}`} 
                alt={project.title}
                className="project-image-full"
              />
            </motion.div>
          </div>
        </section>
      )}
      {/* Related Projects CTA */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Weitere Projekte entdecken</h2>
          <p>Schauen Sie sich unsere anderen Arbeiten an.</p>
          <Link to="/portfolio" className="btn btn-primary">
            Alle Projekte anzeigen
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default PortfolioDetail; 