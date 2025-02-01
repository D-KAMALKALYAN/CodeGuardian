// 
const PDFDocument = require('pdfkit');

exports.generatePDF = (scanData) => {
    // Validate scanData structure
    if (!scanData || typeof scanData !== 'object') {
        throw new TypeError('Invalid scan data provided to generatePDF.');
    }

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => console.log('PDF generated successfully.'));

    // Adding content to PDF
    doc.fontSize(16).text('Vulnerability Report', { align: 'center' });
    doc.moveDown();

    Object.entries(scanData).forEach(([key, value]) => {
        doc.fontSize(12).text(`${key}: ${value}`);
    });

    doc.end();

    return Buffer.concat(buffers);
};
