const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.post('/generate-pdf', pdfController.generatePDF);

module.exports = router;
