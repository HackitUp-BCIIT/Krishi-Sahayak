import React from 'react';
import Header from './Header';
// NOTE: Assuming Hero content is inlined or handled by Hero component
import Hero from './Hero'; 
import './Home.css';

// ----------------------------------------------------
// A simple component representing the functional parts of your Hero section
// This is required to make the "Start Chatting Now" button work.
// ----------------------------------------------------
const HeroFunctional = ({ onSwitchToView }) => {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">Your Personal AI Farming Companion</h1>
                <p className="hero-subtitle">
                    Get personalized advice, track your crops, and boost your yield with AI-powered insights tailored for your farm.
                </p>
                <div className="hero-cta">
                    <button 
                        className="start-chatting-button" 
                        // FIX: Changed 'chat' to 'chat-ai' to match App.jsx case
                        onClick={() => onSwitchToView('chat-ai')} 
                    >
                        Start Chatting Now
                    </button>
                    <button className="watch-demo-button">
                        Watch Demo
                    </button>
                </div>
            </div>
        </section>
    );
};
// ----------------------------------------------------


const Home = ({ onSwitchToLogin, onSwitchToView, currentView, user }) => {
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        onSwitchToLogin(); // Redirect to login view
    };

    return (
        <div className="home-container">
            <Header 
                onSwitchToLogin={onSwitchToLogin}
                onSwitchToView={onSwitchToView}
                currentView={currentView}
            />

            <main>
                {/* FIX: Pass the onSwitchToView function to the Hero component */}
                <HeroFunctional onSwitchToView={onSwitchToView} />

                {/* Simple Path to Smarter Farming Section */}
                <section className="section simple-path">
                    <h2 className="section-title">A Simple Path to Smarter Farming</h2>
                    <p className="section-subtitle">Farming simplified. Artificial Intelligence at your fingertips.</p>
                    <div className="path-cards">
                        <div className="path-card">
                            <div className="icon-circle">🔍</div>
                            <h3>1. Ask Your Question:</h3>
                            <p>Simply type or speak your problem in local languages.</p>
                        </div>
                        <div className="path-card">
                            <div className="icon-circle">💡</div>
                            <h3>2. Receive AI Advice:</h3>
                            <p>Get personalized, immediate, and actionable solutions.</p>
                        </div>
                        <div className="path-card">
                            <div className="icon-circle">📈</div>
                            <h3>3. Grow with Confidence:</h3>
                            <p>Implement the advice and track your progress daily.</p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="section features">
                    <h2 className="section-title">Features Designed for the Modern Farmer</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h4>🌍 Multi-Language Support</h4>
                            <p>Advice in your local language without complication.</p>
                        </div>
                        <div className="feature-item">
                            <h4>💬 Voice, Text, & Image</h4>
                            <p>Interact with the AI using any medium you prefer.</p>
                        </div>
                        <div className="feature-item">
                            <h4>🧑‍💻 Personalized Advice</h4>
                            <p>Solutions tailored to your soil, crop, and location.</p>
                        </div>
                        <div className="feature-item">
                            <h4>⏰ 24/7 Accessibility</h4>
                            <p>The AI is always awake to answer your queries.</p>
                        </div>
                    </div>
                    <div className="carousel-nav">
                        <span className="nav-dot active"></span>
                        <span className="nav-dot"></span>
                    </div>
                </section>

                {/* Impact Section */}
                <section className="section impact">
                    <h2 className="section-title">Measurable Impact on Farming</h2>
                    <div className="impact-grid">
                        <div className="impact-card light-green">
                            <p className="impact-value">+20%</p>
                            <p className="impact-label">Increase in Crop Yield</p>
                        </div>
                        <div className="impact-card light-green">
                            <p className="impact-value">-15%</p>
                            <p className="impact-label">Reduction in Operating Costs</p>
                        </div>
                        <div className="impact-card light-green">
                            <p className="impact-value">+25%</p>
                            <p className="impact-label">Savings through Smart Water Use</p>
                        </div>
                    </div>
                </section>

                {/* Stories Section */}
                <section className="section stories">
                    <h2 className="section-title">Stories of Growth and Community</h2>
                    <p className="section-subtitle">Hear directly from the farmers who have seen real benefits with AgriAdvisor.</p>
                    <div className="stories-grid">
                        <div className="story-card dark-green">
                            <div className="story-icon">🌿</div>
                            <h4>From Struggle to Success</h4>
                            <p>How one farmer overcame crop disease and saw a record harvest.</p>
                            <p className="story-author">- Rajesh, Kerala</p>
                        </div>
                        <div className="story-card dark-green">
                            <div className="story-icon">💻</div>
                            <h4>Transforming with AI</h4>
                            <p>A young farmer's journey adopting AI in every farming decision.</p>
                            <p className="story-author">- Shanti, Punjab</p>
                        </div>
                        <div className="story-card dark-green">
                            <div className="story-icon">🌾</div>
                            <h4>Harvesting Bounty</h4>
                            <p>The story of how one family grew mindful and truly organic.</p>
                            <p className="story-author">- Vijay, Haryana</p>
                        </div>
                    </div>
                </section>

                {/* Partners Section */}
                <section className="section partners">
                    <h2 className="section-title">Our Valued Partners & Supporters</h2>
                    <p className="section-subtitle">Dedicated to advancing agriculture with smart technology.</p>
                    <div className="partner-logos">
                        <p>Logo A</p>
                        <p>Logo B</p>
                        <p>Logo C</p>
                        <p>Logo D</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;