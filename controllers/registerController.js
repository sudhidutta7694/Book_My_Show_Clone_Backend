const User = require("../model/userDetails");

const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser1 = await User.findOne({ email });
    const oldUser2 = await User.findOne({ username });

    if (oldUser1) {
      return res.json({ error1: "Email Exists" });
    }
    if (oldUser2) {
      return res.json({ error2: "Username Exists" });
    }
    await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    // const newUserId = newUser._id;

    res.json({ status: 'ok' });

    // res.send({ status: "ok" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      text: error.text,
    });
  }
};


module.exports = handleNewUser;