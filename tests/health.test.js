/* eslint-env jest */

const request = require("supertest");
const app = require("../app");

describe("Health Check", () => {
  it("should return 200 and status ok on GET /health", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});
