import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [mentorshipMessage, setMentorshipMessage] = useState('');

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Verify user role
      if (parsedUser.role !== 'student') {
        navigate('/');
        return;
      }
      
      fetchDashboardData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch alumni from same college using new endpoint
      const alumniResponse = await fetch('/api/users/alumni/my-college', { headers });
      if (alumniResponse.ok) {
        const alumniData = await alumniResponse.json();
        setAlumni(alumniData.data || []);
      }

      // Fetch student's mentorship requests
      const mentorshipResponse = await fetch('/api/mentorship/student', { headers });
      if (mentorshipResponse.ok) {
        const mentorshipData = await mentorshipResponse.json();
        setMentorshipRequests(mentorshipData.data || []);
      }

      // Fetch events (would need events API)
      // For now, set empty array
      setEvents([]);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMentorshipRequest = async (e) => {
    e.preventDefault();
    
    if (!selectedAlumni || !mentorshipMessage.trim()) {
      alert('Please select an alumni and enter a message');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mentorship', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alumniId: selectedAlumni._id,
          message: mentorshipMessage
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Mentorship request sent successfully!');
        setShowMentorshipForm(false);
        setSelectedAlumni(null);
        setMentorshipMessage('');
        fetchDashboardData(); // Refresh data
      } else {
        alert(data.message || 'Failed to send mentorship request');
      }
    } catch (error) {
      console.error('Failed to send mentorship request:', error);
      alert('Failed to send mentorship request');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Student Dashboard</h1>
          <div className="header-actions">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Profile Section */}
        <section className="dashboard-card">
          <h3>My Profile</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> Student</p>
            <p><strong>College:</strong> {user?.collegeId?.name}</p>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          </div>
        </section>

        {/* Alumni Network Section */}
        <section className="dashboard-card">
          <h3>Alumni Network - {user?.collegeId?.name}</h3>
          <div className="alumni-grid">
            {alumni.length > 0 ? (
              alumni.slice(0, 6).map(alumnus => (
                <div key={alumnus._id} className="alumni-card">
                  <h4>{alumnus.userId?.name}</h4>
                  <p className="graduation-year">{alumnus.graduationYear}</p>
                  <p className="degree">{alumnus.degree}</p>
                  <p className="current-job">{alumnus.currentJob}</p>
                  <button 
                    onClick={() => {
                      setSelectedAlumni(alumnus);
                      setShowMentorshipForm(true);
                    }}
                    className="btn btn-secondary"
                  >
                    Request Mentorship
                  </button>
                </div>
              ))
            ) : (
              <p>No alumni found from your college.</p>
            )}
          </div>
          {alumni.length > 6 && (
            <button 
              onClick={() => navigate('/alumni')}
              className="btn btn-outline"
            >
              View All Alumni
            </button>
          )}
        </section>

        {/* Mentorship Requests Section */}
        <section className="dashboard-card">
          <h3>My Mentorship Requests</h3>
          <div className="requests-list">
            {mentorshipRequests.length > 0 ? (
              mentorshipRequests.map(request => (
                <div key={request._id} className="request-item">
                  <div className="request-info">
                    <h4>{request.alumniId?.name}</h4>
                    <p className="request-message">"{request.message}"</p>
                    <p className="request-date">
                      Sent: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`request-status status-${request.status}`}>
                    {request.status}
                  </div>
                </div>
              ))
            ) : (
              <p>No mentorship requests sent yet.</p>
            )}
          </div>
        </section>

        {/* College Events Section */}
        <section className="dashboard-card">
          <h3>Upcoming Events - {user?.collegeId?.name}</h3>
          <div className="events-list">
            {events.length > 0 ? (
              events.map(event => (
                <div key={event._id} className="event-item">
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                  <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No upcoming events for your college.</p>
            )}
          </div>
          <button 
            onClick={() => navigate('/events')}
            className="btn btn-outline"
          >
            View All Events
          </button>
        </section>

        {/* Career Resources Section */}
        <section className="dashboard-card">
          <h3>Career Resources</h3>
          <div className="resources-grid">
            <button 
              onClick={() => setShowMentorshipForm(true)}
              className="resource-btn"
            >
              Find a Mentor
            </button>
            <button 
              onClick={() => navigate('/internships')}
              className="resource-btn"
            >
              Internship Opportunities
            </button>
            <button 
              onClick={() => navigate('/career-guidance')}
              className="resource-btn"
            >
              Career Guidance
            </button>
            <button 
              onClick={() => navigate('/jobs')}
              className="resource-btn"
            >
              Job Opportunities
            </button>
          </div>
        </section>
      </main>

      {/* Mentorship Request Modal */}
      {showMentorshipForm && (
        <div className="modal-overlay" onClick={() => setShowMentorshipForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Request Mentorship</h3>
            <form onSubmit={handleMentorshipRequest}>
              <div className="form-group">
                <label>Select Alumni:</label>
                <select 
                  value={selectedAlumni?._id || ''} 
                  onChange={(e) => {
                    const alumni = alumni.find(a => a._id === e.target.value);
                    setSelectedAlumni(alumni);
                  }}
                  required
                >
                  <option value="">Choose an alumni...</option>
                  {alumni.map(alumnus => (
                    <option key={alumnus._id} value={alumnus._id}>
                      {alumnus.userId?.name} - {alumnus.currentJob}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  value={mentorshipMessage}
                  onChange={(e) => setMentorshipMessage(e.target.value)}
                  placeholder="Introduce yourself and explain why you'd like mentorship from this alumni..."
                  required
                  rows={4}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowMentorshipForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .student-dashboard {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .dashboard-header {
          background: white;
          border-bottom: 1px solid #dee2e6;
          padding: 1rem 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          margin: 0;
          color: #333;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logout-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .dashboard-main {
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .dashboard-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .dashboard-card h3 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #007bff;
          padding-bottom: 0.5rem;
        }

        .profile-info p {
          margin: 0.5rem 0;
        }

        .alumni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .alumni-card {
          border: 1px solid #dee2e6;
          padding: 1rem;
          border-radius: 6px;
          background: #f8f9fa;
        }

        .alumni-card h4 {
          margin: 0 0 0.5rem 0;
          color: #007bff;
        }

        .graduation-year {
          background: #007bff;
          color: white;
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          margin: 0.5rem 0;
        }

        .degree, .current-job {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          color: #666;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .request-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          background: #f8f9fa;
        }

        .request-info h4 {
          margin: 0 0 0.5rem 0;
        }

        .request-message {
          font-style: italic;
          color: #666;
          margin: 0.5rem 0;
        }

        .request-date {
          font-size: 0.8rem;
          color: #999;
          margin: 0;
        }

        .request-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.8rem;
        }

        .status-pending {
          background: #ffc107;
          color: #212529;
        }

        .status-accepted {
          background: #28a745;
          color: white;
        }

        .status-declined {
          background: #dc3545;
          color: white;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .event-item {
          padding: 1rem;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          background: #f8f9fa;
        }

        .event-item h4 {
          margin: 0 0 0.5rem 0;
          color: #007bff;
        }

        .event-date {
          font-size: 0.9rem;
          color: #666;
          font-weight: bold;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .resource-btn {
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .resource-btn:hover {
          transform: translateY(-2px);
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-outline {
          background-color: transparent;
          color: #007bff;
          border: 1px solid #007bff;
        }

        .btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          margin-top: 0;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          box-sizing: border-box;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .dashboard-main {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
          
          .alumni-grid {
            grid-template-columns: 1fr;
          }
          
          .resources-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;