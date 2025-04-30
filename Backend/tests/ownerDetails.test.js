// tests/ownerDetails.test.js

const { ownerDetails } = require("../controller/auth/adminController")
const { owners, users } = require("../model");

// Mock the models
jest.mock("../model", () => ({
  owners: { findByPk: jest.fn() },
  users:   {}, // placeholder for include
}));

// Suppress console.error output during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Helper to mock Express response
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json   = jest.fn().mockReturnThis();
  return res;
}

describe("ownerDetails unit tests", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  test("404 when owner not found", async () => {
    owners.findByPk.mockResolvedValue(null);
    req = { params: { id: "1" } };

    await ownerDetails(req, res);

    expect(owners.findByPk).toHaveBeenCalledWith("1", { include: { model: users } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Owner not found" });
  });

  test("200 and returns owner details when found", async () => {
    const fakeOwner = { id: 2, business_name: "Biz", users: { id: 3, full_name: "Jane" } };
    owners.findByPk.mockResolvedValue(fakeOwner);
    req = { params: { id: "2" } };

    await ownerDetails(req, res);

    expect(owners.findByPk).toHaveBeenCalledWith("2", { include: { model: users } });
    expect(res.json).toHaveBeenCalledWith(fakeOwner);
  });

  test("500 on unexpected error", async () => {
    owners.findByPk.mockRejectedValue(new Error("DB error"));
    req = { params: { id: "4" } };

    await ownerDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error", details: "DB error" });
  });
});
