const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    // const decodedToken = jwt.verify(token, "ewinrwonbrnbrbneoiboeibmteqmwvmrw");
    // req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    if (req.userData.userId === +req.params.id) {
      next();
    } else {
      res.status(401).json({ message: "You are not test!" });
    }
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
