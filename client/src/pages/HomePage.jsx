import React, { useState } from 'react';
import './PageStyles.css';

// Vulnerability data with details and links
const vulnerabilities = [
  {
    id: 1,
    title: 'Broken Access Control',
    description: 'Allows attackers to access unauthorized resources or functionalities.',
    moreInfoLink: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'
  },
  {
    id: 2,
    title: 'Cryptographic Failures',
    description: 'Sensitive data exposure due to weak or improper cryptography.',
    moreInfoLink: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'
  },
  {
    id: 3,
    title: 'Injection',
    description: 'Untrusted data can send malicious commands to interpreters.',
    moreInfoLink: 'https://owasp.org/Top10/A03_2021-Injection/'
  },
  {
    id: 4,
    title: 'Insecure Design',
    description: 'Lack of security controls and risk-based design patterns.',
    moreInfoLink: 'https://owasp.org/Top10/A04_2021-Insecure_Design/'
  },
  {
    id: 5,
    title: 'Security Misconfiguration',
    description: 'Improperly configured security settings and default configurations.',
    moreInfoLink: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
  },
  {
    id: 6,
    title: 'Vulnerable and Outdated Components',
    description: 'Risks from using software with known vulnerabilities.',
    moreInfoLink: 'https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/'
  },
  {
    id: 7,
    title: 'Identification and Authentication Failures',
    description: 'Weaknesses in user authentication mechanisms.',
    moreInfoLink: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'
  },
  {
    id: 8,
    title: 'Software and Data Integrity Failures',
    description: 'Lack of integrity checks in software updates and critical data.',
    moreInfoLink: 'https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/'
  },
  {
    id: 9,
    title: 'Security Logging and Monitoring Failures',
    description: 'Inadequate logging and monitoring of security events.',
    moreInfoLink: 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'
  },
  {
    id: 10,
    title: 'Server-Side Request Forgery (SSRF)',
    description: 'Vulnerability allowing attackers to send crafted requests from the server.',
    moreInfoLink: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/'
  }
];

const HomePage = () => {
  const [likedVulnerabilities, setLikedVulnerabilities] = useState([]);

  const toggleLike = (vulnerabilityId) => {
    setLikedVulnerabilities(prev => 
      prev.includes(vulnerabilityId)
        ? prev.filter(id => id !== vulnerabilityId)
        : [...prev, vulnerabilityId]
    );
  };

  return (
    <div className="home-container">
      <header className="page-header">
        <h1>Web Application Vulnerability Scanner</h1>
        <p>Comprehensive Analysis of OWASP Top 10 Security Risks</p>
      </header>

      <section className="vulnerabilities-grid">
        {vulnerabilities.map((vuln) => (
          <div key={vuln.id} className="vulnerability-card">
            <div className="vulnerability-content">
              <h3>{vuln.title}</h3>
              <p>{vuln.description}</p>
              <div className="card-actions">
                <a 
                  href={vuln.moreInfoLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="more-info-link"
                >
                  Read More
                </a>
                <button 
                  onClick={() => toggleLike(vuln.id)}
                  className={`like-button ${likedVulnerabilities.includes(vuln.id) ? 'liked' : ''}`}
                >
                  {likedVulnerabilities.includes(vuln.id) ? '✅' : '☐'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;