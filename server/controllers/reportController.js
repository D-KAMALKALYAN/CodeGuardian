const pdfGenerator = require('../utils/pdfGenerator');

exports.generateReport = (req, res) => {
    try {
        const { scanData } = req.body; // Ensure scanData is destructured properly

        if (!scanData || typeof scanData !== 'object') {
            return res.status(400).json({ message: 'Invalid scan data provided.' });
        }

        // Generate the PDF using valid scanData
        const pdfBuffer = pdfGenerator.generatePDF(scanData);

        res.set('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating report:', error.message);
        res.status(500).json({ message: 'Failed to generate report.' });
    }
};
