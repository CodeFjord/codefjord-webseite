import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag, ArrowLeft, Loader, Share2 } from 'lucide-react';
import { blogApi } from '../api/cms';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load single blog post from CMS
  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getBySlug(slug);
        setPost(data);
      } catch (err) {
        setError('Blog-Artikel nicht gefunden');
        console.error('Blog post loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlogPost();
    }
  }, [slug]);

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

  // Share function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link in die Zwischenablage kopiert!');
    }
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <section className="hero">
          <div className="hero-content">
            <div className="loading-state">
              <Loader className="loading-spinner" />
              <p>Blog-Artikel wird geladen...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail-page">
        <section className="hero">
          <div className="hero-content">
            <div className="error-state">
              <h1>Artikel nicht gefunden</h1>
              <p>{error || 'Der gesuchte Blog-Artikel existiert nicht.'}</p>
              <Link to="/blog" className="btn btn-primary">
                <ArrowLeft size={16} />
                Zurück zum Blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/blog" className="back-link">
            <ArrowLeft size={16} />
            Zurück zum Blog
          </Link>
          
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

          <h1 className="blog-title">{post.title}</h1>
          
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

          <button onClick={handleShare} className="share-button">
            <Share2 size={16} />
            Teilen
          </button>
        </motion.div>
      </section>

      {/* Blog Content */}
      <section className="section">
        <div className="section-container">
          <motion.article
            className="blog-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div 
              className="content-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.article>
        </div>
      </section>

      {/* Related Posts CTA */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Weitere Artikel entdecken</h2>
          <p>Schauen Sie sich unsere anderen Blog-Artikel an.</p>
          <Link to="/blog" className="btn btn-primary">
            Alle Artikel anzeigen
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default BlogDetail; 