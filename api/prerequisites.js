const prisma = require("../db/prisma");
const { adminRequired } = require("./utils");
const prerequisiteRouter = require("express").Router();

// Create   Create prereq
prerequisiteRouter.post("/", adminRequired, async (req, res, next) => {
  try {
    const { course_id, prereq_id } = req.body;
    const prerequisite = await prisma.Prerequisite.create({
      data: {
        course_id,
        prereq_id,
      },
    });
    if (prerequisite) {
      res.send(prerequisite);
    }
  } catch (error) {
    console.error(error);
  }
});

// Read
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
      if (prereqs) {
        res.send(prereqs);
      }
    } else {
      // Read     Read all prerequisites
      const prereqs = await prisma.Prerequisite.findMany({});
      if (prereqs) {
        res.send(prereqs);
      }
    }
  } catch (error) {
    console.error(error);
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
    if (deletedPrerequisites) {
      res.send(deletedPrerequisites);
    } else {
      res.send("No prerequisites to delete.");
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = prerequisiteRouter;
