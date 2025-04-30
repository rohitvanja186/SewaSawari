// tests/unit/loginController.test.js

const { loginUser  } = require("../controller/auth/authController");
const { users, owners } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// 1. Mock all external dependencies
jest.mock("../model", () => ({
  users: { findOne: jest.fn() },
  owners: { findOne: jest.fn() },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

// 2. A simple mock for Express res
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

describe("loginUser unit tests", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  test("400 if email or password missing", async () => {
    req = { body: { email: "a@b.com" } };  // password missing

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email and password are required.",
    });
  });

  test("404 if user not found", async () => {
    users.findOne.mockResolvedValue(null);

    req = { body: { email: "noone@x.com", password: "pw" } };
    await loginUser(req, res);

    expect(users.findOne).toHaveBeenCalledWith({ where: { email: "noone@x.com" } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User with that email does not exist.",
    });
  });

  test("403 if Vehicle Owner email not verified", async () => {
    // simulate found user with role Vehicle Owner
    users.findOne.mockResolvedValue({ id: 5, role: "Vehicle Owner", password: "hashed" });
    owners.findOne.mockResolvedValue({ email_confirm: false });

    req = { body: { email: "own@x.com", password: "pw" } };
    await loginUser(req, res);

    expect(owners.findOne).toHaveBeenCalledWith({ where: { userId: 5 } });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Email not verified." });
  });

  test("401 if password mismatch", async () => {
    users.findOne.mockResolvedValue({ id: 7, role: "Renter", password: "hashedpw" });
    bcrypt.compare.mockResolvedValue(false);

    req = { body: { email: "renter@x.com", password: "wrong" } };
    await loginUser(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith("wrong", "hashedpw");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid password." });
  });

  test("200 and returns token on success", async () => {
    users.findOne.mockResolvedValue({ id: 8, role: "Admin", password: "hashedpw" });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-jwt-token");

    req = { body: { email: "admin@x.com", password: "right" } };
    await loginUser(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 8, role: "Admin" },
      process.env.SECRETKEY,
      { expiresIn: "30d" }
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      token: "fake-jwt-token",
      role: "Admin",
    });
  });

  test("500 on unexpected error", async () => {
    users.findOne.mockRejectedValue(new Error("DB down"));

    req = { body: { email: "err@x.com", password: "pw" } };
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred during login.",
    });
  });
});
