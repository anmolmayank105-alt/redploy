import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CollegePublicPage = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [publicData, setPublicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (collegeId) {
      fetchCollegePublicData();
    }
  }, [collegeId]);

  const fetchCollegePublicData = async () => {
    try {
      const response = await fetch(`/api/colleges/${collegeId}/public`);
      if (response.ok) {
        const result = await response.json();
        setPublicData(result.data);
      } else {
        setError('College not found');
      }
    } catch (error) {
      console.error('Error fetching college data:', error);
      setError('Failed to load college information');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleJoinNetwork = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading college information...</div>
      </div>
    );
  }

  if (error || !publicData) {
    return (
      <div className="error-container">
        <h2>College Not Found</h2>
        <p>{error}</p>
        <button onClick={handleBackToHome} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  const { college, statistics, alumniHighlights, upcomingEvents, activeCampaigns } = publicData;

  return (
    <div className="college-public-page">
      {/* Header */}
      <header className="college-header">
        <div className="header-content">
          <button onClick={handleBackToHome} className="back-btn">
            ← Back to Home
          </button>
          <button onClick={handleJoinNetwork} className="join-btn">
            Join Network
          </button>
        </div>
      </header>

      {/* College Info Section */}
      <section className="college-hero">
        <div className="hero-content">
          <div className="college-logo-section">
            {college.logoUrl ? (
              <img 
                src={college.logoUrl} 
                alt={`${college.name} logo`}
                className="college-logo-large"
              />
            ) : (
              <div className="college-logo-placeholder-large">
                {college.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="college-details">
            <h1 className="college-title">{college.name}</h1>
            <p className="college-description">{college.description}</p>
            <div className="college-location">
              <span className="location-icon">📍</span>
              <span>{college.address}</span>
            </div>
            
            <div className="college-stats">
              <div className="stat-item">
                <h3>{statistics.totalAlumni}</h3>
                <p>Alumni</p>
              </div>
              <div className="stat-item">
                <h3>{statistics.totalEvents}</h3>
                <p>Events</p>
              </div>
              <div className="stat-item">
                <h3>{statistics.totalActiveCampaigns}</h3>
                <p>Active Campaigns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Highlights Section */}
      <section className="alumni-section">
        <div className="section-header">
          <h2>Alumni Highlights</h2>
          <p>Meet our successful graduates making impact worldwide</p>
        </div>
        
        <div className="alumni-grid">
          {alumniHighlights.length > 0 ? (
            alumniHighlights.map(alumni => (
              <div key={alumni._id} className="alumni-card">
                <div className="alumni-info">
                  <h3 className="alumni-name">{alumni.userId?.name}</h3>
                  <p className="alumni-job">{alumni.currentJob}</p>
                  <p className="alumni-degree">{alumni.degree}</p>
                  <div className="graduation-year">
                    Class of {alumni.graduationYear}
                  </div>
                  {alumni.bio && (
                    <p className="alumni-bio">{alumni.bio}</p>
                  )}
                  {alumni.skills && alumni.skills.length > 0 && (
                    <div className="alumni-skills">
                      {alumni.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>No alumni highlights available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="events-section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <p>Join our community events and networking opportunities</p>
        </div>
        
        <div className="events-grid">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <div key={event._id} className="event-card">
                <div className="event-date">
                  <div className="day">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="month">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
                
                <div className="event-details">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <div className="event-location">
                      <span className="location-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="event-time">
                      <span className="time-icon">🕐</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {event.eventType && (
                    <div className="event-type">{event.eventType}</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>No upcoming events scheduled.</p>
            </div>
          )}
        </div>
      </section>

      {/* Donation Campaigns Section */}
      <section className="campaigns-section">
        <div className="section-header">
          <h2>Support Our Campaigns</h2>
          <p>Help us make a difference in student lives</p>
        </div>
        
        <div className="campaigns-grid">
          {activeCampaigns.length > 0 ? (
            activeCampaigns.map(campaign => (
              <div key={campaign._id} className="campaign-card">
                <div className="campaign-header">
                  <h3 className="campaign-title">{campaign.campaignName}</h3>
                  <div className="campaign-category">{campaign.category}</div>
                </div>
                
                <p className="campaign-description">{campaign.description}</p>
                
                <div className="campaign-progress">
                  <div className="progress-info">
                    <span className="current-amount">₹{campaign.currentAmount.toLocaleString()}</span>
                    <span className="target-amount">of ₹{campaign.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${Math.min(campaign.completionPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <span className="percentage">{campaign.completionPercentage}% completed</span>
                    <span className="days-left">{campaign.daysRemaining} days left</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleJoinNetwork}
                  className="donate-btn"
                >
                  Join to Donate
                </button>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>No active donation campaigns at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Join the {college.name} Network?</h2>
          <p>Connect with alumni, find mentorship, and grow your career</p>
          <button onClick={handleJoinNetwork} className="cta-btn">
            Join Now
          </button>
        </div>
      </section>

      <style jsx>{`
        .college-public-page {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .college-header {
          background: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-btn, .join-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .back-btn {
          background: #f8f9fa;
          color: #333;
          border: 1px solid #dee2e6;
        }

        .back-btn:hover {
          background: #e9ecef;
        }

        .join-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .join-btn:hover {
          transform: translateY(-2px);
        }

        .college-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3rem;
          align-items: center;
        }

        .college-logo-large {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid rgba(255,255,255,0.2);
        }

        .college-logo-placeholder-large {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          font-weight: bold;
          border: 5px solid rgba(255,255,255,0.2);
        }

        .college-title {
          font-size: 3rem;
          margin: 0 0 1rem 0;
          font-weight: bold;
        }

        .college-description {
          font-size: 1.2rem;
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
          line-height: 1.6;
        }

        .college-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .college-stats {
          display: flex;
          gap: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-item h3 {
          font-size: 2.5rem;
          margin: 0;
          font-weight: bold;
        }

        .stat-item p {
          margin: 0.5rem 0 0 0;
          opacity: 0.8;
        }

        .alumni-section, .events-section, .campaigns-section {
          padding: 4rem 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
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

        .alumni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .alumni-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .alumni-card:hover {
          transform: translateY(-5px);
        }

        .alumni-name {
          font-size: 1.3rem;
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .alumni-job {
          font-weight: bold;
          color: #667eea;
          margin: 0 0 0.5rem 0;
        }

        .alumni-degree {
          color: #666;
          margin: 0 0 1rem 0;
        }

        .graduation-year {
          background: #667eea;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .alumni-bio {
          color: #666;
          line-height: 1.5;
          margin: 1rem 0;
          font-style: italic;
        }

        .alumni-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background: #f8f9fa;
          color: #495057;
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          font-size: 0.8rem;
          border: 1px solid #dee2e6;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .event-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          display: flex;
          gap: 1.5rem;
          transition: transform 0.2s ease;
        }

        .event-card:hover {
          transform: translateY(-5px);
        }

        .event-date {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
          min-width: 70px;
          height: fit-content;
        }

        .event-date .day {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .event-date .month {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .event-details {
          flex: 1;
        }

        .event-title {
          font-size: 1.3rem;
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .event-description {
          color: #666;
          line-height: 1.5;
          margin: 0 0 1rem 0;
        }

        .event-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .event-location, .event-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #888;
          font-size: 0.9rem;
        }

        .event-type {
          background: #e9ecef;
          color: #495057;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          display: inline-block;
          text-transform: capitalize;
        }

        .campaigns-section {
          background: white;
        }

        .campaigns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .campaign-card {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .campaign-card:hover {
          transform: translateY(-5px);
        }

        .campaign-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .campaign-title {
          font-size: 1.3rem;
          margin: 0;
          color: #333;
          flex: 1;
        }

        .campaign-category {
          background: #667eea;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          text-transform: capitalize;
        }

        .campaign-description {
          color: #666;
          line-height: 1.5;
          margin: 0 0 2rem 0;
        }

        .campaign-progress {
          margin-bottom: 1.5rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .current-amount {
          font-weight: bold;
          color: #28a745;
        }

        .target-amount {
          color: #666;
        }

        .progress-bar {
          background: #e9ecef;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #666;
        }

        .donate-btn {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          width: 100%;
          transition: transform 0.2s ease;
        }

        .donate-btn:hover {
          transform: translateY(-2px);
        }

        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin: 0 0 2rem 0;
          opacity: 0.9;
        }

        .cta-btn {
          background: white;
          color: #667eea;
          border: none;
          padding: 1rem 3rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1.1rem;
          transition: transform 0.2s ease;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
        }

        .no-data {
          text-align: center;
          padding: 3rem;
          color: #666;
          grid-column: 1 / -1;
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

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }
          
          .college-title {
            font-size: 2rem;
          }
          
          .college-stats {
            justify-content: center;
            gap: 2rem;
          }
          
          .alumni-grid, .events-grid, .campaigns-grid {
            grid-template-columns: 1fr;
          }
          
          .event-card {
            flex-direction: column;
            text-align: center;
          }
          
          .campaign-header {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CollegePublicPage;