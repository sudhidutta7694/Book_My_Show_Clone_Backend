const User = require("../model/userDetails");

require("dotenv").config();

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const foundUser = await User.findOne({
      refreshToken: refreshToken,
    });

    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true, maxAge: 60 * 60 * 1000 });
      return res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = handleLogout;