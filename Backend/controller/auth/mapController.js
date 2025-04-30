const { owners, vehicles, users } = require("../../model");

const toRad = (value) => (value * Math.PI) / 180;

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.getVehicleonLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const allOwners = await owners.findAll({
      include: [
        {
          model: users,
          attributes: ["id","full_name", "email", "phone_number"],
          include: [
            {
              model: vehicles,
              attributes: [
                "id",
                "vehicle_name",
                "year",
                "price",
                "mileage",
                "location",
                "vehicle_type",
                "fuel_type",
                "transmission",
                "photo_url",
                "description",
                "created_at",
              ],
            },
          ],
        },
      ],
    });

    const nearbyOwners = allOwners
      .filter((owner) => {
        if (owner.latitude && owner.longitude) {
          const distance = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            parseFloat(owner.latitude),
            parseFloat(owner.longitude)
          );
          return distance <= 10;
        }
        return false;
      })
      .map((owner) => {
        // Make sure vehicles is not undefined before trying to map
        const vehiclesData = owner.user.vehicles || [];  // Default to an empty array if no vehicles

        return {
          owner: {
          
            business_name: owner.business_name,
            description: owner.description,
            latitude: owner.latitude,
            longitude: owner.longitude,
          },
          user: {
            id : owner.user.id,
            full_name: owner.user.full_name,
            email: owner.user.email,
            phone_number: owner.user.phone_number,
          },
          vehicles: vehiclesData.map((vehicle) => ({
            vehicle_name: vehicle.vehicle_name,
            year: vehicle.year,
            price: vehicle.price,
            mileage: vehicle.mileage,
            location: vehicle.location,
            vehicle_type: vehicle.vehicle_type,
            fuel_type: vehicle.fuel_type,
            transmission: vehicle.transmission,
            photo_url: vehicle.photo_url,  // Including photo URL
            description: vehicle.description,
          })),
        };
      });

    res.status(200).json({
      success: true,
      data: nearbyOwners,
    });
  } catch (error) {
    console.error("Error fetching nearby vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


