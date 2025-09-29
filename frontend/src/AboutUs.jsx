import React from 'react';
import Header from './Header';
import Footer from './Footer'; // Assuming you want the footer as well
import './AboutUs.css'; // Import new CSS for content blocks

const AboutUs = ({ onSwitchToLogin, onSwitchToView, currentView }) => {
  return (
    <div className="about-us-container">
      {/* Pass all necessary props to the Header */}
      <Header
        onSwitchToLogin={onSwitchToLogin}
        onSwitchToView={onSwitchToView}
        currentView={currentView}
      />

      <main className="about-content-main">
        <section className="about-header-section">
          <h1 className="about-title">About Us</h1>
          <p className="about-subtitle">A Digital Krishi Officer - always available, always learning, and always farmer-first.</p>
        </section>

        <section className="about-mission-section">
          {/* Mission Block */}
          <div className="content-block">
            <h2 className="block-title">Our Mission</h2>
            <p className="block-text">
              Our mission is to empower farmers with timely and accurate information, making farming more efficient and sustainable. KRISHI SAYAHAK is an AI-powered Digital Krishi Officer designed to provide farmers with instant, reliable, and personalized advice in their native languages through voice, text, or image queries, ensuring accessibility for all.
            </p>
          </div>

          {/* Story Block */}
          <div className="content-block">
            <h2 className="block-title">Our Story</h2>
            <p className="block-text">
              KRISHI SAYAHAK was born out of a need to bridge the information gap in the agricultural sector. Recognizing the challenges farmers face in accessing reliable advice, we developed a platform that leverages cutting-edge AI to deliver personalized guidance. Our journey is driven by a deep-seated commitment to support farmers and enhance their livelihoods through technology.
            </p>
          </div>

          {/* Team Block */}
          <div className="content-block">
            <h2 className="block-title">Our Team & Affiliations</h2>
            <p className="block-text">
              Our team comprises experienced AI developers, agricultural experts, and dedicated professionals passionate about making a difference in the farming community. We are proud to work closely with Krishibhavans and receive support from government initiatives to ensure our platform meets the highest standards of accuracy and relevance, providing farmers with the most up-to-date and effective advice.
            </p>
          </div>

          <button
            className="contact-us-btn"
            onClick={() => onSwitchToView('contact-us')} // <-- MAKE BUTTON CLICKABLE
          >
            Contact Us
          </button>
        </section>
      </main>

      {/* Pass prop to Footer */}
      <Footer onSwitchToView={onSwitchToView} />
    </div>
  );
};

export default AboutUs;