const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied token required");
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    // console.log(decoded);
    next();
  } catch (error) {
    res.status(400).send("invalid token" + error.message);
  }
}
module.exports =  auth;

