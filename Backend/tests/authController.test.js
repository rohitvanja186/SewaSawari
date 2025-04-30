const { registerUser } = require("../controller/auth/authController");
const { users, owners, otps } = require("../model");
const bcrypt = require("bcrypt");
const OtpEmail = require("../services/sendEmail");

// 2. Mock every external dependency
jest.mock("../model", () => ({
  users: { findOne: jest.fn(), create: jest.fn() },
  owners: { create: jest.fn() },
  otps:   { create: jest.fn() },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../services/sendEmail", () => jest.fn());

// 3. Helper to simulate Express req/res
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

describe("registerUser unit tests", () => {
  let req, res;

  beforeEach(() => {
    // reset mocks
    jest.clearAllMocks();
    res = mockResponse();
  });

  test("400 if required fields missing", async () => {
    req = { body: { email: "a@b.com" } };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All user fields are required.",
    });
  });

  test("400 if role invalid", async () => {
    req = {
      body: {
        full_name: "A",
        email: "a@b.com",
        phone_number: "123",
        password: "pw",
        role: "NotARole",
      },
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid role provided.",
    });
  });

  test("400 if email already exists", async () => {
    // simulate existing user
    users.findOne.mockResolvedValue({ id: 1, email: "a@b.com" });
    req = {
      body: {
        full_name: "A",
        email: "a@b.com",
        phone_number: "123",
        password: "pw",
      },
    };

    await registerUser(req, res);

    expect(users.findOne).toHaveBeenCalledWith({ where: { email: "a@b.com" } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email already registered.",
    });
  });

  test("201 and OTP flow for Renter", async () => {
    users.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedpw");
    users.create.mockResolvedValue({ id: 42, email: "a@b.com" });

    req = {
      body: {
        full_name: "A",
        email: "a@b.com",
        phone_number: "123",
        password: "pw",
      },
    };

    // call
    await registerUser(req, res);

    // hashed, created & OTP created + email sent
    expect(bcrypt.hash).toHaveBeenCalledWith("pw", 10);
    expect(users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: "A",
        email: "a@b.com",
        phone_number: "123",
        password: "hashedpw",
        role: "Renter",
      })
    );
    expect(otps.create).toHaveBeenCalledWith(
      expect.objectContaining({
        purpose: "Registration",
        userId: 42,
        hashedOtp: expect.any(Number),
        isUsed: false,
      })
    );
    expect(OtpEmail).toHaveBeenCalledWith({
      email: "a@b.com",
      subject: "Email verification OTP",
      otp: expect.any(Number),
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully. Please verify your email.",
    });
  });

  test("201 for Vehicle Owner but missing business fields", async () => {
    users.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hpw");
    users.create.mockResolvedValue({ id: 10, email: "own@ex.com" });

    req = {
      body: {
        full_name: "Own",
        email: "own@ex.com",
        phone_number: "999",
        password: "pw",
        role: "Vehicle Owner",
        // missing business_name, description, location
      },
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Vehicle Owner registration requires business_name, description, and location (latitude/longitude).",
    });
  });

  test("201 for Vehicle Owner happy path", async () => {
    users.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hpw");
    users.create.mockResolvedValue({ id: 20, email: "own@ex.com" });

    req = {
      body: {
        full_name: "Own",
        email: "own@ex.com",
        phone_number: "999",
        password: "pw",
        role: "Vehicle Owner",
        business_name: "Biz",
        description: "Desc",
        location: { latitude: 1.23, longitude: 4.56 },
        operating_hours: "9-5",
      },
    };

    await registerUser(req, res);

    expect(owners.create).toHaveBeenCalledWith({
      business_name: "Biz",
      description: "Desc",
      latitude: 1.23,
      longitude: 4.56,
      operating_hours: "9-5",
      userId: 20,
      email_confirm: false,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vehicle owner sent for verification.",
    });
  });

  test("500 on unexpected error", async () => {
    // simulate throw
    users.findOne.mockRejectedValue(new Error("DB down"));
    req = {
      body: {
        full_name: "X",
        email: "x@z.com",
        phone_number: "111",
        password: "pw",
      },
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while registering the user.",
    });
  });
});
