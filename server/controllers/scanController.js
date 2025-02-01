const { scanForSQLInjection, scanForXSS, scanForBrokenAuth, scanForSensitiveDataExposure, scanForXXE, scanForInsecureDeserialization, scanForSecurityMisconfig, scanForAccessControlIssues, scanForCSRF, scanForVulnerableComponents } = require('../utils/vulnerabilityScanner');
 const ScanResult = require("../models/ScanResult")

 exports.performScan = async (req,res) => {
    const { url , vulnerabilities } = req.body;
    const results = {};


    const generateRecommendations = (results) => {
        const detectedVulnerabilities = [];
        const recommendations = {};

        for (const [key, value] of Object.entries(results || {})) { // Ensure results is always an object
            if (value.vulnerable) {
                detectedVulnerabilities.push(key); // Add vulnerability name to the list
                recommendations[key] = {
                    message: `Detected Vulnerability: ${key}`,
                    remediation: value.recommendation || 'Please consult security guidelines for remediation.'
                };
            }
        }

        return { detectedVulnerabilities, recommendations };
    };

    

    const vulnerabilityChecks = {
        sql_injection: scanForSQLInjection,
        xss: scanForXSS,
        broken_authentication: scanForBrokenAuth,
        sensitive_data_exposure: scanForSensitiveDataExposure,
        xxe: scanForXXE,
        insecure_deserialization: scanForInsecureDeserialization,
        security_misconfiguration: scanForSecurityMisconfig,
        access_control_issues: scanForAccessControlIssues,
        csrf: scanForCSRF,
        vulnerable_components: scanForVulnerableComponents
    };


    for(const vuln of vulnerabilities){
        if(vulnerabilityChecks[vuln]){
            // console.log(`Running scan for ${vuln} on ${url}`);
            const scanResult = await vulnerabilityChecks[vuln](url);
            // console.log(`${vuln} result:`, scanResult);
            results[vuln] = scanResult;
        }
    }
    

    const scanResult = new ScanResult({url , vulnerabilities , results});
    await scanResult.save();

    const { detectedVulnerabilities, recommendations } = generateRecommendations(results);

    res.json({
        url,
        detectedVulnerabilities,
        recommendations
    });
 };