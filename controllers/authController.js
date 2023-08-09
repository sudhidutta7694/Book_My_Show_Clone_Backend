const User = require("../model/userDetails");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { userInfo, password } = req.body;
  if (!userInfo || !password)
    return res.status(402).json({ message: "username or password missing." });
  try {
    // const foundUser = await User.findOne({ username: user });
    const foundUser = await User.findOne({ $or: [{ email: userInfo }, { username: userInfo }] });
    if (!foundUser) return res.status(401).json({ error: "No user registered" });
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      //create jwts
      const accessToken = jwt.sign(
        { $or: [{ email: foundUser.email }, { username: foundUser.username }] },
        // { username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );
      //saving refresh token
      const refreshToken = jwt.sign(
        { $or: [{ email: foundUser.email }, { username: foundUser.username }] },
        // { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
      res
        .status(200)
        .json({ idToken: accessToken, userInfo: foundUser.username, email:foundUser.email })
        // .json({ idToken: accessToken, email: foundUser.username })
        .end();
    } else {
      res.status(401).json({ error: "Invalid Password" });;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};


// app.post("/login-user", async (req, res) => {
//   const { userInfo, password } = req.body;

//   const user = await User.findOne({ $or: [{ email: userInfo }, { username: userInfo }] });
//   if (!user) {
//       return res.json({ error: "User Not found" });
//   }
//   if (await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign({ userInfo }, JWT_SECRET, {
//           expiresIn: "15m",
//       });

//       if (res.status(201)) {
//           return res.json({ status: "ok", data: token });
//       } else {
//           return res.json({ error: "error" });
//       }
//   }
//   res.json({ status: "error", error: "Invalid Password" });
// });


module.exports = handleLogin;