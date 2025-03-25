import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar/navbar';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Calendar, Clock, Car, CreditCard } from 'lucide-react';

interface BookingData {
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  return_time: string;
  number_of_days: number;
  price_per_day: string;
}

const Success = () => {
  const [purchaseOrderId, setPurchaseOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmationStatus, setConfirmationStatus] = useState<{success: boolean, message: string} | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingData | null>(null);
  
  useEffect(() => {
    const confirmBooking = async () => {
      try {
        console.log("Starting booking confirmation process...");
        
        // Get token and extract user ID
        const token = Cookies.get("Token");
        console.log("Token:", token);
        
        if (!token) {
          console.log("No token found in cookies");
          setConfirmationStatus({
            success: false,
            message: "Authentication failed. Please login again."
          });
          setIsLoading(false);
          return;
        }
        
        // Decode the token to get user ID
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;
        console.log("Decoded token:", decodedToken);
        console.log("User ID:", userId);

        // Get vehicle ID from URL query params
        const queryParams = new URLSearchParams(window.location.search);
        console.log("Query parameters:", Object.fromEntries(queryParams.entries()));
        
        const vehicleId = queryParams.get('purchase_order_id');
        console.log("Vehicle ID from URL:", vehicleId);
        
        if (!vehicleId) {
          console.log("No vehicle ID found in URL parameters");
          setConfirmationStatus({
            success: false,
            message: "Vehicle ID not found in URL parameters."
          });
          setIsLoading(false);
          return;
        }
        setPurchaseOrderId(vehicleId);
        
        // Get booking data from localStorage
        const storedData = localStorage.getItem("bookingData");
        console.log("Raw booking data from localStorage:", storedData);
        
        if (!storedData) {
          console.log("No booking data found in localStorage");
          setConfirmationStatus({
            success: false,
            message: "Booking data not found in local storage."
          });
          setIsLoading(false);
          return;
        }
        
        // Parse the booking data
        const bookingData: BookingData = JSON.parse(storedData);
        console.log("Parsed booking data:", bookingData);
        setBookingDetails(bookingData);
        
        // Prepare request payload
        const payload = {
          pickup_date: bookingData.pickup_date,
          pickup_time: bookingData.pickup_time,
          return_date: bookingData.return_date,
          return_time: bookingData.return_time,
          price_per_day: bookingData.price_per_day,
          number_of_days: bookingData.number_of_days,
          userid: userId,
          vehicleId: vehicleId
        };
        
        console.log("API request payload:", payload);
        console.log("Endpoint URL:", "http://localhost:5000/owner/confirmBooking");
        
        // Make API call with all required data
        console.log("Sending API request...");
        const response = await axios.post(
          "http://localhost:5000/owner/confirmBooking",
          payload
        );
        
        console.log("API response:", response);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        
        // Handle successful response
        setConfirmationStatus({
          success: true,
          message: "Your reservation has been confirmed. We've sent the details to your email."
        });
        
        // Clear booking data from localStorage after successful confirmation
        console.log("Clearing bookingData from localStorage");
        localStorage.removeItem("bookingData");
        
      } catch (error: any) {
        console.error("Error confirming booking:", error);
        
        if (error.response) {
          console.log("Error response data:", error.response.data);
          console.log("Error response status:", error.response.status);
          console.log("Error response headers:", error.response.headers);
        } else if (error.request) {
          console.log("Error request:", error.request);
        } else {
          console.log("Error message:", error.message);
        }
        
        setConfirmationStatus({
          success: false,
          message: error instanceof Error 
            ? error.message 
            : "We couldn't process your booking. Please contact customer support."
        });
      } finally {
        console.log("Booking confirmation process completed");
        setIsLoading(false);
      }
    };
    
    confirmBooking();
  }, []);

  // Format dates for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full"
          >
            <motion.div 
              animate={{ 
                rotate: 360,
                transition: { duration: 1.5, repeat: Infinity, ease: "linear" } 
              }}
              className="mx-auto mb-6 text-blue-500"
            >
              <svg className="w-16 h-16" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                <path 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                  fill="currentColor" 
                />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">Processing Your Booking</h2>
            <p className="text-gray-600">Please wait while we confirm your reservation...</p>
          </motion.div>
        )}
        
        {!isLoading && confirmationStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl w-full"
          >
            <div className={`p-6 ${confirmationStatus.success ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mr-4"
                >
                  {confirmationStatus.success ? 
                    <CheckCircle className="w-10 h-10" /> : 
                    <AlertCircle className="w-10 h-10" />
                  }
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {confirmationStatus.success ? 'Booking Confirmed!' : 'Booking Failed'}
                  </h1>
                  <p>{confirmationStatus.message}</p>
                </div>
              </div>
            </div>
            
            {confirmationStatus.success && bookingDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2 text-gray-700">Booking Reference</h2>
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="text-xl font-mono tracking-wide text-center">{purchaseOrderId}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start"
                  >
                    <Calendar className="text-green-500 w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Pickup Date</p>
                      <p className="font-medium">{formatDate(bookingDetails.pickup_date)}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start"
                  >
                    <Clock className="text-green-500 w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Pickup Time</p>
                      <p className="font-medium">{bookingDetails.pickup_time}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-start"
                  >
                    <Calendar className="text-red-500 w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Return Date</p>
                      <p className="font-medium">{formatDate(bookingDetails.return_date)}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-start"
                  >
                    <Clock className="text-red-500 w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Return Time</p>
                      <p className="font-medium">{bookingDetails.return_time}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-start"
                  >
                    <CreditCard className="text-blue-500 w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Details</p>
                      <p className="font-medium">${bookingDetails.price_per_day} × {bookingDetails.number_of_days} days = ${(parseFloat(bookingDetails.price_per_day) * bookingDetails.number_of_days).toFixed(2)}</p>
                    </div>
                  </motion.div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">A confirmation email has been sent to your registered email address.</p>
                  <p className="text-sm text-gray-600">Please keep your booking reference handy for future inquiries.</p>
                </div>
              </motion.div>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <Car size={18} />
                <span>Return to Home</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Success;