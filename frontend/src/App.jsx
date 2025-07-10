import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import PortfolioDetail from './pages/PortfolioDetail';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Page from './pages/Page';
import './App.css';
import logo from './assets/images/codefjord-white.png';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuliere Ladezeit für bessere UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <img src={logo} alt="CodeFjord Logo" style={{ width: '80px', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 24px #00304933)' }} />
        <div className="loading-spinner"></div>
        <h2>CodeFjord</h2>
        <p>Ihre digitale Zukunft beginnt hier</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/page/:slug" element={<Page />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
