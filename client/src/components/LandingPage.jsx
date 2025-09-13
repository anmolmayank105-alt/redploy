import React from 'react';

const LandingPage = () => {
  return (
    <div className="flex flex-column justify-center align-center h-full text-center">
      <div className="container">
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Multi-College Alumni Management System
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280', 
            marginBottom: '32px',
            lineHeight: '1.8'
          }}>
            Connect alumni across multiple colleges, manage events, track mentorships, and build lasting professional networks.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">
              Get Started
            </button>
            <button className="btn btn-outline">
              Learn More
            </button>
          </div>
          
          <div style={{ 
            marginTop: '48px', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#dbeafe', 
                borderRadius: '50%', 
                margin: '0 auto 16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '24px', color: '#3b82f6' }}>🎓</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                Alumni Network
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Connect with graduates from multiple colleges and institutions
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#dcfce7', 
                borderRadius: '50%', 
                margin: '0 auto 16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '24px', color: '#16a34a' }}>📅</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                Event Management
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Organize reunions, networking events, and professional meetups
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#fce7f3', 
                borderRadius: '50%', 
                margin: '0 auto 16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '24px', color: '#be185d' }}>🤝</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                Mentorship
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Foster mentor-mentee relationships across institutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;