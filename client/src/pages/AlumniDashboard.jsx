import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Verify user role
      if (parsedUser.role !== 'alumni') {
        navigate('/');
        return;
      }
      
      fetchAlumniProfile();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchAlumniProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/alumni/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAlumniProfile(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch alumni profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #dee2e6',
        padding: '1rem 2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>Alumni Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Profile Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>My Profile</h3>
            {alumniProfile ? (
              <div>
                <p><strong>Graduation Year:</strong> {alumniProfile.graduationYear}</p>
                <p><strong>Degree:</strong> {alumniProfile.degree}</p>
                <p><strong>Current Job:</strong> {alumniProfile.currentJob || 'Not specified'}</p>
                <p><strong>College:</strong> {user?.collegeId?.name}</p>
                {alumniProfile.linkedin && (
                  <p>
                    <strong>LinkedIn:</strong> 
                    <a 
                      href={alumniProfile.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ marginLeft: '0.5rem', color: '#0066cc' }}
                    >
                      View Profile
                    </a>
                  </p>
                )}
                <button
                  onClick={() => navigate('/profile/edit')}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div>
                <p>No alumni profile found.</p>
                <button
                  onClick={() => navigate('/profile/create')}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span>Profile Views</span>
                <span style={{ fontWeight: 'bold' }}>0</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span>Network Connections</span>
                <span style={{ fontWeight: 'bold' }}>0</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span>Events Attended</span>
                <span style={{ fontWeight: 'bold' }}>0</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Recent Activity</h3>
            <p style={{ color: '#6c757d' }}>No recent activity to display.</p>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/alumni')}
                style={{
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Browse Alumni Network
              </button>
              <button
                onClick={() => navigate('/events')}
                style={{
                  backgroundColor: '#ffc107',
                  color: '#212529',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Upcoming Events
              </button>
              <button
                onClick={() => navigate('/mentorship')}
                style={{
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Mentorship Program
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;