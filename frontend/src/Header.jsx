import React from 'react';
import './Home.css'; // Uses the same CSS file for shared styles

const Header = ({ onSwitchToLogin, onSwitchToView, currentView, user }) => {
  const navItems = [
    { name: 'Home', view: 'home' },
    { name: 'Chat AI', view: 'chat-ai' },
    { name: 'About Us', view: 'about-us' },
    { name: 'Government Schemes', view: 'schemes' },
    { name: 'Contact Us', view: 'contact-us' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    onSwitchToLogin(); // Redirect to login view
  };

  return (
    <header className="main-header">
      <div className="logo-text">Krishi Sahayak</div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`nav-item ${currentView === item.view ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onSwitchToView(item.view);
            }}
          >
            {item.name}
          </a>
        ))}
      </nav>


      {/* ✅ Show Login/Signup only if user is not logged in */}
      {!user && currentView !== 'login' && currentView !== 'signup' && (
        <button className="login-signup-btn" onClick={onSwitchToLogin}>
          Login
        </button>
      )}

      {/* ✅ Show user name and logout if logged in */}
      {user && (
        <div className="user-info">
          <span className="user-greeting">Hello, {user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};

export default Header;
