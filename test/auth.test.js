const { server, handle } = require("../index");

const supertest = require("supertest");
const request = supertest(server);
const expect = require("expect");

describe("/api/auth/health endpoint", () => {
  // close db connection and supertest server tcp connection
  after(async () => {
    // await client.end();
    handle.close();
  });

  it("should respond with { healthy: true }", async () => {
    const response = await request.get("/api/auth/health");
    expect(response.status).toBe(200);
    expect(response.body.healthy).toBe(true);
  });
});

describe("/api/auth/(invalid) endpoint", () => {
  // close db connection and supertest server tcp connection
  after(async () => {
    // await client.end();
    handle.close();
  });

  it("should respond with 'Uh oh, what r u looking for?!'", async () => {
    const response = await request.get("/api/auth/hgtaehrtea");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Uh oh, what r u looking for?");
  });
});

describe("/api/auth/register", () => {
  // close db connection and supertest server tcp connection
  after(async () => {
    // await client.end();
    handle.close();
  });

  it("should POST JSON", function (done) {
    request
      .post("/api/auth/register")
      .send({
        first_name: "Test",
        last_name: "McTest",
        email: "Test@Test.com",
        preferred_name: "TMT",
        gpa: 3.9,
        address: "Test St",
        phone: "1234567890",
        password: "test",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Cookie", [
        "token=hththtea", // <-- No 'express:sess' (Cropped for demo)
      ])
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        console.log(res.body);
        done();
      });
  });

  it("should not POST JSON bad email", function (done) {
    request
      .post("/api/auth/register")
      .send({
        first_name: "Test",
        last_name: "McTest",
        email: "Test@Test.com",
        preferred_name: "TMT",
        gpa: 3.9,
        address: "Test St",
        phone: "1234567890",
        password: "test",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(401)
      .expect("A user with that email already exists.")
      .end(function (err, res) {
        done(err);
      });
  });
});

describe("/api/auth/login endpoint", () => {
  // close db connection and supertest server tcp connection
  after(async () => {
    // await client.end();
    handle.close();
  });

  it("should POST JSON", function (done) {
    request
      .post("/api/auth/login")
      .send({
        email: "Test@Test.com",
        password: "test",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        console.log(res.body);
        done();
      });
  });

  it("should POST JSON", function (done) {
    request
      .post("/api/auth/login")
      .send({
        email: "Test@Test.com",
        password: "test",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        console.log(res.body);
        done();
      });
  });
});

// describe("/api/auth/logout endpoint", () => {
//   // close db connection and supertest server tcp connection
//   after(async () => {
//     // await client.end();
//     handle.close();
//   });

//   it("should respond with 'Uh oh, what r u looking for?!'", async () => {
//     const response = await request.get("/api/auth/hgtaehrtea");
//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe("Uh oh, what r u looking for?");
//   });
// });
