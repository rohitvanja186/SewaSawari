import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for a store
const storeIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const OwnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationInfo, setLocationInfo] = useState({
    city: "Loading location...",
    fullAddress: "Loading full address..."
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/admin/ownerDetails/${id}`);
        console.log("view details", response.data);
        setOwnerData(response.data);
        
        // Fetch location information after getting coordinates
        if (response.data.latitude && response.data.longitude) {
          await fetchLocationInfo(response.data.latitude, response.data.longitude);
        } else {
          setLocationInfo({
            city: "Location unavailable",
            fullAddress: "Coordinates not provided"
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching owner details:", err);
        setError("Failed to load owner details. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Function to fetch location information based on coordinates
  const fetchLocationInfo = async (lat, lon) => {
    try {
      // Using OpenStreetMap's Nominatim reverse geocoding API
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'LocalBusinessDirectory/1.0' // Required by Nominatim's terms
          }
        }
      );
      
      // Process the response data
      const data = response.data;
      
      if (data) {
        // Extract address components
        const address = data.address;
        
        // Try to get the most specific location info
        const city = address.city || address.town || address.village || address.hamlet || 
                    address.suburb || address.county || address.state || "Unknown location";
        
        // Build a full address string
        const components = [];
        if (address.road) components.push(address.road);
        if (address.suburb) components.push(address.suburb);
        if (address.city || address.town || address.village || address.hamlet) 
          components.push(address.city || address.town || address.village || address.hamlet);
        if (address.county) components.push(address.county);
        if (address.state) components.push(address.state);
        if (address.country) components.push(address.country);
        
        const fullAddress = components.length > 0 ? components.join(", ") : data.display_name || "Address details unavailable";
        
        setLocationInfo({
          city: city,
          fullAddress: fullAddress
        });
      } else {
        setLocationInfo({
          city: "Location not found",
          fullAddress: "Address details unavailable"
        });
      }
    } catch (err) {
      console.error("Error fetching location information:", err);
      setLocationInfo({
        city: "Location information unavailable",
        fullAddress: "Error fetching address details"
      });
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Format operating hours
  const formatOperatingHours = (hoursString) => {
    try {
      const hours = JSON.parse(hoursString);
      if (hours.start === hours.end) {
        return "24 Hours";
      }
      return `${hours.start} - ${hours.end}`;
    } catch (e) {
      return "Not available";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ yoyo: Infinity, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-indigo-700">Loading details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (!ownerData) return null;

  const position = [
    parseFloat(ownerData.latitude) || 26.663023,
    parseFloat(ownerData.longitude) || 87.275011
  ];

  // Get the first letter of business name for the badge
  const businessInitial = ownerData.business_name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header with back button */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-center mb-8"
        >
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </motion.button>
        </motion.div>

        {/* Business Header Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                {businessInitial}
              </div>
              <div className="ml-5">
                <h1 className="text-3xl font-bold">{ownerData.business_name}</h1>
                <div className="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-indigo-100 text-sm">{locationInfo.city}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-indigo-100">
              <p className="italic">{ownerData.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Owner Information Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Owner Information
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="text-indigo-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{ownerData.user.full_name}</p>
                  </div>
                </div>

                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="text-indigo-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{ownerData.user.email}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${ownerData.email_confirm ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {ownerData.email_confirm ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="text-indigo-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{ownerData.user.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="text-indigo-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{locationInfo.fullAddress}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="text-indigo-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-800">{ownerData.user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Business Details and Map */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 space-y-8"
          >
            {/* Business Info Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Business Information
                </h2>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <div className="text-indigo-500 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Operating Hours</p>
                      <p className="font-medium text-gray-800">{formatOperatingHours(ownerData.operating_hours)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-indigo-500 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="font-medium text-gray-800">{new Date(ownerData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <div className="text-indigo-500 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-800">{new Date(ownerData.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-indigo-500 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h2>
              </div>
              <div className="h-80">
                <MapContainer 
                  center={position} 
                  zoom={15} 
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position} icon={storeIcon}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-indigo-600">{ownerData.business_name}</h3>
                        <p className="text-sm text-gray-600">{ownerData.description}</p>
                        <div className="mt-2 text-xs bg-indigo-50 p-1 rounded">
                          <strong>Location:</strong> {locationInfo.city}
                        </div>
                        <div className="mt-1 text-xs bg-indigo-50 p-1 rounded">
                          <strong>Hours:</strong> {formatOperatingHours(ownerData.operating_hours)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default OwnerDetails;