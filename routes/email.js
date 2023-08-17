const express = require('express');
const router = express.Router();
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.use(express.json());
router.use(cors());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sudhisundar.dutta29@gmail.com',
    pass: 'wkglyswaepwkybmz',
  },
});

async function sendEmailWithPDF(items, recipientEmail) {
  const pdfFilePath = 'invoice.pdf'; // Relative path to save the generated PDF

  const doc = new PDFDocument();
  const pdfStream = fs.createWriteStream(pdfFilePath);
  doc.pipe(pdfStream);

  doc.font('Helvetica-Bold').fontSize(18).text('Invoice and Tickets', { align: 'center' });
  doc.moveDown();

  // Download and store images locally
  const imagePromises = items.map(async (item, index) => {
    if (item.imageUrl) {
      const imagePath = `image${index + 1}.jpg`; // Generate a unique name for each image
      const imageResponse = await axios.get(item.imageUrl, { responseType: 'arraybuffer' });

      fs.writeFileSync(imagePath, imageResponse.data);
      return imagePath;
    }
  });

  const imagePaths = await Promise.all(imagePromises);
  const pdfWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Loop through items and add content
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.imageUrl && imagePaths[i]) {
      const x = (pdfWidth) / 2;
      doc.image(imagePaths[i], x, doc.y, { width: 150, height: 200 }, { align: 'center' });
    }
    doc.moveDown();
    doc.fontSize(14).text(`${item.numTickets} ticket(s) for ${item.movieName}`, { align: 'center' });
    doc.fontSize(12).text(`Total Amount: Rs${item.totalPayment}`, { align: 'center' });
    doc.fontSize(12).text(`Ticket no.: ${item.movieToken}`, { align: 'center' });

    doc.moveDown(0.5); // Adjust the spacing as needed
  }

  // Cleanup: Delete downloaded images
  imagePaths.forEach(imagePath => {
    if (imagePath) {
      fs.unlinkSync(imagePath);
    }
  });

  doc.end();

  const emailContent = `
   <html>
     <head>
       <style>
         body {
           font-family: Arial, sans-serif;
           background-color: #f2f2f2;
           margin: 0;
           padding: 20px;
         }
         .email-container {
           background-color: #ffffff;
           border-radius: 8px;
           padding: 20px;
           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
         }
         .header {
           font-size: 24px;
           color: #333;
           margin-bottom: 20px;
         }
         .ticket {
           margin-top: 20px;
           padding: 10px;
           background-color: #e6f7ff;
           border-radius: 4px;
         }
         .ticket-title {
           font-size: 18px;
           color: #333;
         }
         .ticket-details {
           font-size: 16px;
           color: #666;
         }
         .footer {
           margin-top: 20px;
           font-size: 14px;
           color: #888;
         }
       </style>
     </head>
     <body>
       <div class="email-container">
         <div class="header">Thank you for your purchase!</div>
         
         ${items.map(
    (item) => `
             <div class="ticket">
               <div class="ticket-title">${item.numTickets} ticket(s) for ${item.movieName}</div>
               <div class="ticket-details">
                 Total Amount: ₹${item.totalPayment}<br />
                 Ticket no.: ${item.movieToken}
               </div>
             </div>
           `
  ).join('')}
         
         <div class="footer">
           We hope you enjoy the movie!<br />
           Regards,<br />
           BookFlix
         </div>
       </div>
     </body>
   </html>
 `;


  const mailOptions = {
    from: 'sudhisundar.dutta29@gmail.com',
    to: recipientEmail,
    subject: 'Movie Booking Receipt',
    html: emailContent,
    attachments: [
      {
        filename: 'invoice.pdf', // This is the filename you want to show in the email
        path: path.join(__dirname, 'public', 'invoice.pdf'), // The path to the public directory and the file
        contentType: 'application/pdf'
      }
    ]

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
      // Remove the generated PDF file after sending the email
      fs.unlinkSync(pdfFilePath);
    }
  });
}

router.post('/send-email', async (req, res) => {
  const { email } = req.body;
  const items = itemsForEmail;

  // Call the sendEmailWithPDF function from your existing server code
  try {
    await sendEmailWithPDF(items, email);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
  }
});

module.exports = router;