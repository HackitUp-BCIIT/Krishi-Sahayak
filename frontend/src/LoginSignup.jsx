import React, { useState } from 'react';
import './LoginSignup.css';
import { SignInButton } from '@clerk/clerk-react';

const LoginSignup = ({ onSwitchToSignup, onSwitchToView }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        alert(`Welcome back, ${data.user.name}!`);

        // ✅ Redirect to home view
        if (onSwitchToView) onSwitchToView('home');
      } else {
        alert(`Login failed: ${data.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Back to Home */}
        <a
          href="#"
          className="back-to-home-link"
          onClick={(e) => {
            e.preventDefault();
            if (onSwitchToView) onSwitchToView('home');
          }}
        >
          ← Back to Home
        </a>

        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="logo-placeholder">🌱</div>
          <p className="app-name">AgriAdvisor</p>
          <h2 className="welcome-text">Welcome Back</h2>
          <p className="subtitle">Enter your credentials to access your account.</p>
        </div>

        {/* Manual Login Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <div className="password-header">
              <label htmlFor="password">Password</label>
              <a href="#" className="forgot-password-link">Forgot password?</a>
            </div>
            <div className="password-input-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="divider-or">Or continue with</div>

        {/* Clerk Social Login */}
        <div className="social-login-group">
          <SignInButton mode="modal" redirectUrl="/">
            <button className="social-button google-button">Google</button>
          </SignInButton>
          <SignInButton mode="modal" redirectUrl="/">
            <button className="social-button facebook-button">Facebook</button>
          </SignInButton>
        </div>

        {/* Signup Prompt */}
        <p className="signup-prompt">
          Don't have an account?
          <a
            href="#"
            className="signup-link"
            onClick={(e) => {
              e.preventDefault();
              if (onSwitchToSignup) onSwitchToSignup();
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
