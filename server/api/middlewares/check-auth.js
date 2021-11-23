const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //pratimo neku konvenciju gde se imenuje token kao "Bearer eoingworngowin"
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "ewinrwonbrnbrbneoiboeibmteqmwvmrw");
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
