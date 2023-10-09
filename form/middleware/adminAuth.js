const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    res.status(400).send("Access denied token required");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //console.log(decoded)
    req.user = decoded;
    if (!req.user.role){
        return res.status(403).send("Acces denied you are not admin user");
    }
    next();
  } catch (error) {
    res.status(400).send("invalid token" + error.message);
  }
}
module.exports = adminAuth;
