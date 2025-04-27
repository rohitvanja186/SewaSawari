import React, { useState, useRef, useEffect } from 'react';
import { EnvironmentOutlined, GlobalOutlined, ClockCircleOutlined, BankOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/**
 * LocationDropdown - A reusable dropdown component for location selection with geolocation
 * Saves selected location to localStorage and navigates to map when current location is selected
 */
const LocationDropdown = ({
  placeholder = "Current Location, Cities or address",
  onChange,
  value,
  className = "",
  cities = [],
  history = [],
  showHistory = true,
  showQuickOptions = true,
  label,
  size = "default",
  containerStyle = {},
  inputStyle = {},
  dropdownStyle = {},
  variant = "landing",
  showIcon = true,
  onLocationSelected = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Default cities if none provided
  const defaultCities = [
    { name: "Kathmandu" },
    { name: "Pokhara" },
    { name: "Biratnagar" },
    { name: "Itahari" },
    { name: "Dharan" },
    { name: "Chitwan" }
  ];

  // Default history if none provided
  const defaultHistory = [
    { name: "Kathmandu, Bagmati Province" },
    { name: "Pokhara, Gandaki Province" }
  ];

  // Use provided lists or fallback to defaults
  const cityList = cities.length > 0 ? cities : defaultCities;
  const historyList = history.length > 0 ? history : defaultHistory;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current location using Geolocation API and save to localStorage
  const getCurrentLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Save to localStorage
          const locationData = {
            type: 'coordinates',
            lat: latitude,
            lng: longitude,
            displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          };
          localStorage.setItem('userLocation', JSON.stringify(locationData));
          
          // Update input value with coordinates
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          if (onChange) onChange(locationString);
          
          // Optional: Get address from coordinates (reverse geocoding)
          fetchLocationNameFromCoords(latitude, longitude);
          
          setIsLoading(false);
          setIsOpen(false);
          
          // Notify parent component
          onLocationSelected(locationData);
          
          // Navigate to map navigation page after getting location
          navigate('/mapNavigation');
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(`Could not get your location: ${error.message}`);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  };

  // Reverse geocoding function (optional)
  const fetchLocationNameFromCoords = async (lat, lng) => {
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        // Update the input value with the address
        if (onChange) onChange(data.display_name);
        
        // Update localStorage with display name
        const locationData = {
          type: 'coordinates',
          lat: lat,
          lng: lng,
          displayName: data.display_name
        };
        localStorage.setItem('userLocation', JSON.stringify(locationData));
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      // Fallback: already using coordinates from getCurrentLocation
    }
  };

  // Handle location selection for cities or history items
  const handleLocationSelect = (locationName) => {
    if (locationName === "Current location") {
      getCurrentLocation();
    } else if (locationName === "Anywhere") {
      // Handle "Anywhere" selection
      const locationData = {
        type: 'anywhere',
        displayName: 'Anywhere'
      };
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      if (onChange) onChange('Anywhere');
      onLocationSelected(locationData);
      setIsOpen(false);
    } else {
      // For cities or history selections
      // In a real app, you might want to geocode the city name to get coordinates
      // For now, we'll just save the name
      const locationData = {
        type: 'named',
        displayName: locationName
      };
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      if (onChange) onChange(locationName);
      onLocationSelected(locationData);
      setIsOpen(false);
    }
  };

  // Configure styles based on variant
  const getVariantStyles = () => {
    if (variant === 'navbar') {
      return {
        container: "flex items-center bg-white rounded relative",
        input: "pl-8 py-2 border-0 text-sm focus:ring-0",
        icon: "absolute left-2 text-gray-400 top-1/2 transform -translate-y-1/2",
        dropdown: "mt-1 z-50",
        text: "text-gray-700"
      };
    } else { // landing variant
      return {
        container: "",
        input: "px-3 py-3 border border-gray-300 text-gray-500 rounded-md text-base",
        icon: "absolute right-3 text-gray-400 top-1/2 transform -translate-y-1/2",
        dropdown: "mt-1 z-30",
        text: "text-gray-700"
      };
    }
  };

  const variantStyles = getVariantStyles();

  // Size variants for the input
  const sizeClasses = {
    small: "py-1",
    default: variant === 'navbar' ? "py-2" : "py-3",
    large: "py-4"
  };

  // Get navbar-specific search bar styles
  const getNavbarSearchStyles = () => {
    if (variant === 'navbar') {
      return {
        borderBottom: '1px solid #e0e0e0',
        paddingRight: '8px'
      };
    }
    return {};
  };

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      {/* Optional Label */}
      {label && variant !== 'navbar' && (
        <label className="block text-gray-700 mb-2 font-medium">{label}</label>
      )}
      
      {/* Input Field with horizontal line for navbar */}
      <div 
        ref={inputRef} 
        className={`relative ${variantStyles.container}`}
        style={variant === 'navbar' ? {borderBottom: '1px solid #e0e0e0'} : {}}
      >
        {/* Search icon for navbar variant */}
        {showIcon && variant === 'navbar' && (
          <SearchOutlined className={variantStyles.icon} />
        )}

        <input
          type="text"
          placeholder={placeholder}
          className={`w-full outline-none ${variantStyles.input} ${sizeClasses[size] || sizeClasses.default}`}
          value={isLoading ? "Getting your location..." : (value || "")}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          style={{...inputStyle, ...(variant === 'navbar' ? getNavbarSearchStyles() : {})}}
        />

        {/* Search icon for landing variant */}
        {showIcon && variant === 'landing' && (
          <SearchOutlined className={variantStyles.icon} />
        )}
      </div>
      
      {/* Show location error if any */}
      {locationError && (
        <div className="text-red-500 text-sm mt-1">{locationError}</div>
      )}
      
      {/* Dropdown Content */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`bg-white rounded-md shadow-lg border border-gray-200 absolute left-0 right-0 top-full ${variantStyles.dropdown}`}
          style={{...dropdownStyle, overflowY: 'visible', maxHeight: 'none', width: '100%'}}
        >
          {/* Quick Options Section */}
          {showQuickOptions && (
            <div className="px-2 py-2">
              <div 
                className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                onClick={() => handleLocationSelect("Current location")}
              >
                <EnvironmentOutlined className="text-lg mr-3 text-gray-600" />
                <span className={`font-medium ${variantStyles.text}`}>Current location</span>
              </div>
              
              <div 
                className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                onClick={() => handleLocationSelect("Anywhere")}
              >
                <GlobalOutlined className="text-lg mr-3 text-gray-600" />
                <div>
                  <div className={`font-medium ${variantStyles.text}`}>Anywhere</div>
                  <div className="text-xs text-gray-500">Browse all vehicles</div>
                </div>
              </div>
            </div>
          )}
          
          {/* History Section */}
          {showHistory && historyList.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-1"></div>
              <div className="px-4 py-1 text-sm text-gray-500">History</div>
              
              {historyList.map((item, index) => (
                <div 
                  key={`history-${index}`} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleLocationSelect(item.name)}
                >
                  <ClockCircleOutlined className="text-lg mr-3 text-gray-600" />
                  <span className={variantStyles.text}>{item.name}</span>
                </div>
              ))}
            </>
          )}
          
          {/* Cities Section */}
          <div className="border-t border-gray-200 my-1"></div>
          <div className="px-4 py-1 text-sm text-gray-500">Cities</div>
          
          {cityList.map((city, index) => (
            <div 
              key={`city-${index}`} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleLocationSelect(city.name)}
            >
              <BankOutlined className="text-lg mr-3 text-gray-600" />
              <span className={variantStyles.text}>{city.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;