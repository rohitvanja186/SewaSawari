const fs = require("fs");
const { vehicles, owners } = require("../../model"); // Importing models

exports.addVehicle = async (req, res) => {
    try {
        // Destructure the necessary fields from the request body
        const {
            name,  // This corresponds to the column `vehicle_name`
            year,
            price,
            location,
            vehicleType,  // This corresponds to the column `vehicle_type`
            description,
            mileage,
            fuelType,  // This corresponds to the column `fuel_type`
            transmission,
            userId
        } = req.body;

        // Get the filename from the uploaded file
        const filename = req.file ? req.file.filename : null;

        console.log("User ID from request:", userId);

        // Validate required fields
        if (!name || !year || !price || !location || !vehicleType || !description || !mileage || !fuelType || !transmission || !filename) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if the owner exists in the database
        const ownerExists = await owners.findOne({ where: { userId: userId } });
        if (!ownerExists) {
            return res.status(404).json({ message: "Owner not found!" });
        }

        // Create a new vehicle record and associate it with the owner
        const newVehicle = await vehicles.create({
            user_id: userId, // Associate vehicle with the owner using the userId
            vehicle_name: name,  // Map `name` to `vehicle_name`
            year: year,
            price: price,
            location: location,
            vehicle_type: vehicleType,  // Map `vehicleType` to `vehicle_type`
            description: description,
            photo_url: process.env.IMAGE_URL + filename,  // Map `image` to `photo_url`
            mileage: mileage,
            fuel_type: fuelType,  // Map `fuelType` to `fuel_type`
            transmission: transmission,
        });

        // Send success response with the created vehicle object
        res.status(201).json({ message: "Vehicle added successfully!", vehicle: newVehicle });
    } catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
