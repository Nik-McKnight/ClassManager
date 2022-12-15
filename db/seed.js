const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const { parse } = require("csv-parse");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getData = async (path) => {
  const promise = new Promise((resolve, reject) => {
    var result = [];
    fs.createReadStream(path)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        result.push(row);
      })
      .on("end", function () {
        console.log(`Read data from ${path.slice(35)}`);
      })
      .on("error", function (error) {
        console.log(error.message);
      });
    resolve(result);
  });

  return promise;
};

const createSemesters = async (semesters) => {
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
  console.log("Semesters seeded.");
};

const createEvents = async (events) => {
  await prisma.Event.deleteMany({});
  for (const event of events) {
    await prisma.Event.create({
      data: {
        name: event[0],
        start_date: event[1],
        end_date: event[2],
        is_holiday: event[3] === "TRUE",
      },
    });
  }
  console.log("Events seeded.");
};

const createCourses = async (courses) => {
  await prisma.Course.deleteMany({});
  for (const course of courses) {
    await prisma.Course.create({
      data: {
        name: course[0],
        course_number: course[1],
        credit_hours: +course[2],
        semester_id: +course[3],
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
  console.log("Courses seeded.");
};

const createPrerequisites = async (prerequisites) => {
  await prisma.Prerequisite.deleteMany({});
  for (const prerequisite of prerequisites) {
    await prisma.Prerequisite.create({
      data: {
        course_id: prerequisite[0],
        prereq_id: prerequisite[1],
      },
    });
  }
  console.log("Prerequisites seeded.");
};

const createUsers = async (users) => {
  await prisma.User.deleteMany({});
  let count = 0;
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user[7], SALT_ROUNDS);

    const school_id = user[0][0] + user[1][0] + ("" + count).padStart(5, "0");

    await prisma.User.create({
      data: {
        first_name: user[0],
        last_name: user[1],
        email: user[2],
        preferred_name: user[3],
        gpa: +user[4],
        address: user[5],
        phone: user[6],
        password: hashedPassword,
        is_admin: user[8] == "TRUE",
        school_id,
      },
    });
    count++;
  }
  console.log("Users seeded.");
};

const createCourseUsers = async (courseUsers) => {
  await prisma.CourseUser.deleteMany({});
  for (const courseUser of courseUsers) {
    await prisma.CourseUser.create({
      data: {
        course_id: +courseUser[0],
        user_id: +courseUser[1],
        is_instructor: courseUser[2] == "TRUE",
        is_ta: courseUser[3] == "TRUE",
        course_grade: +courseUser[4],
        is_enrolled: courseUser[5] == "TRUE",
      },
    });
  }
  console.log("CourseUsers seeded.");
};

const initDb = async () => {
  try {
    getData("/home/nik/projects/classManager/db/Semesters.csv").then((data) => {
      createSemesters(data);
    });
    await sleep(100);
    getData("/home/nik/projects/classManager/db/Holidays.csv").then((data) => {
      createEvents(data);
    });
    await sleep(100);
    getData("/home/nik/projects/classManager/db/courses.csv").then((data) => {
      createCourses(data);
    });
    await sleep(100);
    getData("/home/nik/projects/classManager/db/prerequisites.csv").then(
      (data) => {
        createPrerequisites(data);
      }
    );
    await sleep(100);
    getData("/home/nik/projects/classManager/db/users.csv").then((data) => {
      createUsers(data);
    });
    await sleep(60000);
    getData("/home/nik/projects/classManager/db/CourseUsers.csv").then(
      (data) => {
        createCourseUsers(data);
      }
    );
  } catch (error) {
    next(error);
  } finally {
    console.log("Data has been seeded.");
    await prisma.$disconnect();
  }
};

initDb();
