import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../config/config";

const ScanForm = ({ onScanResults }) => {
  const [url, setUrl] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState(['sql_injection', 'xss','broken_authentication','sensitive_data_exposure',
    'xxe','insecure_deserialization','security_misconfiguration','access_control_issues'
    ,'csrf','vulnerable_components'
  ]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${API_BASE_URL}/api/scan`, { url, vulnerabilities });
    onScanResults(response.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Enter URL" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
        required 
      />
      <button type="submit">Start Scan</button>
    </form>
  );
};

export default ScanForm;