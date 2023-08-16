const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());

const mongoUrl =
    "mongodb+srv://sudhidutta7694:cWM8lu372f1WVmLk@bookflix.unshyes.mongodb.net/?retryWrites=true&w=majority";

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((e) => console.log(e));

const authRouter = require("./routes/login"); // Update the path accordingly
const registerRouter = require("./routes/register");
const favoriteRouter = require("./routes/favorite");
const refreshRouter = require("./routes/refresh");
const logoutRouter = require("./routes/logout");
const bookingRouter = require("./routes/booking");
const resetRouter = require("./routes/reset");
// Other imports and configurations
const pdfRoutes = require('./routes/pdfRoutes');
const checkoutRoutes = require('./routes/checkout');
const emailRoutes = require('./routes/email');

app.use('/healthcheck', require('./routes/healthCheck'));
// app.use(express.json());
app.use(pdfRoutes);

app.use(express.json()); // Middleware to parse JSON in request bodies

// Use the auth router
app.use(authRouter);
app.use(registerRouter);
app.use(favoriteRouter);
app.use(refreshRouter);
app.use(logoutRouter);
app.use(bookingRouter);
app.use(resetRouter);
app.use(checkoutRoutes);
app.use(emailRoutes);

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});
