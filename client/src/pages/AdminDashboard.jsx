import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Modal states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxAttendees: '',
    registrationDeadline: '',
    eventType: 'other'
  });
  const [campaignForm, setCampaignForm] = useState({
    campaignName: '',
    description: '',
    targetAmount: '',
    endDate: '',
    category: 'other'
  });

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Verify user role
      if (parsedUser.role !== 'admin') {
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

      // Fetch admin stats
      const statsResponse = await fetch('/api/admin/stats', { headers });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      // Fetch alumni
      const alumniResponse = await fetch('/api/admin/alumni', { headers });
      if (alumniResponse.ok) {
        const alumniData = await alumniResponse.json();
        setAlumni(alumniData.data || []);
      }

      // Fetch events
      const eventsResponse = await fetch('/api/events', { headers });
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.data || []);
      }

      // Fetch donation campaigns
      const campaignsResponse = await fetch('/api/donations/campaigns', { headers });
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData.data || []);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventForm)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Event created successfully!');
        setShowEventForm(false);
        setEventForm({
          title: '', description: '', date: '', location: '',
          maxAttendees: '', registrationDeadline: '', eventType: 'other'
        });
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Event deleted successfully!');
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/donations/campaign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignForm)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Campaign created successfully!');
        setShowCampaignForm(false);
        setCampaignForm({
          campaignName: '', description: '', targetAmount: '',
          endDate: '', category: 'other'
        });
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/donations/campaign/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Campaign deleted successfully!');
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to delete campaign');
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleDeleteAlumni = async (alumniId) => {
    if (!confirm('Are you sure you want to delete this alumni? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/alumni/${alumniId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Alumni deleted successfully!');
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to delete alumni');
      }
    } catch (error) {
      console.error('Failed to delete alumni:', error);
      alert('Failed to delete alumni');
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
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-info">
            <span className="college-name">{stats?.collegeInfo?.collegeName}</span>
            <span className="admin-name">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'analytics' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={activeTab === 'alumni' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('alumni')}
        >
          Alumni Management
        </button>
        <button 
          className={activeTab === 'events' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('events')}
        >
          Event Management
        </button>
        <button 
          className={activeTab === 'campaigns' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('campaigns')}
        >
          Donation Campaigns
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Dashboard Analytics</h2>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card users">
                <h3>Users</h3>
                <div className="stat-number">{stats?.users?.total || 0}</div>
                <div className="stat-breakdown">
                  <span>Alumni: {stats?.users?.alumni || 0}</span>
                  <span>Students: {stats?.users?.students || 0}</span>
                </div>
              </div>
              
              <div className="stat-card events">
                <h3>Events</h3>
                <div className="stat-number">{stats?.events?.total || 0}</div>
                <div className="stat-breakdown">
                  <span>Upcoming: {stats?.events?.upcoming || 0}</span>
                </div>
              </div>
              
              <div className="stat-card donations">
                <h3>Donations</h3>
                <div className="stat-number">₹{stats?.donations?.totalAmount?.toLocaleString() || 0}</div>
                <div className="stat-breakdown">
                  <span>Total Donations: {stats?.donations?.totalCount || 0}</span>
                  <span>Active Campaigns: {stats?.donations?.activeCampaigns || 0}</span>
                </div>
              </div>
              
              <div className="stat-card campaigns">
                <h3>Campaign Funds</h3>
                <div className="stat-number">₹{stats?.donations?.campaignFundsRaised?.toLocaleString() || 0}</div>
                <div className="stat-breakdown">
                  <span>From Campaigns</span>
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="recent-events">
              <h3>Recent Events</h3>
              <div className="events-list">
                {stats?.events?.recent?.length > 0 ? (
                  stats.events.recent.map(event => (
                    <div key={event._id} className="event-summary">
                      <h4>{event.title}</h4>
                      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                      <p>Location: {event.location}</p>
                      <p>Registered: {event.registeredAttendees?.length || 0}</p>
                    </div>
                  ))
                ) : (
                  <p>No recent events</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Alumni Management Tab */}
        {activeTab === 'alumni' && (
          <div className="alumni-management">
            <div className="section-header">
              <h2>Alumni Management</h2>
              <div className="alumni-count">Total Alumni: {alumni.length}</div>
            </div>
            
            <div className="alumni-table">
              {alumni.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Graduation Year</th>
                      <th>Degree</th>
                      <th>Current Job</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumni.map(alumnus => (
                      <tr key={alumnus._id}>
                        <td>{alumnus.userId?.name}</td>
                        <td>{alumnus.userId?.email}</td>
                        <td>{alumnus.graduationYear}</td>
                        <td>{alumnus.degree}</td>
                        <td>{alumnus.currentJob}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteAlumni(alumnus._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No alumni found</p>
              )}
            </div>
          </div>
        )}

        {/* Event Management Tab */}
        {activeTab === 'events' && (
          <div className="event-management">
            <div className="section-header">
              <h2>Event Management</h2>
              <button 
                onClick={() => setShowEventForm(true)}
                className="create-btn"
              >
                Create New Event
              </button>
            </div>
            
            <div className="events-grid">
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event._id} className="event-card">
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                      <p><strong>Location:</strong> {event.location}</p>
                      <p><strong>Type:</strong> {event.eventType}</p>
                      <p><strong>Registered:</strong> {event.registeredAttendees?.length || 0}</p>
                      {event.maxAttendees && (
                        <p><strong>Max Attendees:</strong> {event.maxAttendees}</p>
                      )}
                    </div>
                    <div className="event-actions">
                      <button 
                        onClick={() => handleDeleteEvent(event._id)}
                        className="delete-btn"
                      >
                        Delete Event
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No events found</p>
              )}
            </div>
          </div>
        )}

        {/* Donation Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="campaign-management">
            <div className="section-header">
              <h2>Donation Campaigns</h2>
              <button 
                onClick={() => setShowCampaignForm(true)}
                className="create-btn"
              >
                Create New Campaign
              </button>
            </div>
            
            <div className="campaigns-grid">
              {campaigns.length > 0 ? (
                campaigns.map(campaign => (
                  <div key={campaign._id} className="campaign-card">
                    <h3>{campaign.campaignName}</h3>
                    <p className="campaign-description">{campaign.description}</p>
                    <div className="campaign-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${campaign.completionPercentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        ₹{campaign.currentAmount?.toLocaleString() || 0} / ₹{campaign.targetAmount?.toLocaleString() || 0}
                        ({campaign.completionPercentage || 0}%)
                      </div>
                    </div>
                    <div className="campaign-details">
                      <p><strong>Category:</strong> {campaign.category}</p>
                      <p><strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}</p>
                      <p><strong>Days Remaining:</strong> {campaign.daysRemaining || 0}</p>
                      <p><strong>Donors:</strong> {campaign.donors?.length || 0}</p>
                    </div>
                    <div className="campaign-actions">
                      <button 
                        onClick={() => handleDeleteCampaign(campaign._id)}
                        className="delete-btn"
                      >
                        Delete Campaign
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No campaigns found</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      {showEventForm && (
        <div className="modal-overlay" onClick={() => setShowEventForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Event</h3>
            <form onSubmit={handleCreateEvent}>
              <div className="form-row">
                <div className="form-group">
                  <label>Event Title:</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Event Type:</label>
                  <select
                    value={eventForm.eventType}
                    onChange={(e) => setEventForm({...eventForm, eventType: e.target.value})}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="networking">Networking</option>
                    <option value="career-fair">Career Fair</option>
                    <option value="alumni-meet">Alumni Meet</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                  rows={3}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location:</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Max Attendees (Optional):</label>
                  <input
                    type="number"
                    value={eventForm.maxAttendees}
                    onChange={(e) => setEventForm({...eventForm, maxAttendees: e.target.value})}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Registration Deadline (Optional):</label>
                  <input
                    type="datetime-local"
                    value={eventForm.registrationDeadline}
                    onChange={(e) => setEventForm({...eventForm, registrationDeadline: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowEventForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCampaignForm && (
        <div className="modal-overlay" onClick={() => setShowCampaignForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Campaign</h3>
            <form onSubmit={handleCreateCampaign}>
              <div className="form-row">
                <div className="form-group">
                  <label>Campaign Name:</label>
                  <input
                    type="text"
                    value={campaignForm.campaignName}
                    onChange={(e) => setCampaignForm({...campaignForm, campaignName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    value={campaignForm.category}
                    onChange={(e) => setCampaignForm({...campaignForm, category: e.target.value})}
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="research">Research</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                  required
                  rows={3}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Target Amount (₹):</label>
                  <input
                    type="number"
                    value={campaignForm.targetAmount}
                    onChange={(e) => setCampaignForm({...campaignForm, targetAmount: e.target.value})}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>End Date:</label>
                  <input
                    type="date"
                    value={campaignForm.endDate}
                    onChange={(e) => setCampaignForm({...campaignForm, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowCampaignForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }

        .admin-dashboard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4=') repeat;
          opacity: 0.3;
          pointer-events: none;
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          margin: 0;
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          background: linear-gradient(45deg, #fff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .college-name {
          font-weight: 600;
          background: linear-gradient(45deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1));
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }

        .admin-name {
          font-weight: 500;
          opacity: 0.9;
        }

        .logout-btn {
          background: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-weight: 500;
        }

        .logout-btn:hover {
          background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2));
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .dashboard-nav {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0 2rem;
          display: flex;
          gap: 0;
          position: relative;
          z-index: 1;
        }

        .nav-btn {
          background: none;
          border: none;
          padding: 1.25rem 2rem;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #666;
          position: relative;
          overflow: hidden;
        }

        .nav-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          z-index: -1;
        }

        .nav-btn:hover::before,
        .nav-btn.active::before {
          transform: scaleX(1);
        }

        .nav-btn.active {
          border-bottom-color: #667eea;
          color: #667eea;
          font-weight: 600;
        }

        .nav-btn:hover {
          color: #667eea;
        }

        .dashboard-main {
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          margin: 0;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .create-btn, .submit-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          font-size: 0.95rem;
        }

        .create-btn:hover, .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #28a745, #20c997);
          transition: all 0.3s ease;
        }

        .stat-card.events::before {
          background: linear-gradient(90deg, #007bff, #0056b3);
        }

        .stat-card.donations::before {
          background: linear-gradient(90deg, #ffc107, #e0a800);
        }

        .stat-card.campaigns::before {
          background: linear-gradient(90deg, #dc3545, #c82333);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .stat-card:hover::before {
          height: 6px;
        }

        .stat-card h3 {
          margin: 0 0 1rem 0;
          color: #666;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: #666;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .recent-events {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .recent-events h3 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .events-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .event-summary {
          padding: 1.5rem;
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 15px;
          background: linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          transition: all 0.3s ease;
        }

        .event-summary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.2);
        }

        .event-summary h4 {
          margin: 0 0 0.75rem 0;
          color: #667eea;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .event-summary p {
          margin: 0.5rem 0;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .alumni-table {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .alumni-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .alumni-table th,
        .alumni-table td {
          padding: 1.25rem;
          text-align: left;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .alumni-table th {
          background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alumni-table tbody tr {
          transition: all 0.2s ease;
        }

        .alumni-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .alumni-count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .events-grid, .campaigns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2rem;
        }

        .event-card, .campaign-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .event-card::before,
        .campaign-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .event-card:hover,
        .campaign-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .event-card h3, .campaign-card h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.3rem;
          font-weight: bold;
        }

        .event-description, .campaign-description {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .event-details, .campaign-details {
          margin: 1.5rem 0;
          background: rgba(102, 126, 234, 0.05);
          padding: 1rem;
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }

        .event-details p, .campaign-details p {
          margin: 0.75rem 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .event-details strong, .campaign-details strong {
          color: #333;
          font-weight: 600;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          overflow: hidden;
          margin: 1rem 0;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #28a745, #20c997);
          transition: width 0.5s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-text {
          font-size: 0.95rem;
          color: #666;
          text-align: center;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .event-actions, .campaign-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .delete-btn {
          background: linear-gradient(45deg, #dc3545, #c82333);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          font-weight: 500;
          box-shadow: 0 3px 10px rgba(220, 53, 69, 0.3);
        }

        .delete-btn:hover {
          background: linear-gradient(45deg, #c82333, #a71e2a);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          max-width: 650px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-content h3 {
          margin: 0 0 2rem 0;
          color: #333;
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e1e5e9;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .cancel-btn {
          background: linear-gradient(45deg, #6c757d, #5a6268);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          box-shadow: 0 3px 10px rgba(108, 117, 125, 0.3);
        }

        .cancel-btn:hover {
          background: linear-gradient(45deg, #5a6268, #495057);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(108, 117, 125, 0.4);
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-size: 1.2rem;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1.5rem;
          }
          
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .header-content h1 {
            font-size: 2rem;
          }
          
          .dashboard-nav {
            padding: 0 1rem;
            overflow-x: auto;
            white-space: nowrap;
          }

          .nav-btn {
            padding: 1rem 1.5rem;
            font-size: 0.9rem;
          }
          
          .dashboard-main {
            padding: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .events-grid, .campaigns-grid {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .modal-content {
            padding: 1.5rem;
            margin: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;