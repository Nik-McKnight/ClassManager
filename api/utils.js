const jwt = require("jsonwebtoken");

// Checks that any user is logged in

const userRequired = (req, res, next) => {
  if (!req.signedCookies.token) {
    res.status(401).send({
      loggedIn: false,
      message: "You must be logged in to perform this action",
    });
    return;
  }
  const token = req.signedCookies.token;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
};

const getUser = (req, res, next) => {
  if (req.signedCookies.token) {
    const token = req.signedCookies.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  }
  next();
};

//checks that a specific user is an admin

const adminRequired = (req, res, next) => {
  try {
    if (req.user.is_admin) {
      next();
    }
  } catch (error) {
    next({
      message: "You are not authorized to perform this action.",
    });
  }
};

module.exports = { userRequired, adminRequired, getUser };
