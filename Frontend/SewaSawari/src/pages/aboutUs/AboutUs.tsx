import React from 'react';
import { Row, Col, Divider, Card, Avatar } from 'antd';
import { 
  CarOutlined, 
  SafetyCertificateOutlined, 
  TeamOutlined, 
  GlobalOutlined,
  CustomerServiceOutlined 
} from '@ant-design/icons';
import Navbar from '../../components/Navbar/navbar';
import Footer from '../../components/Footer/footer';

const AboutUs = () => {
  // Sample team members - replace with actual team data
  const teamMembers = [
    {
      name: "Rajesh Sharma",
      position: "Founder & CEO",
      bio: "With over 15 years of experience in Nepal's transportation industry, Rajesh founded SewaSawari with a vision to revolutionize vehicle rentals.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Sunita Gurung",
      position: "Operations Director",
      bio: "Sunita ensures seamless operations across all locations, with a focus on customer satisfaction and service excellence.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Anil Thapa",
      position: "Fleet Manager",
      bio: "Anil oversees our entire vehicle fleet, ensuring each vehicle meets our strict quality and safety standards.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Priya Magar",
      position: "Customer Relations",
      bio: "Priya leads our customer service team, dedicated to providing exceptional support throughout your rental journey.",
      avatar: "/api/placeholder/100/100"
    }
  ];

  // Milestones in company history
  const milestones = [
    {
      year: "2018",
      event: "SewaSawari founded in Kathmandu with a fleet of 10 vehicles"
    },
    {
      year: "2019",
      event: "Expanded to Pokhara and Chitwan with 50+ vehicles"
    },
    {
      year: "2020",
      event: "Launched our mobile app for easier bookings"
    },
    {
      year: "2021",
      event: "Introduced electric vehicles to our fleet"
    },
    {
      year: "2022",
      event: "Reached 10,000+ successful rentals"
    },
    {
      year: "2023",
      event: "Expanded to 10 cities across Nepal with 200+ vehicles"
    },
    {
      year: "2024",
      event: "Launched peer-to-peer vehicle sharing platform"
    }
  ];

  return (
    <div className="bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About SewaSawari</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Nepal's premier vehicle rental service, connecting people with reliable transportation solutions since 2018.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              SewaSawari began with a simple observation: transportation in Nepal could be more accessible, affordable, and reliable. In 2018, our founder Sneha Magar set out to change the vehicle rental landscape across the country.
            </p>
            <p className="text-gray-700 mb-4">
              Starting with just 10 vehicles in Kathmandu, we focused on exceptional customer service and well-maintained vehicles. Our commitment to quality quickly earned us a reputation as the most trusted vehicle rental service in the region.
            </p>
            <p className="text-gray-700">
              Today, SewaSawari operates in 10 cities across Nepal with a fleet of over 200 vehicles ranging from motorcycles to buses. We've helped thousands of locals and tourists navigate Nepal's beautiful landscapes with confidence and peace of mind.
            </p>
          </Col>
          <Col xs={24} lg={12} className="flex justify-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src="https://static.vecteezy.com/system/resources/thumbnails/013/577/994/small_2x/starting-new-working-day-as-a-team-top-view-of-group-of-six-young-people-holding-hands-together-and-smile-while-sitting-at-the-office-desk-photo.jpg" alt="SewaSawari Team" className="w-full h-auto" />
            </div>
          </Col>
        </Row>
      </div>

      {/* Mission and Values */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              At SewaSawari, we're driven by our commitment to provide reliable transportation solutions while promoting sustainability and supporting local communities.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <CarOutlined style={{ fontSize: '48px', color: '#10B981' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Reliability</h3>
                  <p className="text-gray-600">
                    We ensure every vehicle in our fleet is meticulously maintained and ready for your journey, no matter where you're headed in Nepal.
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#10B981' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Safety</h3>
                  <p className="text-gray-600">
                    Your safety is our priority. Every vehicle undergoes rigorous safety checks, and we offer 24/7 roadside assistance throughout your rental period.
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <GlobalOutlined style={{ fontSize: '48px', color: '#10B981' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sustainability</h3>
                  <p className="text-gray-600">
                    We're committed to reducing our environmental impact by maintaining an eco-friendly fleet that includes electric and fuel-efficient vehicles.
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Our Journey Timeline */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
        
        <div className="max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex mb-8">
              <div className="mr-8 text-right w-24">
                <div className="text-xl font-bold text-teal-600">{milestone.year}</div>
              </div>
              <div className="w-4 relative">
                <div className="absolute top-2 w-4 h-4 rounded-full bg-teal-600"></div>
                {index < milestones.length - 1 && (
                  <div className="absolute top-6 bottom-0 left-1/2 w-0.5 -ml-px h-full bg-teal-300"></div>
                )}
              </div>
              <div className="ml-8 pt-1">
                <p className="text-gray-700">{milestone.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meet the Team */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          
          <Row gutter={[24, 24]}>
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <Avatar src={member.avatar} size={100} />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-teal-600 mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SewaSawari</h2>
        
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <div className="flex items-start mb-8">
              <div className="mr-4 mt-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                  <CarOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Diverse Fleet</h3>
                <p className="text-gray-600">
                  From compact cars to luxury SUVs, motorcycles to buses, we have the perfect vehicle for every need and budget.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="mr-4 mt-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                  <GlobalOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Nationwide Coverage</h3>
                <p className="text-gray-600">
                  With locations in 10 cities across Nepal, you can pick up and drop off vehicles at your convenience.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                  <TeamOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                <p className="text-gray-600">
                  Our team offers invaluable local knowledge to help you navigate Nepal's diverse terrain and cultural landscape.
                </p>
              </div>
            </div>
          </Col>
          
          <Col xs={24} lg={12}>
            <div className="flex items-start mb-8">
              <div className="mr-4 mt-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                  <CustomerServiceOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Our customer service team is available around the clock to assist with any questions or issues during your rental.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="mr-4 mt-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                  <SafetyCertificateOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Insurance</h3>
                <p className="text-gray-600">
                  Every rental includes insurance coverage, giving you peace of mind throughout your journey.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                  <CarOutlined style={{ fontSize: '24px' }} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">
                  No hidden fees or surprises. Our pricing is straightforward with all costs clearly outlined upfront.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Nepal on Your Terms?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Whether you're planning an adventure through the Himalayas or need a reliable vehicle for daily commutes, SewaSawari has you covered.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-teal-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Browse Vehicles
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-teal-700 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default AboutUs;