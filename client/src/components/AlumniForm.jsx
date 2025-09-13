import React, { useState, useEffect } from 'react';

const AlumniForm = ({ onSubmit, initialData = null, colleges = [] }) => {
  const [formData, setFormData] = useState({
    userId: '',
    collegeId: '',
    graduationYear: '',
    degree: '',
    currentJob: '',
    achievements: '',
    linkedin: ''
  });
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If editing existing alumni, populate form
    if (initialData) {
      setFormData({
        userId: initialData.userId?._id || '',
        collegeId: initialData.collegeId?._id || '',
        graduationYear: initialData.graduationYear || '',
        degree: initialData.degree || '',
        currentJob: initialData.currentJob || '',
        achievements: initialData.achievements || '',
        linkedin: initialData.linkedin || ''
      });
    }
    
    // Fetch users with alumni role
    fetchAlumniUsers();
  }, [initialData]);

  const fetchAlumniUsers = async () => {
    try {
      // This would typically be an API call to get users with 'alumni' role
      // For now, we'll simulate this
      setUsers([]);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userId.trim()) {
      newErrors.userId = 'User is required';
    }
    if (!formData.collegeId.trim()) {
      newErrors.collegeId = 'College is required';
    }
    if (!formData.graduationYear) {
      newErrors.graduationYear = 'Graduation year is required';
    } else if (formData.graduationYear < 1950 || formData.graduationYear > new Date().getFullYear()) {
      newErrors.graduationYear = 'Please enter a valid graduation year';
    }
    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit(formData);
      
      // Reset form if creating new alumni
      if (!initialData) {
        setFormData({
          userId: '',
          collegeId: '',
          graduationYear: '',
          degree: '',
          currentJob: '',
          achievements: '',
          linkedin: ''
        });
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {initialData ? 'Edit Alumni Profile' : 'Add New Alumni'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* User Selection */}
        <div className="form-group">
          <label className="form-label">
            User *
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="form-input"
            disabled={!!initialData} // Disable when editing
          >
            <option value="">Select a user...</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {errors.userId && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '4px' }}>
              {errors.userId}
            </p>
          )}
        </div>

        {/* College Selection */}
        <div className="form-group">
          <label className="form-label">
            College *
          </label>
          <select
            name="collegeId"
            value={formData.collegeId}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select a college...</option>
            {colleges.map(college => (
              <option key={college._id} value={college._id}>
                {college.name}
              </option>
            ))}
          </select>
          {errors.collegeId && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '4px' }}>
              {errors.collegeId}
            </p>
          )}
        </div>

        {/* Graduation Year */}
        <div className="form-group">
          <label className="form-label">
            Graduation Year *
          </label>
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            className="form-input"
            min="1950"
            max={new Date().getFullYear()}
            placeholder="e.g., 2020"
          />
          {errors.graduationYear && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '4px' }}>
              {errors.graduationYear}
            </p>
          )}
        </div>

        {/* Degree */}
        <div className="form-group">
          <label className="form-label">
            Degree *
          </label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Bachelor of Computer Science"
          />
          {errors.degree && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '4px' }}>
              {errors.degree}
            </p>
          )}
        </div>

        {/* Current Job */}
        <div className="form-group">
          <label className="form-label">
            Current Job
          </label>
          <input
            type="text"
            name="currentJob"
            value={formData.currentJob}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Software Engineer at Google"
          />
        </div>

        {/* Achievements */}
        <div className="form-group">
          <label className="form-label">
            Achievements
          </label>
          <textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            className="form-input"
            rows="4"
            placeholder="Share your notable achievements, awards, or accomplishments..."
            style={{ resize: 'vertical', minHeight: '100px' }}
          />
        </div>

        {/* LinkedIn */}
        <div className="form-group">
          <label className="form-label">
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="form-input"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (initialData ? 'Update Alumni' : 'Add Alumni')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlumniForm;