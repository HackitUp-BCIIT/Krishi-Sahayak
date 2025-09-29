import React from 'react';
import './Home.css'; // Uses the same CSS file

const Footer = ({ onSwitchToView }) => { // <-- ACCEPT THE PROP
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="logo-text">AGRIADVISOR</p>
          <p className="address">
            Based in Bhubaneswar, Odisha, India.
          </p>
        </div>

        <div className="footer-links-group">
          <h5>Quicklinks</h5>
          {/* MAKE LINKS CLICKABLE */}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToView('home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToView('about-us'); }}>About Us</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToView('contact-us'); }}>Contact</a>
          <a href="#">FAQ</a>
        </div>

        <div className="footer-links-group">
          <h5>Resources</h5>
          <a href="#">Blog</a>
          <a href="#">Case Studies</a>
          <a href="#">Downloads</a>
        </div>

        <div className="footer-links-group">
          <h5>Support</h5>
          <a href="#">Help Center</a>
          <a href="#">Report a Bug</a>
          <a href="#">API Documentation</a>
        </div>

        <div className="footer-links-group">
          <h5>Legal</h5>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 AGRIADVISOR. All rights reserved.</p>
        <div className="social-icons">
            {/* Placeholder icons */}
            <span>T</span><span>F</span><span>I</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;