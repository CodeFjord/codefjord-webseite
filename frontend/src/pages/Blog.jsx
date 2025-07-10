import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag, ArrowRight, Loader } from 'lucide-react';
import { blogApi } from '../api/cms';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load blog posts from CMS
  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getAll();
        setPosts(data);
      } catch (err) {
        setError('Fehler beim Laden der Blog-Artikel');
        console.error('Blog loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to estimate reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 250;
    const words = content ? content.split(' ').length : 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="blog-page">
        <section className="hero">
          <div className="hero-content">
            <div className="loading-state">
              <Loader className="loading-spinner" />
              <p>Blog wird geladen...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-page">
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
    <div className="blog-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Blog</h1>
          <p>
            Insights, Tutorials und News aus der Welt der Webentwicklung und Technologie.
          </p>
        </motion.div>
      </section>

      {/* Blog Posts */}
      <section className="section">
        <div className="section-container">
          {posts.length > 0 ? (
            <div className="blog-grid">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="blog-card-content">
                    <div className="blog-meta">
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={16} />
                        <span>{getReadingTime(post.content)} Min. Lesezeit</span>
                      </div>
                      <div className="meta-item">
                        <User size={16} />
                        <span>CodeFjord Team</span>
                      </div>
                    </div>

                    <h2 className="blog-title">{post.title}</h2>
                    
                    {post.excerpt && (
                      <p className="blog-excerpt">{post.excerpt}</p>
                    )}

                    {post.tags && (
                      <div className="blog-tags">
                        <Tag size={14} />
                        <div className="tags-list">
                          {post.tags.split(',').map((tag, idx) => (
                            <span key={idx} className="tag">{tag.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <a href={`/blog/${post.slug}`} className="read-more">
                      Weiterlesen
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Noch keine Blog-Artikel</h3>
              <p>Schauen Sie bald wieder vorbei für neue Inhalte!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Bleiben Sie auf dem Laufenden</h2>
          <p>Verpassen Sie keine neuen Artikel und Tutorials.</p>
          <a href="/contact" className="btn btn-primary">
            Kontakt aufnehmen
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Blog; 