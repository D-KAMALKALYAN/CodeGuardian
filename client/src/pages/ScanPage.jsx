import React, { useState } from 'react';
import ScanForm from '../components/ScanForm';
import ScanResults from '../components/ScanResults';
import styles from './ScanPage.module.css';

const ScanPage = () => {
  const [scanResults, setScanResults] = useState(null);

  const handleScanResults = (results) => {
    setScanResults(results);
  };

  return (
    <div className={styles.container}>
      <h1>🛠️ Think Your Site is Safe? Let’s Find Out! 🛠️</h1>
      <p className={styles.note}>
        Please note: Do not perform scans on systems that you are not authorized to test.
      </p>
      <ScanForm onScanResults={handleScanResults} />
      {scanResults && <ScanResults results={scanResults} />}
    </div>
  );
};

export default ScanPage;
