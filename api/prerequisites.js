const prisma = require("../db/prisma");
const { adminRequired } = require("./utils");
const prerequisiteRouter = require("express").Router();

// Create   Create prerequisite
prerequisiteRouter.post("/", adminRequired, async (req, res, next) => {
  try {
    const { course_id, prereq_id } = req.body;
    const prerequisite = await prisma.Prerequisite.create({
      data: {
        course_id,
        prereq_id,
      },
    });
    res.send(prerequisite);
  } catch (error) {
    next(error);
  }
});

// Read   Prerequisites for single course if id is provided,
//        all prerequisites for every course otherwise.
prerequisiteRouter.get("/", async (req, res, next) => {
  try {
    const { course_id } = req.body;
    if (course_id) {
      // Read     Read prerequisites for one course
      const prereqs = await prisma.Prerequisite.findMany({
        where: {
          course_id,
        },
      });
      res.send(prereqs);
    } else {
      // Read     Read all prerequisites
      const prereqs = await prisma.Prerequisite.findMany({});
      res.send(prereqs);
    }
  } catch (error) {
    next(error);
  }
});

// Update   Not necessary

// Delete   Delete Prerequisite
prerequisiteRouter.delete("/", async (req, res, next) => {
  try {
    const { course_id, prereq_id } = req.body;
    const deletedPrerequisites = await prisma.Prerequisite.deleteMany({
      where: {
        course_id,
        prereq_id,
      },
    });
    res.send(deletedPrerequisites);
  } catch (error) {
    next(error);
  }
});

module.exports = prerequisiteRouter;
