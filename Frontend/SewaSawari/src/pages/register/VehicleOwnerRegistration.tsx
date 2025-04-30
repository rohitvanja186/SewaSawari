import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Input, Button, Divider, TimePicker, Spin, Row, Col } from 'antd';
import { UserOutlined, ShopOutlined, MailOutlined, PhoneOutlined, LockOutlined, GoogleOutlined, ZoomInOutlined, ZoomOutOutlined, SearchOutlined } from '@ant-design/icons';
import Navbar from './../../components/Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Fix for Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const { TextArea } = Input;

// Custom zoom controls component
const ZoomControl = () => {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  const handleZoomOut = () => {
    map.zoomOut();
  };
  
  return (
    <div className="absolute top-2 right-2 bg-white shadow-md rounded-md z-[1000]">
      <Button 
        icon={<ZoomInOutlined />} 
        onClick={handleZoomIn}
        className="flex items-center justify-center border-b"
      />
      <Button 
        icon={<ZoomOutOutlined />} 
        onClick={handleZoomOut}
        className="flex items-center justify-center"
      />
    </div>
  );
};

// Location Marker component with detailed coordinate handling
const LocationMarker = ({ position, setPosition }) => {
  const map = useMap();
  
  // Make map events for handling clicks
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      // Create popup with detailed coordinates
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div>
            <strong>Location selected</strong><br/>
            Latitude: ${lat.toFixed(6)}<br/>
            Longitude: ${lng.toFixed(6)}
          </div>
        `)
        .openOn(map);
    },
  });

  // Add marker if position exists
  return position ? (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition([position.lat, position.lng]);
          toast.info("Location updated", { autoClose: 1500 });
        },
      }}
    />
  ) : null;
};

// Enhanced Search box component to find locations - purely for map redirection
const SearchBox = ({ setPosition }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const map = useMap();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setSearching(true);
    try {
      // Using Nominatim OpenStreetMap search API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Store search results
        setSearchResults(data);
        
        // Immediately fly to the first result
        const { lat, lon } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        
        // Fly to the location with animation (purely visual, no URL changes)
        map.flyTo(newPosition, 16, {
          duration: 1.5,  // Animation duration in seconds
        });
        
        // Do not set position yet - let user click on the specific spot
        toast.info("Location found. Click on the map to select exact position.", { autoClose: 3000 });
      } else {
        toast.warning('No locations found. Please try a different search term.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast.error('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleResultClick = (result) => {
    // When a search result is clicked, fly to that location
    const newPosition = [parseFloat(result.lat), parseFloat(result.lon)];
    
    // Fly to the location with animation (purely visual, no URL changes)
    map.flyTo(newPosition, 18, {
      duration: 1.5,  // Animation duration in seconds
    });
    
    // Close search results dropdown
    setSearchResults([]);
    toast.info(`Showing ${result.display_name.split(',')[0]}. Click on map to select exact location.`, { autoClose: 2000 });
  };

  return (
    <div className="absolute top-2 left-2 z-[1000] w-64 md:w-72">
      <form onSubmit={handleSearch} className="flex">
        <Input
          placeholder="Search (e.g., Dharan, Kathmandu)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          suffix={searching ? <Spin size="small" /> : null}
          className="w-full"
        />
        <Button 
          type="primary" 
          htmlType="submit" 
          className="ml-1 bg-blue-500"
          onClick={(e) => {
            e.preventDefault();
            handleSearch(e);
          }}
        >
          Go
        </Button>
      </form>
      
      {/* Search results dropdown */}
      {searchResults.length > 0 && (
        <div className="mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => handleResultClick(result)}
            >
              <div className="font-medium">{result.display_name.split(',')[0]}</div>
              <div className="text-xs text-gray-500 truncate">{result.display_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Map Control Component - main map wrapper
const MapControl = ({ position, setPosition }) => {
  const mapRef = useRef(null);
  
  return (
    <div className="relative h-80 w-full mb-4 border rounded-lg overflow-hidden">
      <MapContainer 
        center={[27.7172, 85.3240]} // Default center on Kathmandu
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        ref={mapRef}
        // Prevent any URL manipulation
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
        <SearchBox setPosition={setPosition} />
        <ZoomControl />
      </MapContainer>
      
      <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 p-2 rounded-md z-[1000] text-xs">
        <p className="font-semibold mb-0">📍 Search for a location, then click on the map to select the exact spot</p>
      </div>
    </div>
  );
};

const VehicleOwnerRegister = () => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const navigateTo = useNavigate();

  const handleSubmit = async (values) => {
    if (!position) {
      toast.error("Please select your business location on the map");
      return;
    }
    
    // Check required fields for vehicle owner
    if (!values.businessName || !values.description) {
      toast.error("Business name and description are required for vehicle owners");
      return;
    }
    
    setLoading(true);
    try {
      // Show toast when form is submitted
      toast.info("Submitting your business information...", { autoClose: 2000 });
      
      // Format data according to controller requirements
      const requestData = {
        full_name: values.fullName,
        business_name: values.businessName,
        email: values.email,
        phone_number: values.phoneNumber,
        description: values.description, // Changed from 'address' to 'description'
        location: {
          latitude: position[0],
          longitude: position[1]
        },
        operating_hours: values.operatingHours ? {
          start: values.operatingHours[0]?.format('HH:mm'),
          end: values.operatingHours[1]?.format('HH:mm')
        } : null,
        password: values.password,
        role: 'Vehicle Owner',
      };

      const response = await axios.post("http://localhost:5000/register", requestData);

      if(response.status === 201) {
        // Success toast with message about admin approval
        toast.success("Registration submitted successfully! Your account is pending admin approval. Please check your email for updates.", { 
          autoClose: 5000 
        });
        
        // Redirect after a short delay to allow user to read the message
        setTimeout(() => navigateTo('/login'), 2000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      
      // Handle different error scenarios with specific toast messages
      if (error.response) {
        if (error.response.status === 409) {
          toast.error("Email or phone number already exists. Please use a different one.");
        } else if (error.response.status === 400) {
          toast.error("Invalid input. Please check your information and try again.");
        } else {
          toast.error(error.response?.data?.message || "Registration failed. Please try again later.");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    toast.info("Google sign-up functionality is coming soon!");
  };

  const navigateToLogin = (e) => {
    e.preventDefault();
    toast.info("Redirecting to login page...");
    setTimeout(() => navigateTo("/login"), 1000);
  };

  const navigateToRenterRegister = (e) => {
    e.preventDefault();
    toast.info("Redirecting to renter registration...");
    setTimeout(() => navigateTo("/register"), 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex justify-center min-h-[calc(100vh-64px)] px-4">
        {/* Centered Form */}
        <div className="w-full max-w-3xl py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Create your business account</h2>
            <p className="mt-2 text-gray-600">
              Looking to rent a vehicle?{' '}
              <a 
                href="/register" 
                className="text-red-500 hover:text-red-600"
                onClick={navigateToRenterRegister}
              >
                Register here
              </a>
            </p>
          </div>

          <Form
            name="owner-register"
            onFinish={handleSubmit}
            layout="vertical"
            className="w-full"
            initialValues={{ role: 'Vehicle Owner' }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                  <Input
                    size="large"
                    placeholder="Full Name"
                    prefix={<UserOutlined />}
                    className="py-2"
                    onChange={() => {
                      // Clear any previous toast errors when user starts typing
                      toast.dismiss();
                    }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  name="businessName"
                  label="Business Name"
                  rules={[{ required: true, message: 'Please input your business name!' }]}
                >
                  <Input
                    size="large"
                    placeholder="Business/Store Name"
                    prefix={<ShopOutlined />}
                    className="py-2"
                    onChange={() => {
                      toast.dismiss();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Email Address"
                    prefix={<MailOutlined />}
                    className="py-2"
                    onChange={() => {
                      toast.dismiss();
                    }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                  <Input
                    size="large"
                    placeholder="Phone Number"
                    prefix={<PhoneOutlined />}
                    className="py-2"
                    onChange={() => {
                      toast.dismiss();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Business Description"
              rules={[{ required: true, message: 'Please provide your business description!' }]}
            >
              <TextArea
                placeholder="Describe your business, services offered, etc."
                rows={3}
                className="py-2"
                onChange={() => {
                  toast.dismiss();
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="flex justify-between w-full">
                  <span>Select your business location</span>
                  <span className="text-xs text-blue-500">
                    {position ? `${position[0].toFixed(6)}, ${position[1].toFixed(6)}` : "No location selected"}
                  </span>
                </div>
              }
              required
              tooltip="Search for a location, then click on the map to select the exact spot"
            >
              <MapControl position={position} setPosition={setPosition} />
            </Form.Item>

            <Form.Item
              name="operatingHours"
              label="Operating Hours"
            >
              <TimePicker.RangePicker 
                size="large"
                format="HH:mm"
                className="w-full"
                placeholder={['Start Time', 'End Time']}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 8, message: 'Password must be at least 8 characters!' }
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    size="large"
                    placeholder="Password"
                    prefix={<LockOutlined />}
                    className="py-2"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match!'));
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    size="large"
                    placeholder="Confirm Password"
                    prefix={<LockOutlined />}
                    className="py-2"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="h-12 bg-black hover:bg-gray-800"
              >
                Register as Vehicle Owner
              </Button>
            </Form.Item>

            <div className="relative my-6">
              <Divider className="border-gray-300">
                <span className="text-gray-500 bg-white px-2">OR</span>
              </Divider>
            </div>

            <Button
              block
              size="large"
              icon={<GoogleOutlined />}
              className="h-12 flex items-center justify-center"
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </Button>

            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-red-500 hover:text-red-600" 
                onClick={navigateToLogin}
              >
                Log in
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwnerRegister;