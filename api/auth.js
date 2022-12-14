const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userRequired, noUserRequired } = require("./utils");
const authRouter = require("express").Router();

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

authRouter.post("/register", noUserRequired, async (req, res, next) => {
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

    const checkEmail = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });

    if (checkEmail) {
      res.send("A user with that email already exists.");
    }

    const user = await prisma.User.create({
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

    const token = jwt.sign(user, JWT_SECRET);

    res.cookie("token", token, {
      sameSite: "strict",
      httpOnly: true,
      signed: true,
    });

    delete user.password;

    req.user = user;

    res.send(user);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", noUserRequired, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.User.findUnique({
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

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.send({
        loggedIn: false,
        message: "Invalid password, please try again.",
      });
    } else {
      const token = jwt.sign(user, JWT_SECRET);

      res.cookie("token", token, {
        sameSite: "strict",
        httpOnly: true,
        signed: true,
      });

      delete user.password;

      res.send(user);
    }
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", userRequired, async (req, res, next) => {
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
