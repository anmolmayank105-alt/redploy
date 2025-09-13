import React, { useState, useEffect } from 'react';

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges');
      if (!response.ok) {
        throw new Error('Failed to fetch colleges');
      }
      const data = await response.json();
      setColleges(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center mt-4">
          <p>Loading colleges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
          <p style={{ color: '#dc2626' }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          marginBottom: '16px',
          color: '#1f2937'
        }}>
          Colleges & Universities
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontSize: '1.125rem',
          marginBottom: '32px'
        }}>
          Explore our network of {colleges.length} participating institutions
        </p>

        {colleges.length === 0 ? (
          <div className="card text-center">
            <h3>No colleges found</h3>
            <p style={{ color: '#6b7280' }}>Be the first to add a college to our network!</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px',
            marginTop: '32px'
          }}>
            {colleges.map((college) => (
              <div key={college._id} className="card" style={{ 
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px -2px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => window.location.href = `/college/${college._id}`}
              >
                {college.logoUrl && (
                  <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '16px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={college.logoUrl} 
                      alt={`${college.name} logo`}
                      style={{ 
                        maxHeight: '80px', 
                        maxWidth: '120px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                )}
                
                <div className="card-header">
                  <h3 className="card-title" style={{ 
                    fontSize: '1.5rem',
                    marginBottom: '8px',
                    color: '#1f2937'
                  }}>
                    {college.name}
                  </h3>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ 
                    color: '#4b5563',
                    fontSize: '0.875rem',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ marginRight: '8px' }}>📍</span>
                    {college.address}
                  </p>
                </div>
                
                <p style={{ 
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '0.875rem'
                }}>
                  {college.description}
                </p>
                
                <div style={{ 
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button className="btn btn-outline" style={{ 
                    width: '100%',
                    fontSize: '0.875rem'
                  }}>
                    View Alumni →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeList;