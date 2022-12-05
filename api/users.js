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

userRouter.get("/read", userRequired, adminRequired, async (req, res, next) => {
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
      res.send(user);
    } else res.send(`No account found.`);
  } catch (error) {
    next(error);
  }
});

userRouter.patch("/update", userRequired, async (req, res, next) => {
  try {
    const user = req.user;
    const id = user.id;
    const { first_name, last_name, preferred_name, address, phone, password } =
      req.body;
    const updatedUser = await prisma.User.update({
      where: {
        id,
      },
      data: {
        first_name: first_name ? first_name : user.first_name,
        last_name: last_name ? last_name : user.last_name,
        preferred_name: preferred_name ? preferred_name : user.preferred_name,
        address: address ? address : user.address,
        phone: phone ? phone : user.phone,
        password: password ? password : user.password,
      },
    });
    res.send({ updatedUser });
  } catch (error) {
    next(error);
  }
});

userRouter.patch(
  "/update/:id",
  userRequired,
  adminRequired,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await prisma.User.findUnique({
        where: {
          id: +id,
        },
      });
      if (user) {
        const {
          first_name,
          last_name,
          email,
          preferred_name,
          gpa,
          address,
          phone,
          password,
          is_admin,
        } = req.body;
        const updatedUser = await prisma.User.update({
          where: {
            id: +id,
          },
          data: {
            first_name: first_name ? first_name : user.first_name,
            last_name: last_name ? last_name : user.last_name,
            email: email ? email : user.email,
            preferred_name: preferred_name
              ? preferred_name
              : user.preferred_name,
            gpa: gpa ? gpa : user.gpa,
            address: address ? address : user.address,
            phone: phone ? phone : user.phone,
            password: password ? password : user.password,
            is_admin: is_admin ? is_admin == "TRUE" : user.is_admin,
          },
        });
        res.send({ updatedUser });
      }
    } catch (error) {
      next(error);
    }
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
