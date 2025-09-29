import React, { useState } from 'react';
import './LoginSignup.css';

const Signup = ({ onSwitchToLogin, onSwitchToView }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        alert(`Welcome, ${data.user.name}! Your account has been created.`);

        // ✅ Redirect to home view
        if (onSwitchToView) onSwitchToView('home');
      } else {
        alert(`Signup failed: ${data.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
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

        <div className="welcome-section">
          <div className="logo-placeholder">🌱</div>
          <p className="app-name">AgriAdvisor</p>
          <h2 className="welcome-text">Join AgriAdvisor</h2>
          <p className="subtitle">Create an account to manage your farm efficiently.</p>
        </div>

        <form className="login-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a strong password"
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
            Sign Up
          </button>
        </form>

        <p className="signup-prompt">
          Already have an account?
          <a
            href="#"
            className="signup-link"
            onClick={(e) => {
              e.preventDefault();
              if (onSwitchToLogin) onSwitchToLogin();
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
