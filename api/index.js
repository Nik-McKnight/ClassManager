const apiRouter = require("express").Router();
const cookieParser = require("cookie-parser");
require("dotenv").config();

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is complete!",
  });
});

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});

apiRouter.use(cookieParser(process.env.COOKIE_SECRET));
apiRouter.use("/auth", require("./auth"));
apiRouter.use("/users", require("./users"));
apiRouter.use("/courses", require("./courses"));
apiRouter.use("/courseusers", require("./courseusers"));
apiRouter.use("/events", require("./events"));
apiRouter.use("/semesters", require("./semesters"));
apiRouter.use("/prerequisites", require("./prerequisites"));

apiRouter.get("*", (req, res, next) => {
  res.statusCode = 404;
  res.send({ message: "Uh oh, what r u looking for?" });
});

apiRouter.use((err, req, res, next) => {
  console.error(err.stack);

  if (!err.status) {
    res.status(500).send(err);
  }

  res.status(err.status).send(err.message, err.name, err.error);
});

module.exports = apiRouter;
