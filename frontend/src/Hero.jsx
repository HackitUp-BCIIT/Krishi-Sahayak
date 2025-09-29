import React from 'react';
import './Home.css'; // Uses the same CSS file

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Your Personal AI Farming Companion</h1>
          <p className="hero-subtitle">Get personalized advice, track your crops, and boost your yield with AI-powered insights tailored for your farm.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Start Chatting Now</button>
            <button className="btn btn-secondary">Watch Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;