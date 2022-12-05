const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userRequired, adminRequired } = require("./utils");
const userRouter = require("express").Router();

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

userRouter.post(
  "/create",
  userRequired,
  adminRequired,
  async (req, res, next) => {
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
      console.log(error);
    }
    if (user) {
      delete user.password;

      res.send({ user });
    } else res.send("A user with that email already exists.");
  }
);

userRouter.post(
  "/delete",
  userRequired,
  adminRequired,
  async (req, res, next) => {
    const { email, id } = req.body;
    let user;
    try {
      if (id) {
        user = await prisma.User.findUnique({
          where: {
            id: +id,
          },
        });
      } else if (email) {
        user = await prisma.User.findUnique({
          where: {
            email: email,
          },
        });
      }
      if (user) {
        await prisma.courseUser.deleteMany({ where: { user_id: user.id } });
        const deletedUser = await prisma.User.delete({
          where: {
            id: user.id,
          },
        });
        res.send(deletedUser);
      } else res.send(`No account found.`);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
