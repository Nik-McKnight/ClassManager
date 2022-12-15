const { server, handle } = require("../index");

const supertest = require("supertest");
const request = supertest(server);
const expect = require("expect");

describe("/api/health endpoint", () => {
  // close db connection and supertest server tcp connection
  after(async () => {
    // await client.end();
    handle.close();
  });

  it("should respond with { healthy: true }", async () => {
    const response = await request.get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.healthy).toBe(true);
  });
});

describe("/api/ endpoint", () => {
  // close db connection and supertest server tcp connection
  after(async () => {
    // await client.end();
    handle.close();
  });

  it("should respond with 'API is complete!'", async () => {
    const response = await request.get("/api/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("API is complete!");
  });
});

describe("/api/(invalid) endpoint", () => {
  // close db connection and supertest server tcp connection
  after(async () => {
    // await client.end();
    handle.close();
  });

  it("should respond with 'Uh oh, what r u looking for?!'", async () => {
    const response = await request.get("/api/hgtaehrtea");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Uh oh, what r u looking for?");
  });
});
