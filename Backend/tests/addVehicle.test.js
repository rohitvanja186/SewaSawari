// tests/unit/addVehicle.test.js

const { addVehicle } = require("../controller/vehicle/ownerController");
const { vehicles, owners,} = require("../model");

// 1) Mock the model methods we call
jest.mock("../model", () => ({
  vehicles: { create: jest.fn() },
  owners:   { findOne: jest.fn() },
  
}));

// 2) Helper to fake Express req/res
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

describe("addVehicle unit tests", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  test("400 if any required field or file missing", async () => {
    // omit vehicleType & no file
    req = {
      body: {
        name: "Car A",
        year: 2020,
        price: 100,
        location: "City",
        // vehicleType missing
        description: "Nice car",
        mileage: 5000,
        fuelType: "Petrol",
        transmission: "Auto",
        userId: 1,
      },
      file: null,
    };

    await addVehicle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "All fields are required!" });
  });

  test("404 if owner not found", async () => {
    // all fields present
    req = {
      body: {
        name: "Car B",
        year: 2019,
        price: 80,
        location: "Town",
        vehicleType: "SUV",
        description: "Spacious",
        mileage: 10000,
        fuelType: "Diesel",
        transmission: "Manual",
        userId: 42,
      },
      file: { filename: "img.jpg" },
    };
    // simulate no owner
    owners.findOne.mockResolvedValue(null);

    await addVehicle(req, res);

    expect(owners.findOne).toHaveBeenCalledWith({ where: { userId: 42 } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Owner not found!" });
  });

  test("201 on success and returns the new vehicle", async () => {
    // valid request
    req = {
      body: {
        name: "Car C",
        year: 2021,
        price: 120,
        location: "Village",
        vehicleType: "Coupe",
        description: "Sporty",
        mileage: 2000,
        fuelType: "Electric",
        transmission: "Auto",
        userId: 7,
      },
      file: { filename: "photo.png" },
    };
    // simulate owner exists
    owners.findOne.mockResolvedValue({ id: 7, userId: 7 });
    // simulate created vehicle
    const fakeVehicle = { id: 99, vehicle_name: "Car C", /* … */ };
    vehicles.create.mockResolvedValue(fakeVehicle);

    await addVehicle(req, res);

    // check that create was called with proper mapping
    expect(vehicles.create).toHaveBeenCalledWith({
      userId: 7,
      vehicle_name: "Car C",
      year: 2021,
      price: 120,
      location: "Village",
      vehicle_type: "Coupe",
      description: "Sporty",
      photo_url: process.env.IMAGE_URL + "photo.png",
      mileage: 2000,
      fuel_type: "Electric",
      transmission: "Auto",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vehicle added successfully!",
      vehicle: fakeVehicle,
    });
  });

  test("500 on unexpected error", async () => {
    req = {
      body: {
        name: "Car D",
        year: 2018,
        price: 50,
        location: "Metro",
        vehicleType: "Hatchback",
        description: "Compact",
        mileage: 15000,
        fuelType: "Petrol",
        transmission: "Manual",
        userId: 3,
      },
      file: { filename: "d.png" },
    };
    // simulate owners.findOne throws
    owners.findOne.mockRejectedValue(new Error("DB failure"));

    await addVehicle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
