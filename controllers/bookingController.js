const Booking = require('../model/bookingDetails');

const createBooking = async (req, res) => {
  const bookingData = req.body;

  try {
    await Booking.create(bookingData);
    // await newBooking.save();

    res.status(201).json({ success: true, message: 'Booking data saved successfully!' });
  } catch (error) {
    console.error('Error saving booking data:', error);
    res.status(500).json({ success: false, message: 'Error saving booking data' });
  }
};

const getBookingsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const bookings = await Booking.find({ username });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
};

const getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json({ success: true, bookings });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
  };

module.exports = { createBooking, getBookingsByUsername, getAllBookings };
