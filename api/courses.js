const prisma = require("../db/prisma");
const { userRequired, adminRequired } = require("./utils");
const courseRouter = require("express").Router();

courseRouter.post("/", adminRequired, async (req, res, next) => {
  let course;
  try {
    const {
      name,
      course_number,
      credit_hours,
      semester_id,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      start_time,
      end_time,
      subject,
      location,
      description,
      capacity,
      enrollment_open,
      asynchronous,
    } = req.body;
    course = await prisma.Course.create({
      data: {
        name: name,
        course_number: course_number,
        credit_hours: credit_hours,
        semester_id: semester_id,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        start_time: start_time,
        end_time: end_time,
        subject: subject,
        location: location,
        description: description,
        capacity: capacity,
        enrollment_open: enrollment_open,
        asynchronous: asynchronous,
      },
    });
  } catch (error) {
    console.log(error);
  }
  if (course) {
    res.send({ course });
  } else res.send("Course was not created.");
});

courseRouter.post("/duplicate", adminRequired, async (req, res, next) => {
  let course, duplicateCourse;
  try {
    const {
      id,
      name,
      course_number,
      credit_hours,
      semester_id,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      start_time,
      end_time,
      subject,
      location,
      description,
      capacity,
      enrollment_open,
      asynchronous,
    } = req.body;
    course = await prisma.Course.findUnique({
      where: {
        id: +id,
      },
    });
    if (course) {
      duplicateCourse = await prisma.Course.create({
        data: {
          name: name ? name : course.name,
          course_number: course_number ? course_number : course.course_number,
          credit_hours: credit_hours ? credit_hours : course.credit_hours,
          semester_id: semester_id ? semester_id : course.semester_id,
          monday: monday ? monday : course.monday,
          tuesday: tuesday ? tuesday : course.tuesday,
          wednesday: wednesday ? wednesday : course.wednesday,
          thursday: thursday ? thursday : course.thursday,
          friday: friday ? friday : course.friday,
          start_time: start_time ? start_time : course.start_time,
          end_time: end_time ? end_time : course.end_time,
          subject: subject ? subject : course.subject,
          location: location ? location : course.location,
          description: description ? description : course.description,
          capacity: capacity ? capacity : course.capacity,
          enrollment_open:
            enrollment_open !== course.enrollment_open
              ? enrollment_open
              : course.enrollment_open,
          asynchronous: asynchronous ? asynchronous : course.asynchronous,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
  if (duplicateCourse) {
    res.send({ duplicateCourse, course });
  } else res.send("Course was not duplicated.");
});

courseRouter.get("/", async (req, res, next) => {
  const { id } = req.body;

  try {
    if (id) {
      const course = await prisma.Course.findUnique({
        where: {
          id: +id,
        },
      });
      if (course) {
        res.send(course);
      } else res.send(`No course found.`);
    } else {
      const courses = await prisma.Course.findMany({});
      if (courses) {
        res.send(courses);
      } else res.send(`No courses found.`);
    }
  } catch (error) {
    next(error);
  }
});

courseRouter.patch("/:id", adminRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await prisma.Course.findUnique({
      where: {
        id: +id,
      },
    });
    if (course) {
      const {
        id,
        name,
        course_number,
        credit_hours,
        semester_id,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        start_time,
        end_time,
        subject,
        location,
        description,
        capacity,
        enrollment_open,
        asynchronous,
      } = req.body;
      const updatedCourse = await prisma.Course.update({
        where: {
          id: +id,
        },
        data: {
          name: name ? name : course.name,
          course_number: course_number ? course_number : course.course_number,
          credit_hours: credit_hours ? credit_hours : course.credit_hours,
          semester_id: semester_id ? semester_id : course.semester_id,
          monday: monday ? monday : course.monday,
          tuesday: tuesday ? tuesday : course.tuesday,
          wednesday: wednesday ? wednesday : course.wednesday,
          thursday: thursday ? thursday : course.thursday,
          friday: friday ? friday : course.friday,
          start_time: start_time ? start_time : course.start_time,
          end_time: end_time ? end_time : course.end_time,
          subject: subject ? subject : course.subject,
          location: location ? location : course.location,
          description: description ? description : course.description,
          capacity: capacity ? capacity : course.capacity,
          enrollment_open:
            enrollment_open !== course.enrollment_open
              ? enrollment_open
              : course.enrollment_open,
          asynchronous: asynchronous ? asynchronous : course.asynchronous,
        },
      });
      res.send({ updatedCourse });
    }
  } catch (error) {
    next(error);
  }
});

courseRouter.delete("/", adminRequired, async (req, res, next) => {
  const { id } = req.body;
  let course;
  try {
    course = await prisma.Course.findUnique({
      where: {
        id: +id,
      },
    });
    if (course) {
      await prisma.courseUser.deleteMany({ where: { course_id: course.id } });
      const deletedCourse = await prisma.Course.delete({
        where: {
          id: course.id,
        },
      });
      res.send(deletedCourse);
    } else res.send(`No course with that id exists.`);
  } catch (error) {
    next(error);
  }
});

module.exports = courseRouter;
