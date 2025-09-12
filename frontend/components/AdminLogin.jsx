import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaShieldAlt, FaLock } from 'react-icons/fa';
import '../src/App.css';

export default function AdminLogin() {
  // Hide navbar and setup full screen for admin pages
  useEffect(() => {
    // Hide all possible navbar elements
    const navbar = document.querySelector('nav');
    const header = document.querySelector('header');
    const body = document.body;
    const html = document.documentElement;
    
    // Store original styles
    const originalBodyStyle = body.style.cssText;
    const originalHtmlStyle = html.style.cssText;
    
    // Apply admin page styles
    body.style.cssText = 'margin: 0; padding: 0; overflow: hidden; height: 100vh;';
    html.style.cssText = 'margin: 0; padding: 0; height: 100vh;';
    
    if (navbar) navbar.style.display = 'none';
    if (header) header.style.display = 'none';
    
    return () => {
      // Restore original styles
      body.style.cssText = originalBodyStyle;
      html.style.cssText = originalHtmlStyle;
      if (navbar) navbar.style.display = 'flex';
      if (header) header.style.display = 'block';
    };
  }, []);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Check if admin is already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      window.location.href = '/admin/dashboard';
    }
  }, []);

  // Handle lockout timer
  useEffect(() => {
    if (isBlocked && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsBlocked(false);
      setAttempts(0);
    }
  }, [isBlocked, timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isBlocked) return;
    
    setLoading(true);
    setError('');

    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {

      const adminToken = btoa(`admin_${Date.now()}_${Math.random()}`);
      localStorage.setItem('adminToken', adminToken);
      localStorage.setItem('adminLoginTime', Date.now().toString());
      
      window.location.href = '/admin/dashboard';
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsBlocked(true);
        setTimeLeft(300); // 5 minutes lockout
        setError('Too many failed attempts. Account locked for 5 minutes.');
      } else {
        setError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
      }
    }
    
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <FaShieldAlt className="admin-icon" />
          <h2>Admin Access</h2>
          <p>Secure Administrative Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              disabled={isBlocked || loading}
              placeholder="Enter admin email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                disabled={isBlocked || loading}
                placeholder="Enter admin password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isBlocked || loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className={`error-message ${isBlocked ? 'blocked' : ''}`}>
              <FaLock />
              {error}
              {isBlocked && <div className="countdown">Time remaining: {formatTime(timeLeft)}</div>}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={isBlocked || loading || !credentials.email || !credentials.password}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : isBlocked ? (
              'Account Locked'
            ) : (
              'Secure Login'
            )}
          </button>
        </form>

        <div className="security-info">
          <div className="security-item">
            <span>🔒</span>
            <small>SSL Encrypted Connection</small>
          </div>
          <div className="security-item">
            <span>🛡️</span>
            <small>Multi-layer Security</small>
          </div>
          <div className="security-item">
            <span>⏰</span>
            <small>Session Timeout Protection</small>
          </div>
        </div>
      </div>
    </div>
  );
}