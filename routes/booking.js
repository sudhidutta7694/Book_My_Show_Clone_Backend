const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:username', bookingController.getBookingsByUsername);
router.get('/bookings', bookingController.getAllBookings);

module.exports = router;
