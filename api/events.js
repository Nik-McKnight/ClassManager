const prisma = require("../db/prisma");
const { adminRequired } = require("./utils");
const eventRouter = require("express").Router();

// Create   Create new event
eventRouter.post("/", adminRequired, async (req, res, next) => {
  try {
    const { name, start_date, end_date, is_holiday } = req.body;
    const event = await prisma.Event.create({
      data: {
        name,
        start_date,
        end_date,
        is_holiday,
      },
    });
    if (event) {
      res.send(event);
    }
  } catch (error) {
    console.error(error);
  }
});

// Read
eventRouter.get("/", async (req, res, next) => {
  try {
    const { id } = req.body;
    if (id) {
      // Read     Read single event
      const event = await prisma.Event.findUnique({
        where: {
          id: +id,
        },
      });
      if (event) {
        res.send(event);
      }
    } else {
      // Read     Read all events
      const events = await prisma.Event.findMany({});
      if (events) {
        res.send(events);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

// Update   Update event name, start date, end date, is_holiday
eventRouter.patch("/", adminRequired, async (req, res, next) => {
  try {
    const { id, name, start_date, end_date, is_holiday } = req.body;
    const event = await prisma.Event.findUnique({
      where: {
        id: +id,
      },
    });
    const updatedEvent = await prisma.Event.update({
      where: {
        id: +id,
      },
      data: {
        name: name ? name : event.name,
        start_date: start_date ? start_date : event.start_date,
        end_date: end_date ? end_date : event.end_date,
        is_holiday:
          is_holiday || is_holiday === false ? is_holiday : event.is_holiday,
      },
    });
    if (updatedEvent) {
      res.send(updatedEvent);
    }
  } catch (error) {
    console.error(error);
  }
});

// Delete   Not necessary

module.exports = eventRouter;
