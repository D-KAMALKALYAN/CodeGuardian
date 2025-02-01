import React from 'react';
import './PageStyles.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <section className="hero-section">
        <h1>Web Application Security Intelligence</h1>
        <p>Empowering Developers with Comprehensive Vulnerability Insights</p>
      </section>

      <section className="mission-section">
        <h2 className="section-header">Our Mission</h2>
        <p>
          To provide cutting-edge security intelligence and proactive vulnerability 
          detection for web applications, enabling organizations to identify, 
          understand, and mitigate potential security risks before they can be exploited.
        </p>
      </section>

      <section className="key-features">
        <h2 className="section-header">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Comprehensive Scanning</h3>
            <p>Advanced detection mechanisms for OWASP Top 10 vulnerabilities</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Analysis</h3>
            <p>Instant vulnerability identification and risk assessment</p>
          </div>
          <div className="feature-card">
            <h3>Detailed Reporting</h3>
            <p>Comprehensive reports with actionable security recommendations</p>
          </div>
        </div>
      </section>

      <section className="methodology">
        <h2 className="section-header">Our Approach</h2>
        <div className="methodology-content">
          <div className="approach-step">
            <h3>Discovery</h3>
            <p>Comprehensive web application vulnerability identification</p>
          </div>
          <div className="approach-step">
            <h3>Analysis</h3>
            <p>In-depth risk assessment and vulnerability classification</p>
          </div>
          <div className="approach-step">
            <h3>Recommendation</h3>
            <p>Strategic mitigation strategies and remediation guidance</p>
          </div>
        </div>
      </section>

      <section className="technology-stack">
        <h2 className="section-header">Technology Stack</h2>
        <div className="stack-icons">
          <div className="tech-item">HTML5</div>
          <div className="tech-item">CSS3</div>
          <div className="tech-item">React</div>
          <div className="tech-item">Node.js</div>
          <div className="tech-item">Express.js</div>
          <div className="tech-item">MongoDB</div>

        </div>
      </section>

      <section className="contact-cta">
        <h2 className="section-header">Get In Touch</h2>
        <p>Need more information about web application security?</p>
        <button className="contact-button">Contact Us</button>
      </section>
    </div>
  );
};

export default AboutPage;