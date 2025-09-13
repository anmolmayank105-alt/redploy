import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    collegeId: '',
    customCollege: '',
    isCustomCollege: false
  });
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges');
      const data = await response.json();
      if (data.success) {
        setColleges(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
      setColleges([]); // Set empty array if fetch fails
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle college selection change
    if (name === 'collegeId') {
      if (value === 'custom') {
        setFormData(prev => ({
          ...prev,
          collegeId: '',
          isCustomCollege: true,
          customCollege: ''
        }));
      } else if (value === 'netaji-subhash-engineering') {
        // Handle predefined college as custom college
        setFormData(prev => ({
          ...prev,
          collegeId: '',
          isCustomCollege: true,
          customCollege: 'Netaji Subhash Engineering College'
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          collegeId: value,
          isCustomCollege: false,
          customCollege: ''
        }));
      }
      // Clear college-related errors
      setErrors(prev => ({
        ...prev,
        collegeId: '',
        customCollege: ''
      }));
    } else {
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
      
      // Special handling for customCollege field - also clear collegeId error
      if (name === 'customCollege') {
        setErrors(prev => ({
          ...prev,
          customCollege: '',
          collegeId: ''
        }));
      }
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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.collegeId && !formData.isCustomCollege) {
      newErrors.collegeId = 'Please select a college';
    }
    
    if (formData.isCustomCollege && !formData.customCollege.trim()) {
      newErrors.customCollege = 'Please enter your college name';
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
      const { confirmPassword, isCustomCollege, ...baseData } = formData;
      
      // Prepare submission data based on college selection
      const submitData = {
        ...baseData,
        // Use custom college name if selected, otherwise use selected college ID
        collegeId: formData.isCustomCollege ? null : formData.collegeId,
        collegeName: formData.isCustomCollege ? formData.customCollege : null
      };
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect based on role
        const userRole = data.data.user.role;
        switch (userRole) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'alumni':
            navigate('/alumni-dashboard');
            break;
          case 'student':
            navigate('/student-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Join Alumni Connect</h1>
            <p className="register-subtitle">Create your account and start connecting</p>
          </div>

          {errors.submit && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Role *</label>
              <div className="input-wrapper">
                <span className="input-icon">🎭</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="student">Student</option>
                  <option value="alumni">Alumni</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* College */}
            <div className="form-group">
              <label className="form-label">College *</label>
              <div className="input-wrapper">
                <span className="input-icon">🏫</span>
                <select
                  name="collegeId"
                  value={formData.isCustomCollege ? 'custom' : formData.collegeId}
                  onChange={handleChange}
                  className={`form-select ${errors.collegeId ? 'error' : ''}`}
                >
                  <option value="">Select your college...</option>
                  <option value="netaji-subhash-engineering">Netaji Subhash Engineering College</option>
                  {colleges.map(college => (
                    <option key={college._id} value={college._id}>
                      {college.name}
                    </option>
                  ))}
                  <option value="custom">Other (Type manually)</option>
                </select>
              </div>
              {errors.collegeId && <p className="error-message">{errors.collegeId}</p>}
              
              {/* Custom College Input */}
              {formData.isCustomCollege && (
                <div className="input-wrapper" style={{ marginTop: '10px' }}>
                  <span className="input-icon">✏️</span>
                  <input
                    type="text"
                    name="customCollege"
                    value={formData.customCollege}
                    onChange={handleChange}
                    placeholder="Enter your college name..."
                    className={`form-input ${errors.customCollege ? 'error' : ''}`}
                  />
                </div>
              )}
              {errors.customCollege && <p className="error-message">{errors.customCollege}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>

            <p className="auth-link">
              Already have an account?{' '}
              <Link to="/login" className="auth-link-button">
                Sign in here
              </Link>
            </p>
          </form>
        </div>

        <div className="register-illustration">
          <div className="illustration-content">
            <div className="floating-icon">🌟</div>
            <div className="floating-icon">🚀</div>
            <div className="floating-icon">💼</div>
            <h3>Start Your Journey</h3>
            <p>Join a community of successful alumni and ambitious students</p>
            <div className="benefits-list">
              <div className="benefit">✨ Professional Networking</div>
              <div className="benefit">📈 Career Growth</div>
              <div className="benefit">🎯 Mentorship Opportunities</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .register-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1100px;
          width: 100%;
          gap: 3rem;
          align-items: center;
        }

        .register-card {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          max-height: 90vh;
          overflow-y: auto;
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .register-subtitle {
          color: #666;
          margin: 0;
          font-size: 1.1rem;
        }

        .error-alert {
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          z-index: 1;
          font-size: 1.2rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f9fafb;
          outline: none;
        }

        .form-select {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f9fafb;
          outline: none;
          cursor: pointer;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-input.error,
        .form-select.error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin: 0.5rem 0 0 0;
          font-weight: 500;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-link {
          text-align: center;
          color: #6b7280;
          margin: 0;
        }

        .auth-link-button {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .auth-link-button:hover {
          color: #764ba2;
        }

        .register-illustration {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .illustration-content {
          text-align: center;
          color: white;
          position: relative;
        }

        .illustration-content h3 {
          font-size: 2.5rem;
          margin: 2rem 0 1rem 0;
          font-weight: bold;
        }

        .illustration-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0 0 2rem 0;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }

        .benefit {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          font-weight: 500;
        }

        .floating-icon {
          font-size: 3rem;
          position: absolute;
          animation: float 3s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: -2rem;
          left: -2rem;
          animation-delay: 0s;
        }

        .floating-icon:nth-child(2) {
          top: -1rem;
          right: -2rem;
          animation-delay: 1s;
        }

        .floating-icon:nth-child(3) {
          bottom: -2rem;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 768px) {
          .register-container {
            grid-template-columns: 1fr;
          }
          
          .register-illustration {
            display: none;
          }
          
          .register-card {
            padding: 2rem;
            max-height: none;
          }
          
          .register-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;