import React from 'react';

const AlumniList = ({ alumni }) => {
  if (!alumni || alumni.length === 0) {
    return (
      <div className="text-center" style={{ padding: '40px 0' }}>
        <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>No Alumni Found</h3>
        <p style={{ color: '#9ca3af' }}>Be the first alumnus to join this college's network!</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {alumni.map((alumnus) => (
          <div 
            key={alumnus._id} 
            style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Alumni Header */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600',
                marginBottom: '4px',
                color: '#1f2937'
              }}>
                {alumnus.userId?.name || 'N/A'}
              </h3>
              <p style={{ 
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                {alumnus.userId?.email || 'N/A'}
              </p>
            </div>

            {/* Education Info */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {alumnus.degree}
                </span>
                <span style={{ 
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Class of {alumnus.graduationYear}
                </span>
              </div>
            </div>

            {/* Current Job */}
            {alumnus.currentJob && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '8px' }}>💼</span>
                  {alumnus.currentJob}
                </p>
              </div>
            )}

            {/* Achievements */}
            {alumnus.achievements && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  lineHeight: '1.5'
                }}>
                  <span style={{ 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Achievements: 
                  </span>
                  <br />
                  {alumnus.achievements}
                </p>
              </div>
            )}

            {/* LinkedIn Link */}
            {alumnus.linkedin && (
              <div style={{ 
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <a 
                  href={alumnus.linkedin.startsWith('http') ? alumnus.linkedin : `https://${alumnus.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: '#0077b5',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  <span style={{ marginRight: '6px' }}>💼</span>
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniList;