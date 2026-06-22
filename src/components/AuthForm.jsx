import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';

function AuthForm({ mode, onLogin }) {
  const navigate = useNavigate();
  const isSignin = mode === 'signin';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const payload = isSignin
        ? {
          email: formData.email,
          password: formData.password
        }
        : {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };

      const endpoint = isSignin ? '/auth/signin' : '/auth/signup';
      const response = await api.post(endpoint, payload);

      if (isSignin) {
        const { user, token } = response.data;

        if (!user || !token) {
          setMessage('Signin response is missing user or token');
          return;
        }

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        onLogin({ user, token });
        navigate('/profile', { replace: true });
      } else {
        setMessage('Signup successful. Please sign in.');
        navigate('/signin', { replace: true });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authCard">
      <h1>{isSignin ? 'Sign In' : 'Sign Up'}</h1>
      <p>{isSignin ? 'Welcome back. Sign in to continue.' : 'Create a new account to get started.'}</p>
      <form onSubmit={submit} className="authForm">
        {!isSignin && (
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isSignin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {isSignin ? (
        <p>
          No account? <Link to="/signup">Create account</Link>
        </p>
      ) : (
        <p>
          Already registered? <Link to="/signin">Sign in</Link>
        </p>
      )}
    </div>
  );
}

export default AuthForm;