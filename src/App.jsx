import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { api } from './api/client.js';

function readAuthFromStorage() {
  const userText = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  return {
    user: userText ? JSON.parse(userText) : null,
    token
  };
}

function App() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(readAuthFromStorage);
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [gatewayDown, setGatewayDown] = useState(false);

  const isLoggedIn = Boolean(auth.user && auth.token);

  const authStatus = useMemo(() => {
    return health?.services?.find((item) => item.name === 'auth')?.status || 'UNKNOWN';
  }, [health]);

  const refreshHealth = async () => {
    setLoadingHealth(true);
    try {
      const response = await api.get('/health/all');
      setGatewayDown(false);
      setHealth(response.data);
    } catch {
      setHealth(null);
      setGatewayDown(true);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    refreshHealth();
  }, []);

  const handleLogin = ({ user, token }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    setAuth({ user, token });
    navigate('/profile', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setAuth({ user: null, token: null });
    navigate('/signin', { replace: true });
  };

  return (
    <div className="appShell">
      <header className="topbar">
        <Link to="/" className="brand">
          Microservice Health App
        </Link>

        <nav className="navLinks">
          <Link to="/">Health</Link>

          {isLoggedIn && <Link to="/profile">Profile</Link>}

          {!isLoggedIn && <Link to="/signin">Sign In</Link>}
          {!isLoggedIn && <Link to="/signup">Sign Up</Link>}

          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              health={health}
              loading={loadingHealth}
              onRefresh={refreshHealth}
              gatewayDown={gatewayDown}
            />
          }
        />

        <Route
          path="/signin"
          element={
            isLoggedIn ? (
              <Navigate to="/profile" replace />
            ) : (
              <AuthPage
                mode="signin"
                authStatus={authStatus}
                onLogin={handleLogin}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/profile" replace />
            ) : (
              <AuthPage
                mode="signup"
                authStatus={authStatus}
                onLogin={handleLogin}
              />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <ProfilePage
                currentUser={auth.user}
                token={auth.token}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;