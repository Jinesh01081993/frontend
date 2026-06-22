import React from 'react';
import AuthForm from '../components/AuthForm.jsx';
import ServiceDown from '../components/ServiceDown.jsx';

function AuthPage({ mode, authStatus, onLogin }) {
  if (authStatus === 'DOWN') {
    return <ServiceDown serviceName="Authentication Service" />;
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <AuthForm mode={mode} onLogin={onLogin} />
    </div>
  );
}

export default AuthPage;