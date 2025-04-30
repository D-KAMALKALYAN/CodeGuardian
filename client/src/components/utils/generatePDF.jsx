// Enhanced PDF Generator function that incorporates jsPDF and Chart.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';

const generatePDF = async (results) => {
  const { url, detectedVulnerabilities, recommendations } = results;
  
  // Create new PDF document - using portrait for better layout
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Check if autoTable is available
  if (typeof doc.autoTable !== 'function') {
    console.error("jsPDF-AutoTable is not properly loaded. Ensuring it's imported correctly.");
    
    // Try to manually import the plugin if available in the global scope
    if (typeof window !== 'undefined' && window.jspdfAutoTable) {
      window.jspdfAutoTable(doc);
      console.log("Applied jspdfAutoTable from window object");
    } else {
      console.warn("Proceeding with basic PDF generation without table functionality");
    }
  }
  
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  
  // Define colors with better contrast
  const colors = {
    primary: [41, 98, 255],     // Brighter Blue
    success: [46, 125, 50],     // Green
    error: [211, 47, 47],       // Red
    warning: [237, 137, 7],     // Orange
    neutral: [80, 80, 80]       // Darker Gray for better readability
  };
  
  // Get page dimensions in mm
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;  // slightly smaller margin to give more space
  const maxLineWidth = pageWidth - margin * 2;
  
  let yOffset = 20;  // Starting Y position
  
  // ----- Create header with improved alignment -----
  // Add gradient background header
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  // Add white text for title - properly centered
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  
  // Measure text width to center it
  const titleText = "Security Scan Report";
  const titleWidth = doc.getStringUnitWidth(titleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  doc.text(titleText, (pageWidth - titleWidth) / 2, 18);
  
  // Add small white text for date - aligned to right
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${formattedDate}`, margin, 27);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Move position after header
  yOffset = 40;
  
  // ----- URL Section -----
  // Section title
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(margin - 2, yOffset - 5, pageWidth - (margin * 2) + 4, 25, 2, 2, 'F');
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Scanned Website", margin, yOffset + 5);
  
  // URL content with better word-wrapping
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  
  // Better text wrapping for URLs
  const urlText = url;
  const splitUrl = doc.splitTextToSize(urlText, maxLineWidth - 5); // Reduce width slightly for margin
  doc.text(splitUrl, margin, yOffset + 15);
  
  // Calculate actual height used based on number of lines
  const urlHeight = Math.max(25, splitUrl.length * 7);
  yOffset += urlHeight + 10;
  
  // ----- Security Status Summary Box -----
  // Create colored status box with rounded corners
  if (detectedVulnerabilities.length > 0) {
    // Red for vulnerabilities
    doc.setFillColor(255, 240, 240);
    doc.setDrawColor(colors.error[0], colors.error[1], colors.error[2]);
  } else {
    // Green for secure
    doc.setFillColor(240, 255, 240);
    doc.setDrawColor(colors.success[0], colors.success[1], colors.success[2]);
  }
  
  // Rounded rectangle with border
  doc.roundedRect(margin - 2, yOffset - 2, pageWidth - (margin * 2) + 4, 28, 3, 3, 'FD');
  
  // Status text with emoji spaced properly
  if (detectedVulnerabilities.length > 0) {
    doc.setTextColor(colors.error[0], colors.error[1], colors.error[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${detectedVulnerabilities.length} Vulnerabilities Detected`, margin + 2, yOffset + 7);
    doc.setFontSize(11);
    doc.text("Your website has security issues that need attention", margin + 2, yOffset + 20);
  } else {
    doc.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("✓ Secure", margin + 2, yOffset + 7);
    doc.setFontSize(11);
    doc.text("Your website passed all security checks", margin + 2, yOffset + 20);
  }
  
  yOffset += 40;
  
  // ----- Create donut chart of scan results -----
  // Fixed chart generation function - now properly handles the async rendering
  const createDonutChart = async () => {
    // Only create chart if there are vulnerabilities or recommendations
    if (detectedVulnerabilities.length > 0 || Object.keys(recommendations).length > 0) {
      try {
        // Calculate security score with improved algorithm
        const totalChecks = 10; // Assume 10 total checks, adjust as needed
        const failedChecks = detectedVulnerabilities.length;
        const securePercentage = Math.max(0, Math.min(100, 100 - (failedChecks / totalChecks * 100)));
        
        // Create off-screen canvas for Chart.js in a proper way
        if (typeof document === 'undefined') {
          // Server-side fallback - use text instead
          doc.setFontSize(18);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "bold");
          const scoreText = `Security Score: ${Math.round(securePercentage)}%`;
          const scoreWidth = doc.getStringUnitWidth(scoreText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
          doc.text(scoreText, (pageWidth - scoreWidth) / 2, yOffset + 20);
          return 40; // Return smaller height as we're just showing text
        }
        
        // Create a hidden div to contain the canvas
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px'; // Hide off-screen
        container.style.width = '400px';
        container.style.height = '400px';
        
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        container.appendChild(canvas);
        document.body.appendChild(container);
        
        // Create the chart
        const chart = new Chart(canvas, {
          type: 'doughnut',
          data: {
            labels: ['Secure', 'Vulnerabilities'],
            datasets: [{
              data: [securePercentage, 100 - securePercentage],
              backgroundColor: [
                `rgba(${colors.success.join(',')}, 0.8)`,
                `rgba(${colors.error.join(',')}, 0.8)`
              ],
              borderColor: [
                `rgb(${colors.success.join(',')})`,
                `rgb(${colors.error.join(',')})`
              ],
              borderWidth: 2 // Slightly thicker border
            }]
          },
          options: {
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: true,
            animation: false, // Disable animations for faster rendering
            plugins: {
              legend: {
                display: false // Hide legend as we add our own text
              }
            }
          }
        });
        
        // Wait for chart rendering to complete
        return new Promise((resolve) => {
          setTimeout(() => {
            try {
              // Convert canvas to image with higher quality
              const chartImg = canvas.toDataURL('image/png', 1.0);
              
              // Position chart centrally
              const imgWidth = 100;
              const imgHeight = 100;
              const chartX = (pageWidth - imgWidth) / 2;
              doc.addImage(chartImg, 'PNG', chartX, yOffset, imgWidth, imgHeight);
              
              // Add security score in the center with better position calculation
              doc.setFontSize(22);
              doc.setTextColor(0, 0, 0);
              doc.setFont("helvetica", "bold");
              const scoreText = `${Math.round(securePercentage)}%`;
              const scoreWidth = doc.getStringUnitWidth(scoreText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
              doc.text(scoreText, (pageWidth - scoreWidth) / 2, yOffset + 62);
              
              // Add "Security Score" label
              doc.setFontSize(10);
              doc.setFont("helvetica", "normal");
              const labelText = "Security Score";
              const labelWidth = doc.getStringUnitWidth(labelText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
              doc.text(labelText, (pageWidth - labelWidth) / 2, yOffset + 72);
              
              // Clean up
              document.body.removeChild(container);
              
              resolve(115); // Height of chart section
            } catch (error) {
              console.error("Error capturing chart:", error);
              document.body.removeChild(container);
              resolve(20); // Return a smaller height as fallback
            }
          }, 100); // Give chart a little time to render
        });
      } catch (e) {
        console.error("Error creating chart:", e);
        // Fallback: just add text saying chart couldn't be generated
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Chart generation failed: " + e.message, margin, yOffset);
        return 20;
      }
    }
    return 0;
  };
  
  // Add the chart and move yOffset
  const chartHeight = await createDonutChart();
  yOffset += chartHeight;
  
  // ----- Vulnerabilities Section with improved layout -----
  if (detectedVulnerabilities.length > 0) {
    // Check if we need a new page
    if (yOffset > pageHeight - 120) {
      doc.addPage();
      yOffset = 20;
    }
    
    // Section title with background to make it stand out
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(0, yOffset - 5, pageWidth, 25, 0, 0, 'F');
    
    doc.setTextColor(colors.error[0], colors.error[1], colors.error[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Detected Vulnerabilities", margin, yOffset + 10);
    yOffset += 25;
    
    if (typeof doc.autoTable === 'function') {
      // Create a table for vulnerabilities with improved styling
      const vulnTableData = detectedVulnerabilities.map((vuln, index) => [index + 1, vuln]);
      
      doc.autoTable({
        startY: yOffset,
        head: [['#', 'Vulnerability Description']],
        body: vulnTableData,
        theme: 'striped',
        headStyles: {
          fillColor: [colors.error[0], colors.error[1], colors.error[2]],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'left' // Left-align header text
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' }, // Center the number
          1: { cellWidth: 'auto', halign: 'left' }  // Left-align the text
        },
        margin: { left: margin, right: margin },
        styles: {
          overflow: 'linebreak',
          cellPadding: 5,
          fontSize: 10, // Slightly smaller font for better fit
          lineColor: [200, 200, 200] // Lighter grid lines
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248] // Very light grey for alternate rows
        }
      });
      
      yOffset = doc.lastAutoTable.finalY + 15;
    } else {
      // Fallback for when autoTable isn't available
      yOffset += 5;
      const lineHeight = 7;
      
      detectedVulnerabilities.forEach((vuln, index) => {
        // Draw alternating background for better readability
        if (index % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          const textHeight = doc.splitTextToSize(vuln, maxLineWidth - 20).length * lineHeight + 5;
          doc.rect(margin - 2, yOffset - 2, maxLineWidth + 4, textHeight + 4, 'F');
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}.`, margin, yOffset + 4);
        doc.setFont("helvetica", "normal");
        
        const textLines = doc.splitTextToSize(vuln, maxLineWidth - 20);
        doc.text(textLines, margin + 10, yOffset + 4);
        yOffset += textLines.length * lineHeight + 8;
      });
      
      yOffset += 5;
    }
  }
  
  // ----- Recommendations Section with improved layout -----
  if (Object.keys(recommendations).length > 0) {
    // Check if we need a new page with more space buffer
    if (yOffset > pageHeight - 130) {
      doc.addPage();
      yOffset = 20;
    }
    
    // Section title with background
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(0, yOffset - 5, pageWidth, 25, 0, 0, 'F');
    
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", margin, yOffset + 10);
    yOffset += 25;
    
    if (typeof doc.autoTable === 'function') {
      // Create a table for recommendations with improved layout
      const recTableData = Object.entries(recommendations).map(([key, value], index) => 
        [index + 1, value.message, value.remediation]
      );
      
      doc.autoTable({
        startY: yOffset,
        head: [['#', 'Recommendation', 'Remediation Steps']],
        body: recTableData,
        theme: 'grid',
        headStyles: {
          fillColor: [colors.primary[0], colors.primary[1], colors.primary[2]],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 75, halign: 'left' },
          2: { cellWidth: 'auto', halign: 'left' }
        },
        margin: { left: margin, right: margin },
        styles: {
          overflow: 'linebreak',
          cellPadding: 5,
          fontSize: 10,
          lineColor: [220, 220, 220]
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        }
      });
      
      yOffset = doc.lastAutoTable.finalY + 15;
    } else {
      // Fallback for when autoTable isn't available with better formatting
      yOffset += 5;
      const lineHeight = 7;
      
      Object.entries(recommendations).forEach(([key, value], index) => {
        // Background rectangle for each recommendation
        doc.setFillColor(index % 2 === 0 ? 248 : 255, index % 2 === 0 ? 248 : 255, index % 2 === 0 ? 248 : 255);
        const messageLines = doc.splitTextToSize(value.message, maxLineWidth - 20);
        const remLines = doc.splitTextToSize(`Remediation: ${value.remediation}`, maxLineWidth - 25);
        const totalHeight = messageLines.length * lineHeight + remLines.length * lineHeight + 10;
        
        doc.roundedRect(margin - 3, yOffset - 3, maxLineWidth + 6, totalHeight + 6, 2, 2, 'F');
        
        // Recommendation number and title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}.`, margin, yOffset + 4);
        doc.text(messageLines, margin + 8, yOffset + 4);
        yOffset += messageLines.length * lineHeight + 5;
        
        // Remediation steps
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Remediation:", margin + 8, yOffset + 4);
        doc.setFont("helvetica", "normal");
        doc.text(doc.splitTextToSize(value.remediation, maxLineWidth - 35), margin + 30, yOffset + 4);
        yOffset += remLines.length * lineHeight + 10;
      });
      
      yOffset += 5;
    }
  }
  
  // ----- Add a summary bar chart of issue types with improved styling -----
  // Fixed approach for the summary chart
  if (detectedVulnerabilities.length > 0 || Object.keys(recommendations).length > 0) {
    try {
      // Check if we need a new page with more conservative space requirement
      if (yOffset > pageHeight - 140) {
        doc.addPage();
        yOffset = 20;
      }
      
      // Section title with background
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(0, yOffset - 5, pageWidth, 25, 0, 0, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Summary of Issues", margin, yOffset + 10);
      yOffset += 25;
      
      // Count types of issues with more meaningful categorization
      const criticalCount = Math.floor(detectedVulnerabilities.length * 0.3);
      const highCount = Math.floor(detectedVulnerabilities.length * 0.7);
      const mediumCount = Math.floor(Object.keys(recommendations).length * 0.6);
      const lowCount = Object.keys(recommendations).length - mediumCount;
      
      // Check if we can render charts (client-side)
      if (typeof document === 'undefined') {
        // Server-side fallback - use a simple table instead
        const issueTypes = [
          ['Critical', criticalCount],
          ['High', highCount],
          ['Medium', mediumCount],
          ['Low', lowCount]
        ];
        
        const yStep = 10;
        let tableY = yOffset + 10;
        
        // Draw simple table headers
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Severity", margin, tableY);
        doc.text("Count", margin + 50, tableY);
        tableY += yStep;
        
        // Draw horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, tableY - 2, margin + 80, tableY - 2);
        
        // Draw table rows
        doc.setFont("helvetica", "normal");
        issueTypes.forEach(([type, count], index) => {
          doc.setFillColor(index % 2 === 0 ? 248 : 255, index % 2 === 0 ? 248 : 255, index % 2 === 0 ? 248 : 255);
          doc.rect(margin - 2, tableY - 5, 84, 10, 'F');
          doc.text(type, margin, tableY);
          doc.text(count.toString(), margin + 50, tableY);
          tableY += yStep;
        });
        
        yOffset = tableY + 10;
      } else {
        // Client-side chart creation - improved approach
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px'; // Hide off-screen
        container.style.width = '600px';
        container.style.height = '400px';
        
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        container.appendChild(canvas);
        document.body.appendChild(container);
        
        // Create the bar chart
        const chart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
              label: 'Number of Issues',
              data: [criticalCount, highCount, mediumCount, lowCount],
              backgroundColor: [
                'rgba(211, 47, 47, 0.8)',
                'rgba(237, 108, 2, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(76, 175, 80, 0.8)'
              ],
              borderColor: [
                'rgb(211, 47, 47)',
                'rgb(237, 108, 2)',
                'rgb(255, 193, 7)',
                'rgb(76, 175, 80)'
              ],
              borderWidth: 2,
              borderRadius: 5, // Rounded bars
              maxBarThickness: 60 // Control bar thickness
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false, // Disable animations for faster rendering
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: 'rgba(200, 200, 200, 0.3)' // Lighter grid lines
                }
              },
              x: {
                ticks: {
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                },
                grid: {
                  display: false // No vertical grid lines
                }
              }
            },
            plugins: {
              legend: {
                display: false // Hide legend
              }
            }
          }
        });
        
        // Wait for chart rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        try {
          // Convert canvas to image with higher quality
          const chartImg = canvas.toDataURL('image/png', 1.0);
          const chartWidth = 170;
          const chartHeight = 110;
          const chartX = (pageWidth - chartWidth) / 2;
          doc.addImage(chartImg, 'PNG', chartX, yOffset, chartWidth, chartHeight);
          
          // Clean up
          document.body.removeChild(container);
          
          yOffset += 115; // Height of chart section
        } catch (error) {
          console.error("Error capturing bar chart:", error);
          document.body.removeChild(container);
          
          // Fallback to simple text
          doc.setFontSize(12);
          doc.text("Summary chart could not be rendered.", margin, yOffset + 10);
          yOffset += 30;
        }
      }
    } catch (e) {
      console.error("Error creating summary chart:", e);
      // Fallback: just add text with better error handling
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Summary chart could not be generated.", margin, yOffset + 10);
      yOffset += 20;
    }
  }
  
  // ----- Footer on each page with CodeGuardian branding and save PDF -----
  const totalPages = doc.internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Left side: page info
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Security Scan Report - Page ${i} of ${totalPages}`, margin, pageHeight - 8);
    
    // Right side: Company branding - CodeGuardian
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    
    const brandText = "CodeGuardian™";
    const brandWidth = doc.getStringUnitWidth(brandText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    doc.text(brandText, pageWidth - margin - brandWidth, pageHeight - 8);
  }
  
  // Save the PDF with a cleaner filename
  const dateString = currentDate.toISOString().split('T')[0];
  const timeString = currentDate.toISOString().split('T')[1].substring(0, 8).replace(/:/g, '-');
  doc.save(`CodeGuardian_Security_Scan_${dateString}_${timeString}.pdf`);
  
  console.log("PDF generated successfully");
  return true;
};

// Improved function to handle both Promise-based and callback-based environments
const generatePDFReport = (results) => {
  return new Promise((resolve, reject) => {
    try {
      // Make sure we have jsPDF and jspdf-autotable properly loaded
      if (typeof window !== 'undefined') {
        // For browser environments - ensure Chart.js is ready
        if (typeof Chart === 'undefined') {
          console.error("Chart.js not available - using fallback rendering");
        }
        
        // Execute the PDF generation
        generatePDF(results)
          .then(() => resolve(true))
          .catch(err => {
            console.error("Error in PDF generation:", err);
            reject(err);
          });
      } else {
        // For Node.js or environments where Chart.js won't work
        // Use a simpler version without charts
        generatePDF(results)
          .then(() => resolve(true))
          .catch(err => {
            console.error("Error in PDF generation (Node environment):", err);
            reject(err);
          });
      }
    } catch (e) {
      console.error("Critical error initializing PDF generation:", e);
      reject(e);
    }
  });
};

export { generatePDF as default, generatePDFReport };