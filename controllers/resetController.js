const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../model/userDetails');

// const timeStamp = ;
// Display forgot password form
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(3).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 18000; // 5 minutes
    await user.save();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
         user: 'sudhisundar.dutta29@gmail.com',
         pass: 'wkglyswaepwkybmz',
      },
   });

    // const resetLink = `http://yourapp.com/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: 'sudhisundar.dutta29@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      // html: emailContent,
      text: `Your unique OTP is: ${resetToken} (valid for 5 minutes) `,
   };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

let verifiedOTP;
let user;

//Handle verify OTP
exports.verifyOtp = async(req, res) => {
  try {
    user = await User.findOne({
      resetToken: req.body.token,
      // resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user || user.resetTokenExpiration > Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    verifiedOTP = true;
    res.json({ message: "The OTP has been verified." });

  }catch (error) {
    res.status(500).json({ error: error });
  }
}


// Handle reset password form submission
exports.resetPassword = async (req, res) => {
  if (verifiedOTP) {
    // const user = await User.findOne({
    //   resetToken: req.body.token,
    //   // resetTokenExpiration: { $gt: Date.now() },
    // });
    const encryptedPassword = await bcrypt.hash(req.body.newPassword, 10);
    user.password = encryptedPassword;
    // user.resetToken = undefined;
    // user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } else {
    res.status(500).json({ message: 'An error occurred' });
  }
};
