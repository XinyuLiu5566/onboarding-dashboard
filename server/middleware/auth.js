const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

module.exports = (req, res, next) => {
  console.log(
    `auth_session middleware before hitting route: ${req.originalUrl}`
  );
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(403)
      .json({ message: "Forbidden: Needs to be logged in" });
  }
};
