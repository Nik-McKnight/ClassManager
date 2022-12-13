const prisma = require("../db/prisma");
const { userRequired, adminRequired } = require("./utils");
const courseUserRouter = require("express").Router();

//create   add self to class
courseUserRouter.post("/", userRequired, async (req, res, next) => {
  let courseUser;
  try {
    const { course_id, is_instructor, is_ta, course_grade, is_enrolled } =
      req.body;
    courseUser = await prisma.CourseUser.create({
      data: {
        course_id,
        user_id: req.user.id,
        is_instructor: is_instructor === true,
        is_ta: is_ta === true,
        course_grade: course_grade ? course_grade : 100,
        is_enrolled: is_enrolled === true,
      },
    });
  } catch (error) {
    console.log(error);
  }
  if (courseUser) {
    res.send({ courseUser });
  } else res.send("User was not added to course.");
});

//create   add another user to class
courseUserRouter.post("/:id", adminRequired, async (req, res, next) => {
  let courseUser;
  try {
    const { id } = req.params;
    const { course_id, is_instructor, is_ta, course_grade, is_enrolled } =
      req.body;
    courseUser = await prisma.CourseUser.create({
      data: {
        course_id,
        user_id: +id,
        is_instructor: is_instructor === true,
        is_ta: is_ta === true,
        course_grade: course_grade ? course_grade : 100,
        is_enrolled: is_enrolled === true,
      },
    });
  } catch (error) {
    console.log(error);
  }
  if (courseUser) {
    res.send({ courseUser });
  } else res.send("User was not added to course.");
});

//read     all courseusers
courseUserRouter.get("/all", adminRequired, async (req, res, next) => {
  let courseUsers;

  try {
    courseUsers = await prisma.CourseUser.findMany({
      include: {
        course: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
            preferred_name: true,
            email: true,
          },
        },
      },
    });
    if (courseUsers) {
      res.send(courseUsers);
    } else res.send(`No courseUsers found.`);
  } catch (error) {
    next(error);
  }
});

//read     all classes for self
courseUserRouter.get("/", userRequired, async (req, res, next) => {
  let courseUsers;
  try {
    const user = req.user;
    const { user_id } = req.body;
    courseUsers = await prisma.CourseUser.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        course: true,
      },
    });
    if (courseUsers) {
      res.send(courseUsers);
    } else res.send(`No courseUsers found.`);
  } catch (error) {
    next(error);
  }
});

//read     all classes for another user
courseUserRouter.get("/user", adminRequired, async (req, res, next) => {
  let courseUsers;
  try {
    const { user_id } = req.body;
    courseUsers = await prisma.CourseUser.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        course: true,
      },
    });
    if (courseUsers) {
      res.send(courseUsers);
    } else res.send(`No courseUsers found.`);
  } catch (error) {
    next(error);
  }
});

//read     all users in one class
courseUserRouter.get("/course", userRequired, async (req, res, next) => {
  let courseUsers;
  try {
    const { course_id } = req.body;
    courseUsers = await prisma.CourseUser.findMany({
      where: {
        course_id: course_id,
      },
      include: {
        course: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
            preferred_name: true,
            email: true,
          },
        },
      },
    });
    if (courseUsers) {
      res.send(courseUsers);
    } else res.send(`No courseUsers found.`);
  } catch (error) {
    next(error);
  }
});

//update   one user  is_enrolled
courseUserRouter.patch("/", userRequired, async (req, res, next) => {
  try {
    const { user_id, course_id, is_enrolled } = req.body;
    const courseUser = await prisma.CourseUser.findMany({
      where: {
        user_id: +user_id,
        course_id: +course_id,
      },
    });
    const updatedCourseUser = await prisma.CourseUser.update({
      where: {
        id: courseUser[0].id,
      },
      data: {
        is_enrolled:
          is_enrolled || is_enrolled === false
            ? is_enrolled
            : courseUser[0].is_enrolled,
      },
    });
    res.send({ updatedCourseUser });
  } catch (error) {
    next(error);
  }
});

//update   one user   is_instructor  is_ta   course_grade    is_enrolled
courseUserRouter.patch(
  "/:courseUser_id",
  adminRequired,
  async (req, res, next) => {
    try {
      const { courseUser_id } = req.params;
      const { is_instructor, is_ta, course_grade, is_enrolled } = req.body;
      const updatedCourseUser = await prisma.CourseUser.update({
        where: {
          id: +courseUser_id,
        },
        data: {
          is_instructor,
          is_ta,
          course_grade,
          is_enrolled,
        },
      });
      res.send({ updatedCourseUser });
    } catch (error) {
      next(error);
    }
  }
);

//update   All users in one class  is_enrolled
courseUserRouter.patch(
  "/:course_id/all",
  adminRequired,
  async (req, res, next) => {
    try {
      const { course_id } = req.params;
      const { is_enrolled } = req.body;
      const updatedCourseUsers = await prisma.CourseUser.updateMany({
        where: {
          course_id: +course_id,
        },
        data: {
          is_enrolled,
        },
      });
      res.send({ updatedCourseUsers });
    } catch (error) {
      next(error);
    }
  }
);

//delete   drop class before semester starts
courseUserRouter.delete("/", userRequired, async (req, res, next) => {
  const { course_id } = req.body;
  const user_id = req.user.id;
  try {
    const droppedCourse = await prisma.CourseUser.deleteMany({
      where: {
        user_id: +user_id,
        course_id: +course_id,
      },
    });
    res.send(droppedCourse);
  } catch (error) {
    next(error);
  }
});

//delete   Remove user from class before semester starts
courseUserRouter.delete(
  "/:courseUser_id",
  adminRequired,
  async (req, res, next) => {
    const { courseUser_id } = req.params;
    try {
      const droppedCourse = await prisma.CourseUser.deleteMany({
        where: {
          id: +courseUser_id,
        },
      });
      res.send(droppedCourse);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = courseUserRouter;
