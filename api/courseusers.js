const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const { userRequired, adminRequired } = require("./utils");
const courseUserRouter = require("express").Router();

const SALT_ROUNDS = 10;

//create   add student to class
//read     all courseusers
//read     all users one class
//read     all classes one user
//update   one user   is_instructor  is_ta   course_grade    is_enrolled
//delete   drop class before semester starts

module.exports = courseUserRouter;
