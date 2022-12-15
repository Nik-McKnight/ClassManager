const prisma = require("../db/prisma");
const { userRequired, adminRequired } = require("./utils");
const semesterRouter = require("express").Router();

semesterRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// Create   Add new semester
semesterRouter.post("/", adminRequired, async (req, res, next) => {
  try {
    const { name, start_date, end_date } = req.body;
    const semester = await prisma.Semester.create({
      data: {
        name,
        start_date,
        end_date,
      },
    });
    res.send(semester);
  } catch (error) {
    next(error);
  }
});

// Read     Read all semesters
semesterRouter.get("/", async (req, res, next) => {
  try {
    const semesters = await prisma.Semester.findMany({});
    res.send(semesters);
  } catch (error) {
    next(error);
  }
});

// Update   Update semester start date and end date
semesterRouter.patch("/", async (req, res, next) => {
  try {
    const { id, name, start_date, end_date } = req.body;
    const semester = await prisma.Semester.findUnique({
      where: {
        id: +id,
      },
    });
    const updatedSemester = await prisma.Semester.update({
      where: {
        id: +id,
      },
      data: {
        name: name ? name : semester.name,
        start_date: start_date ? start_date : semester.start_date,
        end_date: end_date ? end_date : semester.end_date,
      },
    });
    res.send(updatedSemester);
  } catch (error) {
    next(error);
  }
});

// Delete   Not necessary

module.exports = semesterRouter;
