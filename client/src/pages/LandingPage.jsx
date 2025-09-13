import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges');
      if (response.ok) {
        const data = await response.json();
        setColleges(data);
      } else {
        setError('Failed to fetch colleges');
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeClick = (collegeId) => {
    navigate(`/college/${collegeId}`);
  };

  const handleAuthClick = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchColleges} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="site-title">Alumni Connect</h1>
            <p className="site-tagline">Connecting Alumni, Students, and Opportunities</p>
          </div>
          <div className="header-actions">
            <button onClick={handleAuthClick} className="auth-btn">
              Login / Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Discover Amazing Alumni Networks</h2>
          <p className="hero-description">
            Connect with alumni from top colleges, find mentorship opportunities, 
            and stay updated with your college community.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <h3>{colleges.length}</h3>
              <p>Colleges</p>
            </div>
            <div className="stat">
              <h3>500+</h3>
              <p>Alumni</p>
            </div>
            <div className="stat">
              <h3>100+</h3>
              <p>Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Colleges Section */}
      <section className="colleges-section">
        <div className="section-header">
          <h2>Explore Colleges</h2>
          <p>Choose your college to connect with your alumni network</p>
        </div>
        
        <div className="colleges-grid">
          {colleges.map(college => (
            <div 
              key={college._id} 
              className="college-card"
              onClick={() => handleCollegeClick(college._id)}
            >
              <div className="college-image">
                {college.logoUrl ? (
                  <img 
                    src={college.logoUrl} 
                    alt={`${college.name} logo`}
                    className="college-logo"
                  />
                ) : (
                  <div className="college-logo-placeholder">
                    {college.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="college-info">
                <h3 className="college-name">{college.name}</h3>
                <p className="college-description">
                  {college.description || 'Explore this college\'s alumni network and opportunities.'}
                </p>
                <div className="college-location">
                  <span className="location-icon">📍</span>
                  <span>{college.address || 'Location not specified'}</span>
                </div>
              </div>
              
              <div className="college-actions">
                <button className="explore-btn">
                  Explore Network
                </button>
              </div>
            </div>
          ))}
        </div>

        {colleges.length === 0 && (
          <div className="no-colleges">
            <h3>No colleges available</h3>
            <p>Check back later for college listings.</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Alumni Connect?</h2>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Alumni Network</h3>
            <p>Connect with successful graduates from your college and build meaningful professional relationships.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Mentorship</h3>
            <p>Get guidance from experienced professionals who have walked the same path as you.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Events & Networking</h3>
            <p>Attend college events, workshops, and networking sessions to grow your professional circle.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Give Back</h3>
            <p>Support your college through donation campaigns and help current students achieve their dreams.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Alumni Connect</h4>
            <p>Building bridges between alumni and students for a brighter future.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={handleAuthClick}>Login</button></li>
              <li><button onClick={handleAuthClick}>Register</button></li>
              <li><button onClick={() => navigate('/about')}>About Us</button></li>
              <li><button onClick={() => navigate('/contact')}>Contact</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>For Colleges</h4>
            <ul>
              <li><button onClick={handleAuthClick}>Admin Panel</button></li>
              <li><button onClick={() => navigate('/college-registration')}>Register College</button></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Alumni Connect. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .landing-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .site-title {
          margin: 0;
          color: #333;
          font-size: 2rem;
          font-weight: bold;
        }

        .site-tagline {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .auth-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.2s ease;
        }

        .auth-btn:hover {
          transform: translateY(-2px);
        }

        .hero-section {
          padding: 4rem 2rem;
          text-align: center;
          color: white;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3rem;
          margin: 0 0 1rem 0;
          font-weight: bold;
        }

        .hero-description {
          font-size: 1.2rem;
          margin: 0 0 3rem 0;
          opacity: 0.9;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
        }

        .stat {
          text-align: center;
        }

        .stat h3 {
          font-size: 2.5rem;
          margin: 0;
          font-weight: bold;
        }

        .stat p {
          margin: 0.5rem 0 0 0;
          opacity: 0.8;
        }

        .colleges-section {
          background: white;
          padding: 4rem 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
          color: #333;
        }

        .section-header p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }

        .colleges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .college-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .college-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .college-image {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .college-logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .college-logo-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          margin: 0 auto;
        }

        .college-name {
          font-size: 1.5rem;
          margin: 0 0 1rem 0;
          color: #333;
          text-align: center;
        }

        .college-description {
          color: #666;
          line-height: 1.6;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .college-location {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .explore-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          width: 100%;
          transition: transform 0.2s ease;
        }

        .explore-btn:hover {
          transform: translateY(-2px);
        }

        .no-colleges {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .features-section {
          background: #f8f9fa;
          padding: 4rem 2rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          color: #333;
          margin: 0 0 1rem 0;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .landing-footer {
          background: #2c3e50;
          color: white;
          padding: 3rem 2rem 1rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-section h4 {
          margin: 0 0 1rem 0;
          color: white;
        }

        .footer-section p {
          margin: 0;
          opacity: 0.8;
          line-height: 1.6;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-section li {
          margin-bottom: 0.5rem;
        }

        .footer-section button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          padding: 0;
          text-align: left;
          transition: color 0.2s ease;
        }

        .footer-section button:hover {
          color: white;
        }

        .footer-bottom {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          opacity: 0.6;
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .spinner {
          font-size: 1.2rem;
          padding: 2rem;
        }

        .retry-btn {
          background: white;
          color: #667eea;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }
          
          .colleges-grid {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;