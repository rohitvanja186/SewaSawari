import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar/navbar';

const StoreDetails = () => {
  const { id } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: resp } = await axios.get(
          `http://localhost:5000/owner/getVehicleById/${id}`
        );
        setVehicles(resp.data);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">No Vehicles Found</h2>
          <p className="text-xl">The requested vehicle(s) could not be found.</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <motion.div
        className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
        
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <img
                    className="h-64 w-full object-cover"
                    src={vehicle.photo_url || "https://via.placeholder.com/400"}
                    alt={vehicle.vehicle_name}
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full font-bold shadow-md">
                    ${vehicle.price}/day
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {vehicle.vehicle_name}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    {[
                      ["Type", vehicle.vehicle_type],
                      ["Year", vehicle.year],
                      ["Mileage", `${vehicle.mileage} miles`],
                      ["Location", vehicle.location],
                      ["Fuel", vehicle.fuel_type],
                      ["Trans", vehicle.transmission],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center">
                        <span className="font-medium text-gray-600">{label}:</span>
                        <span className="ml-2 text-gray-800 truncate">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Description
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {vehicle.description}
                    </p>
                  </div>

                

                  <div className="flex space-x-3 mt-4">
                    <NavLink 
                      to={`/rental/${vehicle.id}`}
                      className="flex-1"
                    >
                      <motion.button
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Book Now
                      </motion.button>
                    </NavLink>
                    <NavLink 
                      to={`/rental/${vehicle.id}`}
                      className="flex-1"
                    >
                      <motion.button
                        className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition duration-300 flex items-center justify-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </motion.button>
                    </NavLink>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <motion.button
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              Go Back to Search
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default StoreDetails;