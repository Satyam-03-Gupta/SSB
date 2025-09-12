import { useEffect, useState } from 'react';

export default function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (!adminToken || !loginTime) {
        redirectToLogin();
        return;
      }

      // Check if session expired (24 hours)
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      const currentTime = Date.now();
      const timeDiff = currentTime - parseInt(loginTime);

      if (timeDiff > sessionDuration) {
        // Session expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminLoginTime');
        redirectToLogin();
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    const redirectToLogin = () => {
      setIsAuthenticated(false);
      setIsLoading(false);
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    };

    checkAdminAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Verifying credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
}