// Import scanner functions from their modular locations
const vulnerabilityScanner = require('../utils/vulnerabilityScanner');
const ScanResult = require("../models/ScanResult");

/**
 * Perform security vulnerability scan on the provided URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.performScan = async (req, res) => {
  // Validate input parameters
  const { url, vulnerabilities } = req.body;

  console.log('Received scan request:', { url, vulnerabilities });
  
  if (!url) {
    return res.status(400).json({ 
      error: 'Missing URL parameter',
      message: 'A valid URL is required to perform the scan'
    });
  }
  
  if (!vulnerabilities || !Array.isArray(vulnerabilities) || vulnerabilities.length === 0) {
    return res.status(400).json({ 
      error: 'Invalid vulnerabilities parameter',
      message: 'Please provide an array of vulnerability types to scan for'
    });
  }

  try {
    // Create a map of all supported vulnerability scanning functions
    const vulnerabilityChecks = {
      // OWASP Top 10
      sql_injection: vulnerabilityScanner.scanForSQLInjection,
      xss: vulnerabilityScanner.scanForXSS,
      broken_authentication: vulnerabilityScanner.scanForBrokenAuth,
      sensitive_data_exposure: vulnerabilityScanner.scanForSensitiveDataExposure,
      xxe: vulnerabilityScanner.scanForXXE,
      insecure_deserialization: vulnerabilityScanner.scanForInsecureDeserialization,
      security_misconfiguration: vulnerabilityScanner.scanForSecurityMisconfig,
      access_control_issues: vulnerabilityScanner.scanForAccessControlIssues,
      csrf: vulnerabilityScanner.scanForCSRF,
      vulnerable_components: vulnerabilityScanner.scanForVulnerableComponents,
      
      // SANS Top 25 additional vulnerabilities
      path_traversal: vulnerabilityScanner.scanForPathTraversal,
      integer_overflow: vulnerabilityScanner.scanForIntegerOverflow,
      file_upload: vulnerabilityScanner.scanForFileUpload,
      hardcoded_credentials: vulnerabilityScanner.scanForHardcodedCredentials,
      output_neutralization: vulnerabilityScanner.scanForOutputNeutralization,
      missing_authentication: vulnerabilityScanner.scanForMissingAuthentication,
      buffer_overflow: vulnerabilityScanner.scanForBufferOverflow,
      memory_buffer: vulnerabilityScanner.scanForMemoryBuffer,
      resource_consumption: vulnerabilityScanner.scanForResourceConsumption,
      input_validation: vulnerabilityScanner.scanForInputValidation,
      race_condition: vulnerabilityScanner.scanForRaceCondition,
      certificate_validation: vulnerabilityScanner.scanForCertificateValidation,
      privilege_management: vulnerabilityScanner.scanForPrivilegeManagement,
      authorization: vulnerabilityScanner.scanForAuthorization,
      use_after_free: vulnerabilityScanner.scanForUseAfterFree,
      insecure_design: vulnerabilityScanner.scanForInsecureDesign,
      insufficient_logging: vulnerabilityScanner.scanForInsufficientLogging,
      ssrf: vulnerabilityScanner.scanForSSRF,
      
      // Advanced scanners
      host_header_injection: vulnerabilityScanner.scanForHostHeaderInjection,
      jwt_vulnerabilities: vulnerabilityScanner.scanForJwtVulnerabilities,
      prototype_pollution: vulnerabilityScanner.scanForPrototypePollution,
      nosql_injection: vulnerabilityScanner.scanForNoSQLInjection,
      server_side_template_injection: vulnerabilityScanner.scanForServerSideTemplateInjection
    };

    // Track scan results
    const results = {};
    const errors = [];
    const unsupportedVulns = [];

    // Execute scans with concurrency control
    const MAX_CONCURRENT_SCANS = 5;
    
    // Process vulnerabilities in batches to control concurrency
    for (let i = 0; i < vulnerabilities.length; i += MAX_CONCURRENT_SCANS) {
      const batch = vulnerabilities.slice(i, i + MAX_CONCURRENT_SCANS);
      
      const scanPromises = batch.map(async (vuln) => {
        if (!vulnerabilityChecks[vuln]) {
          unsupportedVulns.push(vuln);
          return;
        }
        
        try {
          // Apply timeout for each scan to prevent hanging
          const scanPromise = vulnerabilityChecks[vuln](url);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Scan for ${vuln} timed out`)), 30000)
          );
          
          // Race between scan and timeout
          const scanResult = await Promise.race([scanPromise, timeoutPromise]);
          results[vuln] = scanResult;
        } catch (error) {
          errors.push({
            vulnerability: vuln,
            error: error.message || 'Unknown error occurred during scan'
          });
          
          // Add graceful error result
          results[vuln] = {
            vulnerable: false,
            error: true,
            details: `Error scanning for ${vuln}: ${error.message}`,
            recommendation: 'Please try again or check the URL accessibility.'
          };
        }
      });
      
      // Wait for current batch to complete before moving to next batch
      await Promise.all(scanPromises);
    }

    // Process and analyze results
    const { detectedVulnerabilities, recommendations } = generateRecommendations(results);
    
    // Save scan results to database
    try {
      const scanResult = new ScanResult({ url, vulnerabilities, results });
      await scanResult.save();
    } catch (dbError) {
      console.error('Failed to save scan results to database:', dbError);
      // Continue process even if database save fails
    }

    // Prepare response
    const response = {
      url,
      scanTimestamp: new Date(),
      detectedVulnerabilities,
      recommendations,
      scanSummary: {
        total: vulnerabilities.length,
        completed: Object.keys(results).length,
        vulnerabilitiesFound: detectedVulnerabilities.length,
        failed: errors.length,
        unsupported: unsupportedVulns.length
      }
    };

    // Add warnings if there were errors or unsupported vulnerability types
    if (errors.length > 0 || unsupportedVulns.length > 0) {
      response.warnings = {};
      
      if (errors.length > 0) {
        response.warnings.scanErrors = errors;
      }
      
      if (unsupportedVulns.length > 0) {
        response.warnings.unsupportedVulnerabilities = unsupportedVulns;
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Scan controller error:', error);
    res.status(500).json({
      error: 'Scan failed',
      message: error.message || 'An unexpected error occurred during the vulnerability scan',
      requestId: req.id // Assuming you have request ID middleware
    });
  }
};

/**
 * Generate recommendations based on vulnerability scan results
 * @param {Object} results - Scan results for all vulnerabilities
 * @returns {Object} Object containing detected vulnerabilities and recommendations
 */
function generateRecommendations(results) {
  const detectedVulnerabilities = [];
  const recommendations = {};
  const severity = { high: [], medium: [], low: [] };

  // OWASP/SANS severity classification (simplified example)
  const severityMap = {
    sql_injection: 'high',
    xss: 'high',
    xxe: 'high',
    broken_authentication: 'high',
    insecure_deserialization: 'high',
    access_control_issues: 'high',
    buffer_overflow: 'high',
    path_traversal: 'high',
    
    csrf: 'medium',
    sensitive_data_exposure: 'medium',
    security_misconfiguration: 'medium',
    vulnerable_components: 'medium',
    hardcoded_credentials: 'medium',
    missing_authentication: 'medium',
    
    insufficient_logging: 'low',
    // Add other vulnerabilities with severity levels
  };

  // Process each vulnerability result
  for (const [key, value] of Object.entries(results || {})) {
    if (value && value.vulnerable === true) {
      detectedVulnerabilities.push(key);
      
      // Determine vulnerability severity
      const vulnSeverity = severityMap[key] || 'medium';
      severity[vulnSeverity].push(key);
      
      // Format recommendation with severity info
      recommendations[key] = {
        severity: vulnSeverity,
        message: `Detected Vulnerability: ${key}`,
        details: value.details || `The scan detected a ${key} vulnerability.`,
        remediation: value.recommendation || 'Please consult security guidelines for remediation.'
      };
    }
  }

  // Sort vulnerabilities by severity for better prioritization
  const sortedVulnerabilities = [
    ...severity.high,
    ...severity.medium,
    ...severity.low
  ];

  return { 
    detectedVulnerabilities: sortedVulnerabilities.length > 0 ? sortedVulnerabilities : detectedVulnerabilities,
    recommendations 
  };
}

/**
 * Get available vulnerability types for scan selection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getVulnerabilityTypes = (req, res) => {
  // Import data from a separate file in the controller's directory
  const { scanProfiles, allVulnerabilities } = require('./vulnerabilityData');
  
  res.json({
    profiles: scanProfiles,
    availableVulnerabilities: allVulnerabilities
  });
};

/**
 * Get scan history for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getScanHistory = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const userId = req.user ? req.user.id : null;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const scans = await ScanResult.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('url vulnerabilities createdAt detectedVulnerabilities');
      
    const total = await ScanResult.countDocuments({ userId });
    
    res.json({
      scans,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve scan history' });
  }
};