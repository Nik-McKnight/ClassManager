const prisma = require("../db/prisma");
const { userRequired, adminRequired } = require("./utils");
const courseRouter = require("express").Router();

courseRouter.post(
  "/create",
  userRequired,
  adminRequired,
  async (req, res, next) => {
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
  }
);

//duplicate

// get specific course
// get many courses
courseRouter.get("/read", async (req, res, next) => {
  const { id } = req.body;
  let user;
  try {
    user = await prisma.User.findUnique({
      where: {
        id: +id,
      },
    });
    if (user) {
      res.send(user);
    } else res.send(`No account found.`);
  } catch (error) {
    next(error);
  }
});

courseRouter.patch("/update", userRequired, async (req, res, next) => {
  try {
    const user = req.user;
    const id = user.id;
    const { first_name, last_name, preferred_name, address, phone, password } =
      req.body;
    const updatedUser = await prisma.User.update({
      where: {
        id,
      },
      data: {
        first_name: first_name ? first_name : user.first_name,
        last_name: last_name ? last_name : user.last_name,
        preferred_name: preferred_name ? preferred_name : user.preferred_name,
        address: address ? address : user.address,
        phone: phone ? phone : user.phone,
        password: password ? password : user.password,
      },
    });
    res.send({ updatedUser });
  } catch (error) {
    next(error);
  }
});

courseRouter.patch(
  "/update/:id",
  userRequired,
  adminRequired,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await prisma.User.findUnique({
        where: {
          id: +id,
        },
      });
      if (user) {
        const {
          first_name,
          last_name,
          email,
          preferred_name,
          gpa,
          address,
          phone,
          password,
          is_admin,
        } = req.body;
        const updatedUser = await prisma.User.update({
          where: {
            id: +id,
          },
          data: {
            first_name: first_name ? first_name : user.first_name,
            last_name: last_name ? last_name : user.last_name,
            email: email ? email : user.email,
            preferred_name: preferred_name
              ? preferred_name
              : user.preferred_name,
            gpa: gpa ? gpa : user.gpa,
            address: address ? address : user.address,
            phone: phone ? phone : user.phone,
            password: password ? password : user.password,
            is_admin: is_admin ? is_admin == "TRUE" : user.is_admin,
          },
        });
        res.send({ updatedUser });
      }
    } catch (error) {
      next(error);
    }
  }
);

courseRouter.post(
  "/delete",
  userRequired,
  adminRequired,
  async (req, res, next) => {
    const { email, id } = req.body;
    let user;
    try {
      if (id) {
        user = await prisma.User.findUnique({
          where: {
            id: +id,
          },
        });
      } else if (email) {
        user = await prisma.User.findUnique({
          where: {
            email: email,
          },
        });
      }
      if (user) {
        await prisma.courseUser.deleteMany({ where: { user_id: user.id } });
        const deletedUser = await prisma.User.delete({
          where: {
            id: user.id,
          },
        });
        res.send(deletedUser);
      } else res.send(`No account found.`);
    } catch (error) {
      next(error);
    }
  }
);
