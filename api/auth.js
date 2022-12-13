const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userRequired } = require("./utils");
const authRouter = require("express").Router();

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

authRouter.get("/me", userRequired, (req, res, next) => {
  const user = req.user;
  res.send({
    user,
  });
});

// first name, lastname, email, username, password
authRouter.post("/register", async (req, res, next) => {
  let user;
  try {
    const {
      first_name,
      last_name,
      email,
      preferred_name,
      gpa,
      address,
      phone,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    user = await prisma.User.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        preferred_name: preferred_name,
        gpa: gpa ? gpa : 4.0,
        address: address,
        phone: phone,
        password: hashedPassword,
      },
    });
  } catch (error) {
    //next(error);
  }
  if (user) {
    delete user.password;

    const token = jwt.sign(user, JWT_SECRET);

    res.cookie("token", token, {
      sameSite: "strict",
      httpOnly: true,
      signed: true,
    });

    delete user.password;
    req.user = user;

    res.send({ user });
  } else res.send("A user with that email already exists.");
});

// Consolidate login and login/alt
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user;

    user = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });

    if (user === null) {
      res.send({
        loggedIn: false,
        message: `No account with that email exists. Please try again.`,
      });
    }

    let validPassword;
    try {
      validPassword = await bcrypt.compare(password, user.password);
    } catch (error) {
      next(error);
    }

    if (!validPassword) {
      res.send({
        loggedIn: false,
        message: "Invalid password, please try again.",
      });
    }

    if (validPassword) {
      const token = jwt.sign(user, JWT_SECRET);

      res.cookie("token", token, {
        sameSite: "strict",
        httpOnly: true,
        signed: true,
      });
      delete user.password;
      res.send({ user });
    }
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token", {
      sameSite: "strict",
      httpOnly: true,
      signed: true,
    });
    req.user = null;

    res.send({
      loggedIn: false,
      message: "You have logged out",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
