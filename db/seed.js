const { PrismaClient } = require("@prisma/client");
var csv = require("jquery-csv");
const prisma = new PrismaClient();
const fs = require("fs");
const { parse } = require("csv-parse");
let users = [];
let courses = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createUsers = async () => {
  await prisma.User.deleteMany({});
  for (const user of users) {
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

const createCourses = async () => {
  await prisma.Course.deleteMany({});
  for (const course of courses) {
    await prisma.Course.create({
      data: {
        name: course[0],
        course_number: course[1],
        credit_hours: +course[2],
        // semester_id: +course[3],
        //semester_id: 0,
        monday: course[4] == "TRUE",
        tuesday: course[5] == "TRUE",
        wednesday: course[6] == "TRUE",
        thursday: course[7] == "TRUE",
        friday: course[8] == "TRUE",
        start_time: course[9],
        end_time: course[10],
        // start_time: "8:00",
        // end_time: "8:00",
        subject: course[11],
        location: course[12],
        description: course[13],
        capacity: +course[14],
        enrollment_open: course[15] == "TRUE",
        asynchronous: course[16] == "TRUE",
      },
    });
  }
};

const getUsers = async () => {
  var result = [];
  // Read user data
  fs.createReadStream("/home/nik/projects/classManager/db/users.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      // let user = csv.toArray(row);
      // console.log(user);
      result.push(row);
    })
    .on("end", function () {
      users = result;
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

const getCourses = async () => {
  var result = [];
  // Read user data
  result = [];
  fs.createReadStream("/home/nik/projects/classManager/db/courses.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      // let user = csv.toArray(row);
      // console.log(user);
      result.push(row);
      console.log(result.length);
    })
    .on("end", function () {
      courses = result;
      console.log(courses.length);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

const initDb = async () => {
  try {
    getUsers();
    getCourses();
    await sleep(1000);
    console.log(users.length);
    await createUsers();
    await createCourses();
    console.log("users created");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

initDb();
