import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      console.log('Attempting login with:', { email: formData.email });
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        const userRole = data.data.user.role;
        console.log('User role:', userRole);
        
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
        setErrors({ submit: data.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Network error. Please check if the server is running.' });
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    background: 'rgba(249, 250, 251, 0.8)',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    marginBottom: '20px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
          }}>
            AC
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Welcome Back
          </h1>
          <p style={{color: '#6b7280', fontSize: '14px'}}>
            Sign in to your Alumni Connect account
          </p>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderLeft: '4px solid #ef4444',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '0 8px 8px 0',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            {errors.submit}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label style={{
              display: 'block',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <div style={{position: 'relative'}}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#9ca3af'
              }}>
                📧
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? '#ef4444' : '#e5e7eb',
                  background: errors.email ? 'rgba(254, 242, 242, 0.8)' : 'rgba(249, 250, 251, 0.8)'
                }}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>❌</span>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{
              display: 'block',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{position: 'relative'}}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#9ca3af'
              }}>
                🔒
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.password ? '#ef4444' : '#e5e7eb',
                  background: errors.password ? 'rgba(254, 242, 242, 0.8)' : 'rgba(249, 250, 251, 0.8)'
                }}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>❌</span>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{textAlign: 'center'}}>
            <p style={{color: '#6b7280', fontSize: '14px'}}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Register here
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🔑</span>
            Demo Credentials
          </h4>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '12px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                color: '#6b7280',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                📚 Test Student:
              </span>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({...prev, email: 'testuser@example.com'}))}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
                title="Click to auto-fill"
              >
                testuser@example.com
              </button>
            </div>
            <div style={{textAlign: 'center'}}>
              <span style={{color: '#6b7280', fontSize: '14px'}}>Password: </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, password: 'password123'}))}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
                title="Click to auto-fill"
              >
                password123
              </button>
            </div>
          </div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            padding: '8px'
          }}>
            💡 <strong>1,420 users</strong> in database | All use password: <strong>password123</strong>
            <br />
            <span style={{color: '#3b82f6'}}>Click credentials above to auto-fill</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{marginTop: '24px', textAlign: 'center'}}>
          <p style={{fontSize: '12px', color: '#9ca3af'}}>
            © 2025 Alumni Connect. Secure & Trusted Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;