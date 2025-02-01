import React from 'react';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf'; // Import jsPDF

const ScanResults = ({ results }) => {
  const { url, detectedVulnerabilities, recommendations } = results;

  // Function to generate and download the PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  
    doc.setFont("helvetica", "normal");
  
    let yOffset = 20;  // Starting Y position
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
  
    // Adding Title
    doc.setFont("helvetica", "bold");
    doc.text("Scan Results Report", margin, yOffset);
    yOffset += 10;
  
    // Adding Date and Time
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${formattedDate}`, margin, yOffset);
    yOffset += 10;
  
    // Adding the URL
    doc.setFont("helvetica", "bold");
    doc.text("Scanned URL:", margin, yOffset);
    yOffset += 10;
    doc.setFont("helvetica", "normal");
    const splitUrl = doc.splitTextToSize(url, maxLineWidth);
    doc.text(splitUrl, margin, yOffset);
    yOffset += splitUrl.length * 10;
  
    // Adding Detected Vulnerabilities
    doc.setFont("helvetica", "bold");
    doc.text("Detected Vulnerabilities:", margin, yOffset);
    yOffset += 10;
  
    if (detectedVulnerabilities.length > 0) {
      detectedVulnerabilities.forEach((vuln) => {
        doc.setFont("helvetica", "normal");
        const splitVuln = doc.splitTextToSize(vuln, maxLineWidth);
        doc.text(splitVuln, margin, yOffset);
        yOffset += splitVuln.length * 10;
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.text("No vulnerabilities detected", margin, yOffset);
      yOffset += 10;
    }
  
    // Adding Recommendations
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations:", margin, yOffset);
    yOffset += 10;
  
    if (Object.keys(recommendations).length > 0) {
      Object.entries(recommendations).forEach(([key, value]) => {
        doc.setFont("helvetica", "normal");
        const splitMessage = doc.splitTextToSize(value.message, maxLineWidth);
        doc.text(splitMessage, margin, yOffset);
        yOffset += splitMessage.length * 10;
  
        const splitRemediation = doc.splitTextToSize(`Remediation: ${value.remediation}`, maxLineWidth);
        doc.text(splitRemediation, margin, yOffset);
        yOffset += splitRemediation.length * 10;
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.text("No recommendations available", margin, yOffset);
      yOffset += 10;
    }
  
    // Save the PDF
    doc.save('scan_results.pdf');
  };
  

  return (
    <div>
      <h3>Scanned URL: {url}</h3>
      <h4>Detected Vulnerabilities:</h4>
      {detectedVulnerabilities.length > 0 ? (
        detectedVulnerabilities.map((vuln, index) => (
          <div key={index}>
            <strong>{vuln}</strong>
          </div>
        ))
      ) : (
        <p>No vulnerabilities detected.</p>
      )}

      <h4>Recommendations:</h4>
      {Object.keys(recommendations).map((key) => (
        <div key={key}>
          <p><strong>{recommendations[key]?.message}</strong></p>
          <p><strong>Remediation:</strong><em>{recommendations[key]?.remediation}</em></p>
        </div>
      ))}

      {/* Button to download PDF */}
      <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
        Download PDF
      </Button>
    </div>
  );
};

export default ScanResults;
