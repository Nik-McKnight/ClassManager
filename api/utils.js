const prisma = require("../db/prisma");
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

// Checks that any user is logged in
const noUserRequired = (req, res, next) => {
  if (req.signedCookies.token) {
    res.status(401).send({
      loggedIn: true,
      message: "You must log out to perform this action",
    });
    return;
  }
  req.user = null;
  next();
};

//checks that a user is logged in as an admin
const adminRequired = (req, res, next) => {
  if (!req.signedCookies.token) {
    res.status(401).send({
      loggedIn: false,
      message: "You must be logged in as an admin to perform this action",
    });
    return;
  }
  const token = req.signedCookies.token;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;

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

async function generateId(first, last) {
  while (true) {
    const num = "" + Math.floor(Math.random() * 100000);
    const result = (first[0] + last[0] + num.padStart(5, "0")).toUpperCase();
    let checkId = await prisma.User.findUnique({
      where: {
        school_id: result,
      },
    });
    if (!checkId) {
      return result;
    }
  }
}

module.exports = { userRequired, noUserRequired, adminRequired, generateId };
