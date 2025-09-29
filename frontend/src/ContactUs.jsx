import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './ContactUs.css'; // We will create this CSS file next

const ContactUs = ({ onSwitchToLogin, onSwitchToView, currentView }) => {
  return (
    <div className="contact-page-container">
      <Header
        onSwitchToLogin={onSwitchToLogin}
        onSwitchToView={onSwitchToView}
        currentView={currentView}
      />

      <main className="contact-main-content">
        <section className="contact-header-section">
          <h1>Contact Us</h1>
          <p>We're here to help you. Reach out to us through the options below.</p>
        </section>

        <section className="contact-body-section">
          {/* Left Side: Contact Information */}
          <div className="contact-info-block">
            <h2>Contact Information</h2>
            <p>Our support team is available 24/7 to assist you with any questions or issues.</p>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <h3 className="info-title">Helpline Numbers</h3>
                <p>For immediate assistance.</p>
                <p className="info-detail">Kerala Agricultural University [+91-487-2438011]</p>
                <p className="info-detail">Developer Contact [9958739706]</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">✉</span>
              <div>
                <h3 className="info-title">Email Support</h3>
                <p>For any queries, please email us.</p>
                <a href="mailto:support@krishisayahak.com" className="info-detail email-link">
                  support@krishisayahak.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Message Form */}
          <div className="contact-form-block">
            <h2>Send us a message</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input type="email" id="email" name="email" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" name="message" rows="5"></textarea>
              </div>
              <button type="submit" className="submit-feedback-btn">
                Submit Feedback
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer onSwitchToView={onSwitchToView} />
    </div>
  );
};

export default ContactUs;