import React, { useState, useEffect } from 'react';
import AlumniList from '../components/AlumniList';

const CollegePage = ({ collegeId }) => {
  const [college, setCollege] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (collegeId) {
      fetchCollegeData();
      fetchAlumni();
    }
  }, [collegeId]);

  const fetchCollegeData = async () => {
    try {
      const response = await fetch(`/api/colleges/${collegeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch college data');
      }
      const data = await response.json();
      setCollege(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`/api/alumni?collegeId=${collegeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch alumni');
      }
      const data = await response.json();
      setAlumni(data);
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
          <p>Loading college information...</p>
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

  if (!college) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>College not found</h2>
          <p>The requested college could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        {/* College Header */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            {college.logoUrl && (
              <div style={{ 
                flexShrink: 0,
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={college.logoUrl} 
                  alt={`${college.name} logo`}
                  style={{ 
                    maxHeight: '100px', 
                    maxWidth: '150px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            )}
            
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#1f2937'
              }}>
                {college.name}
              </h1>
              
              <p style={{ 
                color: '#4b5563',
                fontSize: '1.125rem',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>📍</span>
                {college.address}
              </p>
              
              <p style={{ 
                color: '#6b7280',
                lineHeight: '1.6'
              }}>
                {college.description}
              </p>
            </div>
          </div>
        </div>

        {/* Alumni Statistics */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px',
            textAlign: 'center'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#3b82f6',
                marginBottom: '8px'
              }}>
                {alumni.length}
              </h3>
              <p style={{ color: '#6b7280' }}>Total Alumni</p>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#10b981',
                marginBottom: '8px'
              }}>
                {new Set(alumni.map(a => a.graduationYear)).size}
              </h3>
              <p style={{ color: '#6b7280' }}>Graduation Years</p>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#8b5cf6',
                marginBottom: '8px'
              }}>
                {alumni.filter(a => a.currentJob).length}
              </h3>
              <p style={{ color: '#6b7280' }}>With Current Jobs</p>
            </div>
          </div>
        </div>

        {/* Alumni Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Alumni Directory</h2>
          </div>
          
          <AlumniList alumni={alumni} />
        </div>
      </div>
    </div>
  );
};

export default CollegePage;