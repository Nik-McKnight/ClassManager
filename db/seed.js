const { PrismaClient } = require("@prisma/client");
var csv = require("jquery-csv");
const prisma = new PrismaClient();
const fs = require("fs");
const { parse } = require("csv-parse");
let users = [];
let courses = [];
let holidays = [];
let prerequisites = [];
let semesters = [];
let courseUsers = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createSemesters = async () => {
  await prisma.Semester.deleteMany({});
  for (const semester of semesters) {
    await prisma.Semester.create({
      data: {
        name: semester[0],
        start_date: semester[1],
        end_date: semester[2],
      },
    });
  }
};

const createHolidays = async () => {
  await prisma.Holiday.deleteMany({});
  for (const holiday of holidays) {
    await prisma.Holiday.create({
      data: {
        name: holiday[0],
        start_date: holiday[1],
        end_date: holiday[2],
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
        semester_id: +course[3],
        //semester_id: 0,
        monday: course[4] == "TRUE",
        tuesday: course[5] == "TRUE",
        wednesday: course[6] == "TRUE",
        thursday: course[7] == "TRUE",
        friday: course[8] == "TRUE",
        start_time: course[9],
        end_time: course[10],
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

const createPrerequisites = async () => {
  await prisma.Prerequisite.deleteMany({});
  for (const prerequisite of prerequisites) {
    await prisma.Prerequisite.create({
      data: {
        course_id: prerequisite[0],
        prereq_id: prerequisite[1],
      },
    });
  }
};

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

const createCourseUsers = async () => {
  await prisma.CourseUser.deleteMany({});
  for (const courseUser of courseUsers) {
    await prisma.CourseUser.create({
      data: {
        course_id: +courseUser[0],
        user_id: +courseUser[1],
        is_instructor: courseUser[2] == "TRUE",
        is_ta: courseUser[3] == "TRUE",
      },
    });
  }
};

const getUsers = async () => {
  var result = [];
  fs.createReadStream("/home/nik/projects/classManager/db/users.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
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
  fs.createReadStream("/home/nik/projects/classManager/db/courses.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
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

const getHolidays = async () => {
  var result = [];
  fs.createReadStream("/home/nik/projects/classManager/db/Holidays.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      result.push(row);
      console.log(result.length);
    })
    .on("end", function () {
      holidays = result;
      console.log(holidays.length);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

const getSemesters = async () => {
  var result = [];
  fs.createReadStream("/home/nik/projects/classManager/db/Semesters.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      result.push(row);
      console.log(result.length);
    })
    .on("end", function () {
      semesters = result;
      console.log(semesters.length);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

const getPrerequisites = async () => {
  var result = [];
  fs.createReadStream("/home/nik/projects/classManager/db/prerequisites.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      result.push(row);
      console.log(result.length);
    })
    .on("end", function () {
      prerequisites = result;
      console.log(prerequisites.length);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

const getCourseUsers = async () => {
  var result = [];
  fs.createReadStream("/home/nik/projects/classManager/db/CourseUsers.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      result.push(row);
      console.log(result.length);
    })
    .on("end", function () {
      courseUsers = result;
      console.log(courseUsers.length);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

const initDb = async () => {
  try {
    getSemesters();
    getHolidays();
    getCourses();
    getPrerequisites();
    getUsers();
    getCourseUsers();
    await sleep(2000);
    await createSemesters();
    await createHolidays();
    await createCourses();
    await createPrerequisites();
    await createUsers();
    await createCourseUsers();
    console.log("Database seeded");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

initDb();
