import React, { useState, useEffect } from 'react';
import LoginSignup from './LoginSignup';
import Signup from './Signup';
import Home from './Home';
import AboutUs from './AboutUs';
import Schemes from './Schemes';
import ContactUs from './ContactUs';
import ChatAI from './ChatAI';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);

  // Load user data from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const switchView = (view) => {
    setCurrentView(view);
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  const switchToSignup = () => {
    setCurrentView('signup');
  };

  // ✅ Update user after login/signup
  const handleLoginOrSignup = (view) => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setCurrentView(view);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setCurrentView('login');
  };

  const pageProps = {
    onSwitchToLogin: switchToLogin,
    onSwitchToSignup: switchToSignup,
    onSwitchToView: switchView,
    onLogout: handleLogout,
    currentView,
    user,
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home {...pageProps} />;
      case 'about-us':
        return <AboutUs {...pageProps} />;
      case 'schemes':
        return <Schemes {...pageProps} />;
      case 'contact-us':
        return <ContactUs {...pageProps} />;
      case 'chat-ai':
        return <ChatAI {...pageProps} />;
      case 'login':
        return (
          <LoginSignup
            onSwitchToSignup={switchToSignup}
            onSwitchToView={(view) => {
              const storedUser = localStorage.getItem('userData');
              if (storedUser) setUser(JSON.parse(storedUser)); // ✅ update user state
              switchView(view);
            }}
          />
        );

      case 'signup':
        return (
          <Signup
            onSwitchToLogin={switchToLogin}
            onSwitchToView={(view) => {
              const storedUser = localStorage.getItem('userData');
              if (storedUser) setUser(JSON.parse(storedUser)); // ✅ update user state
              switchView(view);
            }}
          />
        );

      default:
        return <Home {...pageProps} />;
    }
  };

  return <div className="App">{renderView()}</div>;
}

export default App;