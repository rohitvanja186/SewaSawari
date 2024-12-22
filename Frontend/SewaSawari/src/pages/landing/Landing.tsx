import React from 'react';
import Navbar from './../../components/Navbar/navbar';
import { Button, Card } from 'antd';
import { ClockCircleOutlined, SafetyCertificateOutlined, CarOutlined } from '@ant-design/icons';

const LandingPage = () => {
  const featuredVehicles = [
    {
      name: "Toyota Camry 2024",
      price: "$45/day",
      image: "/api/placeholder/300/200",
      type: "Sedan"
    },
    {
      name: "Honda CR-V",
      price: "$60/day",
      image: "/api/placeholder/300/200",
      type: "SUV"
    },
    {
      name: "Royal Enfield Classic",
      price: "$25/day",
      image: "/api/placeholder/300/200",
      type: "Motorcycle"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Rent Your Perfect Ride Today
            </h1>
            <p className="text-xl mb-8">
              Explore our wide range of vehicles for any occasion. 
              From luxury cars to everyday commuters, find your ideal match.
            </p>
            <Button type="default" className="bg-white hover:bg-gray-100">
              Browse Vehicles
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Vehicles Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVehicles.map((vehicle, index) => (
            <Card key={index} hoverable cover={
              <img
                alt={vehicle.name}
                src={vehicle.image}
                className="h-48 object-cover"
              />
            }>
              <h3 className="text-xl font-semibold mb-2">{vehicle.name}</h3>
              <p className="text-gray-600 mb-2">{vehicle.type}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">
                  {vehicle.price}
                </span>
                <Button type="primary">
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Choose SewaSawari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <ClockCircleOutlined className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support for your convenience
              </p>
            </div>
            <div className="text-center p-6">
              <SafetyCertificateOutlined className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Fully Insured</h3>
              <p className="text-gray-600">
                All vehicles come with comprehensive insurance coverage
              </p>
            </div>
            <div className="text-center p-6">
              <CarOutlined className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Wide Selection</h3>
              <p className="text-gray-600">
                Choose from our extensive fleet of well-maintained vehicles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers who trust SewaSawari
          </p>
          <Button type="default" className="bg-white hover:bg-gray-100">
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;