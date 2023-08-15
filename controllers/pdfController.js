const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generatePDF = (req, res) => {
  const { data } = req.body;

  const doc = new PDFDocument();
  const pdfFilePath = path.join(__dirname, '../public/generated.pdf');
  const pdfStream = fs.createWriteStream(pdfFilePath);

  doc.pipe(pdfStream);
  doc.fillColor('red');
  // Loop through the key-value pairs and add them to the PDF
  doc.font('Helvetica-Bold').fontSize(18).text('Invoice Receipt: ', {align: 'center'});
  doc.moveDown();
  doc.moveDown();
  doc.fillColor('blue')
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'theater') {
        Object.entries(data.theater).forEach(([key, value]) => {
        doc.font('Times-Roman').fontSize(14).text(`Theater ${key.charAt(0).toLocaleUpperCase() + key.slice(1)}: ${value}`);
        doc.moveDown(0.3)
        })
    }else {
        doc.font('Times-Roman').fontSize(14).text(`${key.charAt(0).toLocaleUpperCase() + key.slice(1)}: ${value}`);
    }
    doc.moveDown(0.5);
  });

  doc.end();

  pdfStream.on('finish', () => {
    // Close the write stream to ensure the PDF is fully written
    pdfStream.end();

    // Send the generated PDF as a response
    res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    
    // Pipe the PDF stream to the response
    const pdfReadStream = fs.createReadStream(pdfFilePath);
    pdfReadStream.pipe(res);
  });

  pdfStream.on('error', (error) => {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  });
};
