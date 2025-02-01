import React, { useState } from 'react';
import ScanForm from '../components/ScanForm';
import ScanResults from '../components/ScanResults';

const ScanPage = () => {
  const [scanResults, setScanResults] = useState(null);

  const handleScanResults = (results) => {
    setScanResults(results);
  };

  return (
    <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center', // Ensures text is also centered
  }}
>
  <h1>🛠️ Think Your Site is Safe? Let’s Find Out! 🛠️</h1>
  <p style={{ fontSize: '0.9rem', color: '#666' }}>
    Please note: Do not perform scans on systems that you are not authorized to test.
  </p>
  <ScanForm onScanResults={handleScanResults} />
  {scanResults && <ScanResults results={scanResults} />}
    </div>

  );
};

export default ScanPage;
