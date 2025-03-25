import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Map, Fuel, Settings, CreditCard } from 'lucide-react';
import Navbar from '../../components/Navbar/navbar';
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Cookies from 'js-cookie'

interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
}

interface Vehicle {
  vehicle_name: string;
  year: number;
  price: string;
  mileage: number;
  location: string;
  vehicle_type: string;
  fuel_type: string;
  transmission: string;
  photo_url: string;
  description: string;
  created_at: string;
  user: User;
}

const VehicleDetails = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('10:00');
  const [returnTime, setReturnTime] = useState<string>('10:00');
  const [totalDays, setTotalDays] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<string>('0');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract the ID from the URL using useParams in a real implementation
        const id = window.location.pathname.split('/').pop();
        const response = await axios.get(`http://localhost:5000/owner/get_Vehicle/${id}`);
        setVehicle(response.data);
        
        // Set default dates
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        
        setStartDate(formatDateForInput(today));
        setEndDate(formatDateForInput(tomorrow));
      } catch (err) {
        setError('Failed to load vehicle details. Please try again later.');
        console.error('Error fetching vehicle details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (vehicle && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalDays(diffDays || 1);
      setTotalPrice(calculateTotalPrice(diffDays || 1, vehicle.price));
    }
  }, [startDate, endDate, vehicle]);

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const calculateTotalPrice = (days: number, pricePerDay: string) => {
    const price = parseFloat(pricePerDay) * days;
    return price.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xl"
        >
          {error || 'Vehicle not found'}
        </motion.div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  // Car brand logo detection based on name
  const getCarLogo = (name: string) => {
    const nameLower = name.toLowerCase();
    let brand = '';
    
    if (nameLower.includes('toyota')) brand = 'toyota';
    else if (nameLower.includes('honda')) brand = 'honda';
    else if (nameLower.includes('ford')) brand = 'ford';
    else if (nameLower.includes('bmw')) brand = 'bmw';
    else if (nameLower.includes('mercedes')) brand = 'mercedes';
    else if (nameLower.includes('audi')) brand = 'audi';
    else if (nameLower.includes('tesla')) brand = 'tesla';
    else if (nameLower.includes('nissan')) brand = 'nissan';
    else if (nameLower.includes('chevrolet') || nameLower.includes('chevy')) brand = 'chevrolet';
    else if (nameLower.includes('volkswagen') || nameLower.includes('vw')) brand = 'volkswagen';
    else brand = 'car';
    
    return (
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4"
      >
        {brand.charAt(0).toUpperCase()}
      </motion.div>
    );
  };





  const handleBooking = async () => {
    try {


      const token = Cookies.get("Token");
    
      // Check if token exists
      if (!token) {
        toast.info("Login Before Booking");
        // window.location.href = "/login"
        navigate("/login")
        
        return; // Return immediately to stop further execution
      }
      
      // Extract the ID from the URL
      const id = window.location.pathname.split('/').pop();
      
      // Create booking data object
      const bookingData = {
        pickup_date: startDate,
        pickup_time: pickupTime,
        return_date: endDate,
        return_time: returnTime,
        number_of_days: totalDays,
        price_per_day: vehicle.price,
      };
      
     
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      
      
      const response = await axios.post("http://localhost:5000/owner/payment", {
        orderId: id,
        amount: parseFloat(totalPrice) // Send the total price calculated
      });
      
      console.log(response);
      
      if(response.status == 200)
      {
        window.location.href = response.data.payment_url
      }
      // Handle successful payment response here
      // For example, redirect to a confirmation page
      
    } catch (error) {
      console.error("Payment request failed:", error);
      // Handle error here - show error message to user
    }
  };

  return (
    <><Navbar />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100"
    >
      {/* Header with vehicle name */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-blue-600 text-white py-4 px-6 shadow-md"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">{vehicle.vehicle_name} ({vehicle.year})</h1>
          <motion.span 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold"
          >
            {formatPrice(vehicle.price)}/day
          </motion.span>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Image and vehicle details */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-2"
          >
            {/* Vehicle Image with animated placeholder */}
            <motion.div 
              className="bg-white rounded-xl overflow-hidden shadow-xl mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img
                  src={vehicle.photo_url}
                  alt={vehicle.vehicle_name}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x500?text=Vehicle+Image';
                  }}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white"
                >
                  <div className="flex items-center">
                    {getCarLogo(vehicle.vehicle_name)}
                    <div className="ml-3">
                      <h2 className="text-xl font-bold">{vehicle.vehicle_name}</h2>
                      <p>{vehicle.year} · {vehicle.vehicle_type}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Owner Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2 text-blue-600" />
                Owner Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="text-gray-800 font-medium">{vehicle.user.full_name}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="text-gray-800 font-medium">{vehicle.user.email}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="text-gray-800 font-medium">{vehicle.user.phone_number}</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Vehicle Specs */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="mr-2 text-blue-600" />
                Vehicle Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Year</p>
                  <p className="text-gray-800 font-medium">{vehicle.year}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Mileage</p>
                  <p className="text-gray-800 font-medium">{vehicle.mileage} miles</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="text-gray-800 font-medium">{vehicle.vehicle_type}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Fuel</p>
                  <p className="text-gray-800 font-medium">{vehicle.fuel_type}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Transmission</p>
                  <p className="text-gray-800 font-medium">{vehicle.transmission}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="text-gray-800 font-medium">{vehicle.location}</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Vehicle Description</h2>
              <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
            </motion.div>
          </motion.div>

          {/* Right column - Booking form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="sticky top-6 self-start"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 text-blue-600" />
                Book This Vehicle
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Pickup Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      min={formatDateForInput(new Date())}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Pickup Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Return Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      min={startDate}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Return Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Price per day:</span>
                    <span className="font-semibold">{formatPrice(vehicle.price)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Number of days:</span>
                    <span className="font-semibold">{totalDays}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="text-gray-700 font-medium">Total:</span>
                    <span className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg transition duration-300 ease-in-out flex justify-center items-center text-lg"
                  onClick={handleBooking}
                >
                  <CreditCard className="mr-2" size={20} />
                  Book Now
                </motion.button>
              </div>
            </div>

            {/* Additional services or features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Additional Features</h3>
              <ul className="space-y-3">
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-center text-gray-700"
                >
                  <span className="w-5 h-5 mr-2 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  Free cancellation up to 24h before pickup
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-center text-gray-700"
                >
                  <span className="w-5 h-5 mr-2 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  Insurance included
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-center text-gray-700"
                >
                  <span className="w-5 h-5 mr-2 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  24/7 roadside assistance
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-center text-gray-700"
                >
                  <span className="w-5 h-5 mr-2 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  Unlimited mileage
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default VehicleDetails;