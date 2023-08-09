const mongoose = require("mongoose");

const BookingDetailsScehma = new mongoose.Schema(
  {
    username: { type: String, required: true }, // User ID or token
    token: { type: String },
    payment: { type: String },
    date: { type: String },
    seatLength: { type: Number },
    theater: { type: Object },
    movie: { type: Object },
    language: { type: String },
    city: { type: String },
    state: { type: String },
    seats: { type: Array },
  },
  {
    collection: "Bookings",
  }
);

const Booking = mongoose.model("Bookings", BookingDetailsScehma);

module.exports = Booking;