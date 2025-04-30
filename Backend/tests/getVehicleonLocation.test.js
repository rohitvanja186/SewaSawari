
const { getVehicleonLocation } = require("../controller/auth/mapController");
const { owners, vehicles, users } = require("../model");

// Mock the models
jest.mock("../model", () => ({
  owners: { findAll: jest.fn() },
  vehicles: {},
  users: {},
}));

// Suppress console.error output during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Helper to mock Express req/res
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json   = jest.fn().mockReturnThis();
  return res;
}

describe("getVehicleonLocation unit tests", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  test("400 if latitude or longitude missing", async () => {
    req = { body: { latitude: 12.34 } }; // missing longitude
    await getVehicleonLocation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Latitude and Longitude are required",
    });
  });

  test("200 and returns empty data when no owners close by", async () => {
    req = { body: { latitude: 1, longitude: 1 } };
    owners.findAll.mockResolvedValue([{
      latitude: "50.0", longitude: "50.0",
      business_name: "B1", description: "D1",
      user: { id: 1, full_name: "U1", email: "e1", phone_number: "p1", vehicles: [] }
    }]);

    await getVehicleonLocation(req, res);

    expect(owners.findAll).toHaveBeenCalledWith({
      include: [{
        model: users,
        attributes: ["id","full_name","email","phone_number"],
        include: [{ model: vehicles, attributes: expect.any(Array) }]
      }]
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
  });

  test("200 and returns nearby owner with vehicles mapping", async () => {
    // use non-zero coords to pass validation
    req = { body: { latitude: 1, longitude: 1 } };
    const ownerNear = {
      latitude: "1.005", longitude: "1.005",
      business_name: "NearBiz", description: "NearDesc",
      user: { id: 2, full_name: "User2", email: "e2", phone_number: "p2", vehicles: [
        { vehicle_name: "V1", year: 2020, price: 100, mileage: 1000, location: "L1", vehicle_type: "T1", fuel_type: "F1", transmission: "Auto", photo_url: "url1", description: "desc1" }
      ] }
    };
    const ownerFar = {
      latitude: "60.0", longitude: "60.0",
      business_name: "FarBiz", description: "FarDesc",
      user: { id: 3, full_name: "User3", email: "e3", phone_number: "p3", vehicles: [] }
    };
    owners.findAll.mockResolvedValue([ownerNear, ownerFar]);

    await getVehicleonLocation(req, res);

    expect(owners.findAll).toHaveBeenCalledWith({
      include: [{
        model: users,
        attributes: ["id","full_name","email","phone_number"],
        include: [{ model: vehicles, attributes: expect.any(Array) }]
      }]
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{
        owner: {
          business_name: "NearBiz",
          description: "NearDesc",
          latitude: "1.005",
          longitude: "1.005",
        },
        user: {
          id: 2, full_name: "User2", email: "e2", phone_number: "p2"
        },
        vehicles: [{
          vehicle_name: "V1", year: 2020, price: 100, mileage: 1000,
          location: "L1", vehicle_type: "T1", fuel_type: "F1",
          transmission: "Auto", photo_url: "url1", description: "desc1"
        }]
      }]
    });
  });

  test("500 on unexpected error", async () => {
    req = { body: { latitude: 1, longitude: 1 } };
    owners.findAll.mockRejectedValue(new Error("DB failure"));

    await getVehicleonLocation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Something went wrong" });
  });
});
