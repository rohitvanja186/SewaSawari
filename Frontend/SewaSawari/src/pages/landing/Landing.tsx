import React, { useState } from 'react';
import Navbar from './../../components/Navbar/navbar';
import Footer from './../../components/Footer/footer';
import { Button, Card, Select, DatePicker } from 'antd';
import { SearchOutlined, StarFilled, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { FaCar, FaMotorcycle, FaTruck, FaBusAlt } from 'react-icons/fa';
import LocationDropdown from '../../components/locationDropdown/LocationDropdown';
import landingImage from '../../assets/image/landing.jpg';


const { Option } = Select;
const { RangePicker } = DatePicker;

const LandingPage = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');

  const vehicleCategories = [
    { name: "All", icon: <FaCar />, value: "all" },
    { name: "Cars", icon: <FaCar />, value: "cars" },
    { name: "Bikes", icon: <FaMotorcycle />, value: "bikes" },
    { name: "Trucks", icon: <FaTruck />, value: "trucks" },
    { name: "Buses", icon: <FaBusAlt />, value: "buses" }
  ];

  const featuredVehicles = [
    {
      name: "Toyota Hilux 2023",
      price: "Rs. 5,000/day",
      image: "/api/placeholder/300/200",
      type: "SUV",
      rating: 4.9,
      reviews: 124,
      category: "cars"
    },
    {
      name: "Honda CBR 250R",
      price: "Rs. 2,500/day",
      image: "/api/placeholder/300/200",
      type: "Sports Bike",
      rating: 4.7,
      reviews: 89,
      category: "bikes"
    },
    {
      name: "Tata Nexon",
      price: "Rs. 4,500/day",
      image: "/api/placeholder/300/200",
      type: "Compact SUV",
      rating: 4.8,
      reviews: 102,
      category: "cars"
    },
    {
      name: "Royal Enfield Classic",
      price: "Rs. 2,000/day",
      image: "/api/placeholder/300/200",
      type: "Cruiser",
      rating: 4.6,
      reviews: 156,
      category: "bikes"
    },
    {
      name: "Mahindra Bolero Pickup",
      price: "Rs. 3,500/day",
      image: "/api/placeholder/300/200",
      type: "Pickup Truck",
      rating: 4.5,
      reviews: 76,
      category: "trucks"
    },
    {
      name: "Hyundai i20",
      price: "Rs. 3,800/day",
      image: "/api/placeholder/300/200",
      type: "Hatchback",
      rating: 4.7,
      reviews: 93,
      category: "cars"
    }
  ];

  const popularLocations = [
    {
      name: "Kathmandu",
      image: "https://www.attractivetravelnepal.com/wp-content/uploads/2019/12/5.jpg",
      vehicleCount: 244
    },
    {
      name: "Pokhara",
      image: "https://lp-cms-production.imgix.net/2019-06/53693064.jpg",
      vehicleCount: 158
    },
    {
      name: "Chitwan",
      image: "https://republicaimg.nagariknewscdn.com/shared/web/uploads/media/d3pP0QzmZRoXArpq1iGqDZDACoHl8N9otMCf7aLC.jpg",
      vehicleCount: 86
    },
    {
      name: "Biratnagar",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0M1_Cxe_jxLxresD6QiHLyca8HRGdad6pzw&s",
      vehicleCount: 112
    },
    {
      name: "Dharan",
      image: "https://www.nepaltrekking.com/wp-content/uploads/2019/04/99999-1-975x540.jpg",
      vehicleCount: 94
    },
    {
      name: "Itahari",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/554772039.jpg?k=82f1c2d5260ef6229ef9f864389cd272ced6e6cec50a3b4b85f1516ac9428f12&o=&hp=1",
      vehicleCount: 73
    }
  ];

  const topVehicleMakes = [
    {
      name: "Toyota",
      image: "/api/placeholder/250/150",
      count: 48
    },
    {
      name: "Hyundai",
      image: "/api/placeholder/250/150",
      count: 37
    },
    {
      name: "Royal Enfield",
      image: "/api/placeholder/250/150",
      count: 29
    },
    {
      name: "Honda",
      image: "/api/placeholder/250/150",
      count: 52
    },
    {
      name: "Mahindra",
      image: "/api/placeholder/250/150",
      count: 31
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<StarFilled key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  const filteredVehicles = selectedVehicleType === 'all' 
    ? featuredVehicles 
    : featuredVehicles.filter(vehicle => vehicle.category === selectedVehicleType);

  const heroStyle = {
    backgroundImage: `url(${landingImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  };

  // City list data
  const cities = [
    { name: "Kathmandu" },
    { name: "Pokhara" },
    { name: "Biratnagar" },
    { name: "Itahari" },
    { name: "Dharan" },
    { name: "Chitwan" }
  ];

  // History list data
  const history = [
    { name: "Kathmandu, Bagmati Province" },
    { name: "Pokhara, Gandaki Province" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Search using background image */}
      <div className="relative text-white" style={heroStyle}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 md:px-6 py-24 md:py-40 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
              Rent Your Perfect Ride in Nepal
            </h1>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-200">
              From city cars to mountain bikes, find the ideal vehicle for your journey.
              Affordable rates, reliable service.
            </p>
          </div>
          
          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mt-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Location</label>
                <LocationDropdown
                  placeholder="Current Location, Cites or address"
                  onChange={setSearchLocation}
                  value={searchLocation}
                  className="w-full"
                  cities={cities}
                  history={history}
                  showHistory={true}
                  showQuickOptions={true}
                  variant="landing"
                  label=""
                  dropdownStyle={{
                    maxHeight: '350px',
                    overflowY: 'auto'
                  }}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Pick-up & Return Date</label>
                <RangePicker 
                  className="w-full py-3 border border-gray-300 rounded-md" 
                  size="large" 
                  placeholder={['Start date', 'End date']}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Vehicle Type</label>
                <Select 
                  defaultValue="all" 
                  className="w-full" 
                  size="large"
                  style={{ height: '48px' }}
                >
                  <Option value="all">All Types</Option>
                  <Option value="car">Car</Option>
                  <Option value="bike">Bike</Option>
                  <Option value="truck">Truck</Option>
                  <Option value="bus">Bus</Option>
                </Select>
              </div>
            </div>
            <Button 
              type="primary" 
              size="large" 
              icon={<SearchOutlined />} 
              className="bg-gray-900 hover:bg-gray-800 w-full md:w-auto border-gray-900"
            >
              Search Vehicles
            </Button>
          </div>
        </div>
      </div>

      {/* Vehicle Type Filter */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {vehicleCategories.map((category, index) => (
            <div 
              key={index}
              className={`cursor-pointer px-4 py-3 rounded-lg flex flex-col items-center transition-all ${
                selectedVehicleType === category.value 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedVehicleType(category.value)}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <span className="font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Vehicles Section */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Vehicles</h2>
          <Button type="link" className="text-gray-900 flex items-center">
            View All <RightOutlined />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <Card 
              key={index} 
              hoverable 
              className="overflow-hidden"
              cover={
                <div className="relative">
                  <img
                    alt={vehicle.name}
                    src={vehicle.image}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-gray-900 text-white px-3 py-1 rounded-bl-lg">
                    {vehicle.price}
                  </div>
                </div>
              }
            >
              <h3 className="text-lg font-semibold mb-1">{vehicle.name}</h3>
              <p className="text-gray-600 mb-2">{vehicle.type}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {renderStars(vehicle.rating)}
                  <span className="ml-2 text-gray-600">({vehicle.reviews})</span>
                </div>
                <Button type="primary" className="bg-gray-900 hover:bg-gray-800 border-gray-900">
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Destinations Section */}
      <div className="bg-gray-100 py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Popular Destinations</h2>
            <div className="flex space-x-2">
              <Button 
                icon={<LeftOutlined />} 
                shape="circle" 
                className="flex items-center justify-center"
              />
              <Button 
                icon={<RightOutlined />} 
                shape="circle" 
                className="flex items-center justify-center"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularLocations.map((location, index) => (
              <div 
                key={index} 
                className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group"
              >
                <img 
                  src={location.image} 
                  alt={location.name} 
                  className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{location.name}</h3>
                  <p>{location.vehicleCount} vehicles available</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browse by Make Section */}
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Browse by Make</h2>
          <Button type="link" className="text-gray-900 flex items-center">
            View All <RightOutlined />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topVehicleMakes.map((make, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-4 shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <img 
                src={make.image} 
                alt={make.name} 
                className="w-full h-24 object-contain mb-3"
              />
              <h3 className="font-medium">{make.name}</h3>
              <p className="text-sm text-gray-500">{make.count} vehicles</p>
            </div>
          ))}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default LandingPage;