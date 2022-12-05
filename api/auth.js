const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userRequired, adminRequired } = require("./utils");
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
  } catch (error) {
    next(error);
  }
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

// Example of how to use authorization middleware

// authRouter.get(`/:id`, userRequired, adminRequired, async (req, res, next) => {
//   const { id } = req.params;
//   // const id = 1;
//   try {
//     const user = await prisma.users.findUnique({
//       where: {
//         id: +id,
//       },
//     });
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// });

authRouter.post(
  "/delete",
  userRequired,
  adminRequired,
  async (req, res, next) => {
    const { email } = req.body;
    console.log(email);
    try {
      const user = await prisma.User.findUnique({
        where: {
          email: email,
        },
      });
      await prisma.courseUser.deleteMany({ where: { user_id: user.id } });
      const deletedUser = await prisma.User.delete({
        where: {
          email: email,
        },
      });
      res.send(deletedUser);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = authRouter;
