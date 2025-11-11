/* eslint-env jest */

// Mocks dos módulos antes de importar o app
jest.mock("mysql2/promise", () => {
  const execute = jest.fn();
  return {
    createPool: jest.fn(() => ({ execute })),
    __executeMock: execute,
  };
});

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const request = require("supertest");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../app");

describe("Auth routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login - validações básicas", () => {
    it("should return 400 if username or password is missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "teste" }); // sem password

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Username e password são obrigatórios"
      );
    });
  });

  describe("POST /api/auth/login - comportamento com banco", () => {
    it("should return 401 if user is not found", async () => {
      // 1ª chamada ao pool.execute (SELECT ...) retorna lista vazia
      mysql.__executeMock.mockResolvedValueOnce([[]]);

      const res = await request(app).post("/api/auth/login").send({
        username: "naoexiste",
        password: "qualquer",
      });

      expect(mysql.__executeMock).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "Credenciais inválidas");
    });

    it("should return 200 and token when login is successful", async () => {
      const fakeUser = {
        id: 1,
        username: "john",
        password_hash: "hashed_password",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        user_type_name: "Admin",
      };

      // 1ª chamada: SELECT user...
      mysql.__executeMock.mockResolvedValueOnce([[fakeUser]]);
      // 2ª chamada: UPDATE last_login (não precisamos do resultado)
      mysql.__executeMock.mockResolvedValueOnce([{ affectedRows: 1 }]);

      // senha confere
      bcrypt.compare.mockResolvedValue(true);

      // token fake
      jwt.sign.mockReturnValue("fake-jwt-token");

      const res = await request(app).post("/api/auth/login").send({
        username: "john",
        password: "123456",
      });

      expect(mysql.__executeMock).toHaveBeenCalledTimes(2);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledTimes(1);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token", "fake-jwt-token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toMatchObject({
        id: fakeUser.id,
        username: fakeUser.username,
        name: `${fakeUser.first_name} ${fakeUser.last_name}`,
        email: fakeUser.email,
        userType: fakeUser.user_type_name,
      });
    });
  });

  describe("POST /api/auth/register - validações básicas", () => {
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          // body incompleto de propósito
          email: "teste@example.com",
          password: "123456",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Campos obrigatórios ausentes"
      );
    });
  });
});
