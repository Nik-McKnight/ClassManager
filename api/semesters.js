const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const { userRequired, adminRequired } = require("./utils");
const semesterRouter = require("express").Router();

const SALT_ROUNDS = 10;

module.exports = semesterRouter;
