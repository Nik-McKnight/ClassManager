const { PrismaClient } = require("@prisma/client");
var csv = require("jquery-csv");
const prisma = new PrismaClient();
const fs = require("fs");
const { parse } = require("csv-parse");
let users = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createUsers = async (arr) => {
  await prisma.User.deleteMany({});
  console.log(arr.length);
  for (const user of arr) {
    console.log(user[0]);
    await prisma.User.create({
      data: {
        first_name: user[0],
        last_name: user[1],
        email: user[2],
        preferred_name: user[3],
        gpa: +user[4],
        address: user[5],
        phone: user[6],
      },
    });
  }
};

const getData = async (arr) => {
  var result = [];
  fs.createReadStream("/home/nik/projects/classManager/db/users.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      // let user = csv.toArray(row);
      // console.log(user);
      result.push(row);
      console.log(result.length);
    })
    .on("end", function () {
      arr = result;
      users = result;
      console.log(users.length);
      console.log("finished");
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

const initDb = async () => {
  try {
    getData(users);
    await sleep(1000);
    console.log(users.length);
    await createUsers(users);
    console.log("users created");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

initDb();
