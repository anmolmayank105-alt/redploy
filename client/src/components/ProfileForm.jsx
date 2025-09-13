import React, { useState, useEffect } from 'react';

const ProfileForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    graduationYear: '',
    degree: '',
    currentJob: '',
    achievements: '',
    linkedin: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If editing existing profile, populate form
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        graduationYear: initialData.graduationYear || '',
        degree: initialData.degree || '',
        currentJob: initialData.currentJob || '',
        achievements: initialData.achievements || '',
        linkedin: initialData.linkedin || ''
      });
    }
  }, [initialData]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.graduationYear && (formData.graduationYear < 1950 || formData.graduationYear > new Date().getFullYear())) {
      newErrors.graduationYear = 'Please enter a valid graduation year';
    }
    
    if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
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
      
      // Reset form if creating new profile
      if (!initialData) {
        setFormData({
          name: '',
          email: '',
          phone: '',
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
    <div className="profile-form-container">
      <div className="profile-form-card">
        <div className="profile-form-header">
          <h2 className="profile-form-title">
            {initialData ? 'Edit Profile' : 'Create Profile'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="error-message">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Graduation Year Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="graduationYear">
              Graduation Year
            </label>
            <input
              type="number"
              id="graduationYear"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="form-input"
              min="1950"
              max={new Date().getFullYear()}
              placeholder="e.g., 2020"
            />
            {errors.graduationYear && (
              <p className="error-message">{errors.graduationYear}</p>
            )}
          </div>

          {/* Degree Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="degree">
              Degree
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Bachelor of Computer Science"
            />
          </div>

          {/* Current Job Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="currentJob">
              Current Job
            </label>
            <input
              type="text"
              id="currentJob"
              name="currentJob"
              value={formData.currentJob}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Software Engineer at Google"
            />
          </div>

          {/* Achievements Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="achievements">
              Achievements
            </label>
            <textarea
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              placeholder="Share your notable achievements, awards, or accomplishments..."
            />
          </div>

          {/* LinkedIn Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="linkedin">
              LinkedIn Profile
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="form-input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedin && (
              <p className="error-message">{errors.linkedin}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : (initialData ? 'Update Profile' : 'Create Profile')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .profile-form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .profile-form-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .profile-form-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          text-align: center;
        }

        .profile-form-title {
          margin: 0;
          color: white;
          font-size: 1.75rem;
          font-weight: 600;
        }

        .profile-form {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: #f9fafb;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: #f9fafb;
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          margin: 0.25rem 0 0 0;
          font-weight: 500;
        }

        .form-actions {
          margin-top: 2rem;
          text-align: center;
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 160px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .submit-button:focus:not(:disabled) {
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .profile-form-container {
            padding: 1rem 0.5rem;
          }

          .profile-form {
            padding: 1.5rem;
          }

          .profile-form-header {
            padding: 1.5rem;
          }

          .profile-form-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileForm;