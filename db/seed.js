// const prisma = require("../prisma");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const fs = require("fs");
const { parse } = require("csv-parse");

let users = [];
const createUsers = async () => {
  // await fs
  //   .createReadStream("/home/nik/projects/classManager/db/users.csv")
  //   .pipe(parse({ delimiter: ",", from_line: 2 }))
  //   .on("data", function (row) {
  //     // users.push(row);
  //     // console.log(row);
  //   })
  //   .on("end", function () {
  //     console.log("finished importing users");
  //   })
  //   .on("error", function (error) {
  //     console.log(error.message);
  //   });
  // console.log(users.size);
  for (const user of users) {
    await prisma.User.create({
      data: {
        first_name: user[0],
        last_name: user[1],
        email: user[3],
        preferred_name: user[2],
        gpa: user[4],
        address: user[5],
        phone: user[6],
      },
    });
  }
};

const initDb = async () => {
  await fs
    .createReadStream("/home/nik/projects/classManager/db/users.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      // users.push(row);
      // console.log(row);
    })
    .on("end", function () {
      console.log("finished importing users");
    })
    .on("error", function (error) {
      console.log(error.message);
    });
  console.log(users.size);
  try {
    await createUsers();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

initDb();
