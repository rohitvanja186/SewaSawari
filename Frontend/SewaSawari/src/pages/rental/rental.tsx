import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/navbar';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Car, MapPin, Calendar, Gauge, DollarSign, Fuel, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Footer from '../../components/Footer/footer';

const Rental = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/owner/get_Vehicle");

        console.log(response.data.vehicles)
        setVehicles(response.data.vehicles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Available Vehicles for Rent</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {vehicles.map((vehicle) => (
              <motion.div 
                key={vehicle.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={vehicle.photo_url} 
                    alt={vehicle.vehicle_name} 
                    className="w-full h-full object-cover"
                   
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg font-medium">
                    ${vehicle.price}/day
                  </div>
                </div>
                
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{vehicle.vehicle_name}</h2>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Car className="w-4 h-4 mr-1" />
                      <span className="text-sm">{vehicle.vehicle_type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">{vehicle.year}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Gauge className="w-4 h-4 mr-1" />
                      <span className="text-sm">{vehicle.mileage} miles</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Fuel className="w-4 h-4 mr-1" />
                      <span className="text-sm">{vehicle.fuel_type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Settings className="w-4 h-4 mr-1" />
                      <span className="text-sm">{vehicle.transmission}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {vehicle.description || "No description available."}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Owner: {vehicle.user.full_name}
                      </p>

                   <NavLink to= {`/rental/${vehicle.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        View More
                      </motion.button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Rental;