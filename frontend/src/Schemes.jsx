import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Schemes.css'; // We will create this CSS file next

// Dummy data to populate the page, similar to the image
const recentNews = [
  {
    imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjRplF3WGr67fZCBylA8M6woFmQzI8zoSCXA&s', // Placeholder
    title: 'Pest Control Advisory for Cotton Crops',
    description: 'Learn about effective pest management strategies for cotton crops to ensure a healthy yield.',
  },
  {
    imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBdUvgNdyP4Qq2KUsd1b9aiA-o4-0GXNhlkQ&s', // Placeholder
    title: 'Weather Alert: Heavy Rainfall Expected in Maharashtra',
    description: 'Stay informed about the upcoming heavy rainfall in Maharashtra and take necessary precautions to protect your crops.',
  },
  {
    imgSrc: 'https://img.khetivyapar.com/images/news/1747720514-smam-scheme-subsidy-on-agricultural-equipment-last-date-30-june-2025-655.jpg', // Placeholder
    title: 'Subsidy Updates for Small Farmers',
    description: 'Check out the latest subsidy schemes available for small farmers to support their agricultural activities.',
  },
];

const popularArticles = [
    {
        imgSrc: 'https://plantix.net/ar/assets/blog/blog-content/2021-11-15/wheat.jpg', // Placeholder
        title: 'Best Practices for Wheat Cultivation',
        description: 'Discover the best practices for cultivating wheat to maximize your harvest and improve crop quality.',
      },
      {
        imgSrc: 'https://www.indiafilings.com/learn/wp-content/uploads/2019/11/Micro-Irrigation-Fund.jpg', // Placeholder
        title: 'Government Schemes for Irrigation',
        description: 'Explore various government schemes that provide support for irrigation systems to ensure efficient water management.',
      },
]

const Schemes = ({ onSwitchToLogin, onSwitchToView, currentView }) => {
  return (
    <div className="schemes-page-container">
      <Header
        onSwitchToLogin={onSwitchToLogin}
        onSwitchToView={onSwitchToView}
        currentView={currentView}
      />

      <main className="schemes-content-main">
        {/* Page Header */}
        <section className="schemes-header">
          <h1>Latest government schemes</h1>
          <p>Past alerts, weather updates, and subsidy news for farmers.</p>
        </section>

        {/* Filters */}
        <section className="filters-section">
          <input type="search" placeholder="🔍 Search for articles..." className="search-bar" />
          <div className="filter-buttons">
            <span>Filter by:</span>
            <button className="filter-btn">Crop ▼</button>
            <button className="filter-btn">Scheme ▼</button>
            <button className="filter-btn">Location ▼</button>
          </div>
        </section>

        {/* Articles Section */}
        <section className="articles-section">
          <h2 className="section-title-schemes">Recent news</h2>
          <div className="schemes-grid">
            {recentNews.map((item, index) => (
              <div key={index} className="scheme-card">
                <img src={item.imgSrc} alt={item.title} className="scheme-card-img" />
                <div className="scheme-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="section-title-schemes">Popular Articles</h2>
           <div className="schemes-grid">
            {popularArticles.map((item, index) => (
              <div key={index} className="scheme-card">
                <img src={item.imgSrc} alt={item.title} className="scheme-card-img" />
                <div className="scheme-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination */}
        <nav className="pagination-container">
            <a href="#" className="page-link active">1</a>
            <a href="#" className="page-link">2</a>
            <a href="#" className="page-link">3</a>
            <span className="page-ellipsis">...</span>
            <a href="#" className="page-link">10</a>
            <a href="#" className="page-link">›</a>
        </nav>

      </main>

      <Footer onSwitchToView={onSwitchToView} />
    </div>
  );
};

export default Schemes;