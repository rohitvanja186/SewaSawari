import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SearchOutlined, CarOutlined, HeartOutlined, StarFilled, FilterOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Navbar from '../../components/Navbar/navbar';
import axios from 'axios';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Custom marker icons
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const storeLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Function to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d.toFixed(1);
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Format distance nicely
const formatDistance = (distance) => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance} km`;
};

// Component to fly to location when it changes
const MapController = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  
  return null;
};

const MapNavigation = () => {
  // Get location from localStorage or use default
  const getInitialLocation = () => {
    try {
      const storedLocation = localStorage.getItem('userLocation');
      if (storedLocation) {
        const locationData = JSON.parse(storedLocation);
        console.log("Retrieved location from localStorage:", locationData);
        // Return location with proper format
        return {
          lat: locationData.lat || 26.568426, // Default to Duhabi if no lat
          lng: locationData.lng || 87.278088, // Default to Duhabi if no lng
          displayName: locationData.displayName || 'Duhabi-05, Duhabi, Sunsari, Koshi Province, Nepal'
        };
      }
    } catch (error) {
      console.error('Error reading location from localStorage:', error);
    }
    
    // Default to Duhabi (Nepal) if no stored location
    return { 
      lat: 26.568426, 
      lng: 87.278088, 
      displayName: 'Duhabi-05, Duhabi, Sunsari, Koshi Province, Nepal' 
    };
  };

  const [currentLocation, setCurrentLocation] = useState(getInitialLocation());
  const [mapCenter, setMapCenter] = useState([currentLocation.lat, currentLocation.lng]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [vehicleType, setVehicleType] = useState('All');
  const [filteredStores, setFilteredStores] = useState([]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showVehicleFilter, setShowVehicleFilter] = useState(false);
  
  // Vehicle type options
  const vehicleTypes = ['All', 'SUV', 'Sedan', 'Electric', 'Compact'];

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newLocation = getInitialLocation();
      setCurrentLocation(newLocation);
      setMapCenter([newLocation.lat, newLocation.lng]);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Set initial map center when component mounts
  useEffect(() => {
    setMapCenter([currentLocation.lat, currentLocation.lng]);
  }, [currentLocation]);

  // Fetch stores data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Create request payload with latitude and longitude from currentLocation
        const payload = {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng
        };
        
        console.log("Sending API request with payload:", payload);
        
        // Send POST request to API endpoint
        const response = await axios.post(
          "http://localhost:5000/map/getvehiclesonLocation", 
          payload
        );
        
        console.log("API Response:", response.data);
        
        // Check if response has data
        if (response.data && response.data.success && response.data.data) {
          // Process the data to add additional information
          const processedStores = response.data.data.map((item, index) => {
            // Extract owner info which contains location data
            const store = item.owner;
            const user = item.user;
            
            // Generate a unique ID if not present
            const id = store.id || `store-${index}`;
            
            const distance = calculateDistance(
              currentLocation.lat, 
              currentLocation.lng, 
              parseFloat(store.latitude), 
              parseFloat(store.longitude)
            );
            
            // Generate a placeholder image
            const storeImage = `https://source.unsplash.com/random/300x200/?store,${id}`;
            
            // Get business name or create a default one
            const businessName = store.business_name || `Store ${index + 1}`;
            
            // Use location name from API if available, otherwise use coordinates
            const locationName = store.location_name || `Location at ${store.latitude}, ${store.longitude}`;
            
            return {
              id,
              business_name: businessName,
              description: store.description || "No description available",
              latitude: store.latitude,
              longitude: store.longitude,
              distance,
              formattedDistance: formatDistance(distance),
              image: storeImage,
              locationName: locationName,
              rating: (3 + Math.random() * 2).toFixed(1),  // Random rating between 3-5
              reviews: Math.floor(10 + Math.random() * 90),  // Random number of reviews
              owner_name: user.full_name,
              contact: user.phone_number,
              email: user.email,
              userId: user.id, // Make sure userId is properly assigned here
              vehicles: item.vehicles || []
            };
          });
          
          console.log("Processed store data:", processedStores);
          setStores(processedStores);
          setFilteredStores(processedStores);
        } else {
          console.error("Invalid data format received from API:", response.data);
          setError("Invalid data format received from API");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch store data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentLocation.lat, currentLocation.lng]);

  // Apply filters
  useEffect(() => {
    let filtered = stores;
    
    // Filter by price (this is just an example - adjust based on your data)
    if (stores.length > 0 && stores[0].vehicles && stores[0].vehicles.length > 0) {
      filtered = filtered.filter(store => {
        // If there are vehicles, check if any fall within the price range
        return store.vehicles.some(vehicle => 
          (!vehicle.price || vehicle.price >= priceRange[0]) && 
          (!vehicle.price || vehicle.price <= priceRange[1])
        );
      });
    }
    
    // Filter by vehicle type (if not "All")
    if (vehicleType !== 'All' && stores.length > 0) {
      filtered = filtered.filter(store => {
        // Only include stores that have vehicles matching the selected type
        return store.vehicles && store.vehicles.some(vehicle => 
          vehicle.vehicle_type === vehicleType
        );
      });
    }
    
    setFilteredStores(filtered);
  }, [priceRange, vehicleType, stores]);

  // Handle price filter toggle
  const togglePriceFilter = (e) => {
    e.stopPropagation();
    setShowPriceFilter(!showPriceFilter);
    setShowVehicleFilter(false);
  };

  // Handle vehicle filter toggle
  const toggleVehicleFilter = (e) => {
    e.stopPropagation();
    setShowVehicleFilter(!showVehicleFilter);
    setShowPriceFilter(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPriceFilter(false);
      setShowVehicleFilter(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Reset filters function
  const resetFilters = () => {
    setPriceRange([0, 200]);
    setVehicleType('All');
  };

  // Function to handle search this area
  const handleSearchThisArea = () => {
    // In a real app, you would get the current map center and fetch stores in that area
    const map = document.querySelector('.leaflet-container')?._leaflet_map;
    if (map) {
      const center = map.getCenter();
      const newLocation = {
        lat: center.lat,
        lng: center.lng,
        displayName: 'Map Center'
      };
      setCurrentLocation(newLocation);
      setMapCenter([center.lat, center.lng]);
      console.log('Searching area:', newLocation);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      {/* Filter bar */}
      <div className="bg-white py-3 border-b border-gray-200 px-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {/* Location info */}
          <div className="flex items-center text-sm font-medium mr-2">
            <EnvironmentOutlined className="mr-1 text-indigo-600" />
            <span>Location: {currentLocation.displayName}</span>
          </div>
          
          {/* Price filter */}
          <div className="relative">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-full flex items-center text-sm"
              onClick={togglePriceFilter}
            >
              <span>Daily price: ${priceRange[0]}-${priceRange[1]}</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {showPriceFilter && (
              <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-10">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price range</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={priceRange[0]} 
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Vehicle type filter */}
          <div className="relative">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-full flex items-center text-sm"
              onClick={toggleVehicleFilter}
            >
              <span>Vehicle type: {vehicleType}</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {showVehicleFilter && (
              <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48 z-10">
                {vehicleTypes.map(type => (
                  <div 
                    key={type} 
                    className="py-2 px-3 hover:bg-gray-100 cursor-pointer rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVehicleType(type);
                      setShowVehicleFilter(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* All filters button */}
          <button className="px-4 py-2 border border-gray-300 rounded-full flex items-center text-sm">
            <span>All filters</span>
            <FilterOutlined className="ml-2" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Store listings */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-200">
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading stores...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button 
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-1">{filteredStores.length} stores available</h2>
                <p className="text-gray-600 text-sm mb-4">These stores are located in and around {currentLocation.displayName}.</p>
                
                {filteredStores.length > 0 ? (
                  <div className="space-y-6">
                    {filteredStores.map(store => (
                      <div key={store.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex">
                      
                          <div className="w-2/3 p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold">{store.business_name}</h3>
                              <button className="text-gray-400 hover:text-gray-600">
                                <HeartOutlined />
                              </button>
                            </div>
                            
                            <div className="flex items-center mt-1">
                              <span className="text-sm font-medium">{store.rating}</span>
                              <StarFilled className="text-yellow-500 ml-1" />
                              <span className="text-sm text-gray-500 ml-1">({store.reviews} reviews)</span>
                            </div>
                            
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <EnvironmentOutlined className="mr-1" />
                              <span>{store.locationName} - {store.formattedDistance} away</span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {store.description || "No description available."}
                            </p>
                            
                            {store.vehicles && store.vehicles.length > 0 ? (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Available vehicles: {store.vehicles.length}</p>
                                <div className="flex mt-1 flex-wrap">
                                  {store.vehicles.slice(0, 2).map((vehicle, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-1 mb-1">
                                      {vehicle.vehicle_name || 'Unnamed'} {vehicle.vehicle_type ? `(${vehicle.vehicle_type})` : ''}
                                    </span>
                                  ))}
                                  {store.vehicles.length > 2 && (
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                      +{store.vehicles.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2">No vehicles available</p>
                            )}
                            
                          
                          </div>
                          <div className=" flex items-center justify-end ">
                              <NavLink to={`/owners/${store.userId}`}>
                                <button 
                                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-sm"
                                >
                                  View Details
                                </button>
                              </NavLink>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">No stores found</h3>
                      <p className="text-gray-600 mb-6">Try changing your filters or exploring the map</p>
                      <button 
                        className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
                        onClick={resetFilters}
                      >
                        Reset filters
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Right side - Leaflet Map */}
        <div className="w-1/2 relative">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Controller to update map view */}
            <MapController center={mapCenter} />
            
            {/* Current location marker (blue) */}
            <Marker position={mapCenter} icon={userLocationIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold">Your location</p>
                  <p>{currentLocation.displayName}</p>
                </div>
              </Popup>
            </Marker>
            
            {/* Store markers (red) */}
            {!loading && filteredStores.map(store => (
              <Marker 
                key={store.id} 
                position={[parseFloat(store.latitude), parseFloat(store.longitude)]} 
                icon={storeLocationIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold">{store.business_name}</h3>
                    <p className="text-sm">Owner: {store.owner_name}</p>
                    <p className="text-sm">{store.locationName}</p>
                    <p className="text-sm mt-1">{store.formattedDistance} from your location</p>
                    <NavLink to={`/owners/${store.userId}`}>
                      <button
                        className="mt-2 bg-indigo-600 text-white py-1 px-3 rounded text-xs"
                      >
                        View Details
                      </button>
                    </NavLink>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Search this area button */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <button 
              className="bg-indigo-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-indigo-700 flex items-center"
              onClick={handleSearchThisArea}
            >
              <SearchOutlined className="mr-2" />
              Search this area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapNavigation;