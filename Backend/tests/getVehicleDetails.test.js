// tests/unit/getVehicleDetails.test.js

const { getVehicleDetails } = require("../controller/vehicle/ownerController");
const { vehicles, users } = require("../model");


// Mock the models
jest.mock("../model", () => ({
    vehicles: { findOne: jest.fn() },
    users:   {},           // placeholder for include
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
  
  describe("getVehicleDetails unit tests", () => {
    let req, res;
  
    beforeEach(() => {
      jest.clearAllMocks();
      res = mockResponse();
    });
  
    test("404 when vehicle not found", async () => {
      vehicles.findOne.mockResolvedValue(null);
  
      req = { params: { id: "123" } };
      await getVehicleDetails(req, res);
  
      expect(vehicles.findOne).toHaveBeenCalledWith({
        where: { id: "123" },
        include: { model: users },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Vehicle not found" });
    });
  
    test("200 and returns vehicle details when found", async () => {
      const fakeVehicle = {
        id: 5,
        vehicle_name: "Car X",
        users: { id: 2, full_name: "Jane Doe" },
      };
      vehicles.findOne.mockResolvedValue(fakeVehicle);
  
      req = { params: { id: "5" } };
      await getVehicleDetails(req, res);
  
      expect(vehicles.findOne).toHaveBeenCalledWith({
        where: { id: "5" },
        include: { model: users },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeVehicle);
    });
  
    test("500 on unexpected error", async () => {
      vehicles.findOne.mockRejectedValue(new Error("DB crash"));
  
      req = { params: { id: "7" } };
      await getVehicleDetails(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
        error: "DB crash",
      });
    });
  });
  