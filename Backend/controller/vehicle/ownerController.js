const fs = require("fs");
const { vehicles, owners, users, bookings} = require("../../model"); // Importing models
const { default: axios } = require("axios");
const db = require("../../model");

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
            userId: userId, // Associate vehicle with the owner using the userId
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


exports.getVehicles = async (req, res) => {
    try {

    
        const vehicleList = await vehicles.findAll({
            include: {
                model: users,
            }
        })


        console.log(vehicleList);

        res.status(200).json({ message: "Vehicles retrieved successfully!", vehicles: vehicleList });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.getVehicleDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
 
      const vehicleDetails = await vehicles.findOne({
        where: { id },
        include: {
          model: users, 
        
        }
      });
  
   
      if (!vehicleDetails) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
  
  
      return res.status(200).json(vehicleDetails);
      
    } catch (error) {
     
      console.error(error);
  
    
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

  exports.initiatePayment = async(req,res)=>
  {
    try {
        const { orderId, amount} = req.body;
        
        if (!orderId || !amount) {
          return res.status(400).json({
            message: "Please provide orderId and amount"
          });
        }
        
        const data = {
          return_url: "http://localhost:5173/success",
          purchase_order_id: orderId,
          amount: amount * 100,
          purchase_order_name: "Rent Vehicle",
          website_url: "http://localhost:5173/"
        };
        
        const response = await axios.post(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          data,
          {
            headers: {
              "Authorization": "key 3fb3d001f89c4fd7965e13ed9f96c6eb"
            }
          }
        );
        
    
        console.log(response.data);
        // Return the response from Khalti to your client
        return res.status(200).json(response.data);
        
      } catch (error) {
        console.error("Payment initiation error:", error);
        
        // Return a formatted error response
        return res.status(error.response?.status || 500).json({
          message: "Failed to initiate payment",
          error: error.response?.data || error.message
        });
      } 
  }


 
  
exports.ConfirmBooking = async (req, res) => {
    const { pickup_date, pickup_time, return_date, return_time, price_per_day, userid, vehicleId, number_of_days} = req.body;
  

 console.log("vehicleid", vehicleId)
    // Calculate the total price
    const total_price = price_per_day * number_of_days;
  
    try {
      // Create a new booking
      const booking = await bookings.create({
        pickup_date,
        pickup_time,
        return_date,
        return_time,
        price_per_day,
        number_of_days: number_of_days,
        total_price,
        status: 'Completed', 
        payment_status: 'Paid', 
        userId: userid, 
        VehicleId: vehicleId, 
      });
  
      return res.status(201).json({
        message: 'Booking confirmed successfully!',
        booking,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error confirming booking.',
        error: error.message,
      });
    }
  };

  exports.getVehiclesByUserId = async (req, res) => {
    try {
      const { userId } = req.params;

      console.log(req.params)
      
      const vehicleDetails = await db.vehicles.findAll({
        where: { 
          userId: userId 
        },
        include: [{
          model: db.users,
          
        }]
      });
      
      if (vehicleDetails.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No vehicles found for this user"
        });
      }
      
      return res.status(200).json({
        success: true,
        data: vehicleDetails,
        message: "Vehicles retrieved successfully"
      });
    } catch (error) {
      console.error("Error retrieving vehicles:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  };