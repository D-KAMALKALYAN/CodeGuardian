// Vulnerability data with details and links
const vulnerabilities = [
  {
    id: 1,
    title: 'Broken Access Control',
    description: 'Allows attackers to access unauthorized resources or functionalities.',
    moreInfoLink: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/',
    apiName: 'access_control_issues'
  },
  {
    id: 2,
    title: 'Cryptographic Failures',
    description: 'Sensitive data exposure due to weak or improper cryptography.',
    moreInfoLink: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/',
    apiName: 'sensitive_data_exposure'
  },
  {
    id: 3,
    title: 'Injection',
    description: 'Untrusted data can send malicious commands to interpreters.',
    moreInfoLink: 'https://owasp.org/Top10/A03_2021-Injection/',
    apiName: 'sql_injection'
  },
  {
    id: 4,
    title: 'Insecure Design',
    description: 'Lack of security controls and risk-based design patterns.',
    moreInfoLink: 'https://owasp.org/Top10/A04_2021-Insecure_Design/',
    apiName: 'insecure_design'
  },
  {
    id: 5,
    title: 'Security Misconfiguration',
    description: 'Improperly configured security settings and default configurations.',
    moreInfoLink: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/',
    apiName: 'security_misconfiguration'
  },
  {
    id: 6,
    title: 'Vulnerable and Outdated Components',
    description: 'Risks from using software with known vulnerabilities.',
    moreInfoLink: 'https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/',
    apiName: 'vulnerable_components'
  },
  {
    id: 7,
    title: 'Identification and Authentication Failures',
    description: 'Weaknesses in user authentication mechanisms.',
    moreInfoLink: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/',
    apiName: 'broken_authentication'
  },
  {
    id: 8,
    title: 'Software and Data Integrity Failures',
    description: 'Lack of integrity checks in software updates and critical data.',
    moreInfoLink: 'https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/',
    apiName: 'insecure_deserialization'
  },
  {
    id: 9,
    title: 'Security Logging and Monitoring Failures',
    description: 'Inadequate logging and monitoring of security events.',
    moreInfoLink: 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/',
    apiName: 'insufficient_logging'
  },
  {
    id: 10,
    title: 'Server-Side Request Forgery (SSRF)',
    description: 'Vulnerability allowing attackers to send crafted requests from the server.',
    moreInfoLink: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/',
    apiName: 'ssrf'
  }
];

// Additional vulnerabilities for extended scans (SANS Top 25)
const sansVulnerabilities = [
  {
    id: 11,
    title: 'Cross-Site Scripting (XSS)',
    description: 'Attackers inject client-side scripts into web pages viewed by others.',
    apiName: 'xss',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/79.html'
  },
  {
    id: 12,
    title: 'Cross-Site Request Forgery (CSRF)',
    description: 'Forces authenticated users to execute unwanted actions.',
    apiName: 'csrf',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/352.html'
  },
  {
    id: 13,
    title: 'XML External Entities (XXE)',
    description: 'Processing of untrusted XML input with weakly configured XML parsers.',
    apiName: 'xxe',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/611.html'
  },
  {
    id: 14,
    title: 'Path Traversal',
    description: 'Improper sanitization of user-supplied paths allowing access to files outside intended directory.',
    apiName: 'path_traversal',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/22.html'
  },
  {
    id: 15,
    title: 'Integer Overflow or Wraparound',
    description: 'Arithmetic operations result in value that exceeds maximum size of integer type.',
    apiName: 'integer_overflow',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/190.html'
  },
  {
    id: 16,
    title: 'Unrestricted Upload of File with Dangerous Type',
    description: 'Allows upload of files that can be automatically processed, creating security vulnerabilities.',
    apiName: 'file_upload',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/434.html'
  },
  {
    id: 17,
    title: 'Use of Hard-coded Credentials',
    description: 'Embedding credentials (such as passwords) in source code.',
    apiName: 'hardcoded_credentials',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/798.html'
  },
  {
    id: 18,
    title: 'Improper Neutralization of Special Elements in Output',
    description: 'Failure to properly neutralize special elements in output used by downstream components.',
    apiName: 'output_neutralization',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/116.html'
  },
  {
    id: 19,
    title: 'Missing Authentication for Critical Function',
    description: 'Web application does not authenticate users before granting access to sensitive functions.',
    apiName: 'missing_authentication',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/306.html'
  },
  {
    id: 20,
    title: 'Buffer Overflow',
    description: 'Writing data beyond allocated memory boundaries, potentially allowing code execution.',
    apiName: 'buffer_overflow',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/120.html'
  },
  {
    id: 21,
    title: 'Improper Restriction of Operations within Memory Buffer',
    description: 'Operations on memory buffer with improper length validation.',
    apiName: 'memory_buffer',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/119.html'
  },
  {
    id: 22,
    title: 'Uncontrolled Resource Consumption',
    description: 'Using excessive resources leading to denial of service.',
    apiName: 'resource_consumption',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/400.html'
  },
  {
    id: 23,
    title: 'Improper Input Validation',
    description: 'When software does not validate or incorrectly validates input.',
    apiName: 'input_validation',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/20.html'
  },
  {
    id: 24,
    title: 'Race Condition',
    description: 'Multiple processes accessing shared data concurrently can lead to unpredictable behavior.',
    apiName: 'race_condition',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/362.html'
  },
  {
    id: 25,
    title: 'Improper Certificate Validation',
    description: 'Failure to properly validate a certificate, enabling man-in-the-middle attacks.',
    apiName: 'certificate_validation',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/295.html'
  },
  {
    id: 26,
    title: 'Improper Privilege Management',
    description: 'Improper assignment or handling of privileges and permissions.',
    apiName: 'privilege_management',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/269.html'
  },
  {
    id: 27,
    title: 'Incorrect Authorization',
    description: 'Software does not properly verify if access should be granted to a resource.',
    apiName: 'authorization',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/285.html'
  },
  {
    id: 28,
    title: 'Use After Free',
    description: 'Referencing memory after it has been freed can lead to program crashes or execution.',
    apiName: 'use_after_free',
    moreInfoLink: 'https://cwe.mitre.org/data/definitions/416.html'
  }
];

// Advanced vulnerabilities for specialized scans
const advancedVulnerabilities = [
  {
    id: 29,
    title: 'Host Header Injection',
    description: 'Manipulating the Host header in HTTP requests to bypass security controls or redirect users.',
    apiName: 'host_header_injection',
    moreInfoLink: 'https://portswigger.net/web-security/host-header'
  },
  {
    id: 30,
    title: 'JWT Vulnerabilities',
    description: 'Issues with implementation of JSON Web Tokens leading to authentication bypasses.',
    apiName: 'jwt_vulnerabilities',
    moreInfoLink: 'https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/'
  },
  {
    id: 31,
    title: 'Prototype Pollution',
    description: 'Manipulation of JavaScript object prototype chains leading to property injection attacks.',
    apiName: 'prototype_pollution',
    moreInfoLink: 'https://github.com/BlackFan/client-side-prototype-pollution'
  },
  {
    id: 32,
    title: 'NoSQL Injection',
    description: 'Attacks against NoSQL databases by injecting malicious queries.',
    apiName: 'nosql_injection',
    moreInfoLink: 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection'
  },
  {
    id: 33,
    title: 'Server Side Template Injection',
    description: 'Injecting template directives to execute code when templates are rendered server-side.',
    apiName: 'server_side_template_injection',
    moreInfoLink: 'https://portswigger.net/research/server-side-template-injection'
  }
];

// Predefined scan profiles
const scanProfiles = {
  owasp: {
    name: 'OWASP Top 10 Scan',
    description: 'Comprehensive scan based on OWASP Top 10 vulnerabilities',
    vulnerabilities: vulnerabilities.filter(v => v.apiName).map(v => v.apiName)
  },
  sans: {
    name: 'SANS Top 25 Scan',
    description: 'Extended scan based on SANS Top 25 programming errors',
    vulnerabilities: [...vulnerabilities.filter(v => v.apiName).map(v => v.apiName), 
                     ...sansVulnerabilities.map(v => v.apiName)]
  },
  advanced: {
    name: 'Advanced Vulnerabilities Scan',
    description: 'Specialized scan for sophisticated security vulnerabilities',
    vulnerabilities: advancedVulnerabilities.map(v => v.apiName)
  },
  custom: {
    name: 'Custom Scan',
    description: 'Select specific vulnerabilities to scan for'
  }
};

// All vulnerabilities combined for custom scan selection
const allVulnerabilities = [...vulnerabilities, ...sansVulnerabilities, ...advancedVulnerabilities];

export { vulnerabilities, sansVulnerabilities, advancedVulnerabilities, allVulnerabilities, scanProfiles };