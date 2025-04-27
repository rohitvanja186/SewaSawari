import { Link } from 'react-router-dom';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';
import { Button, Input, Divider } from 'antd';
import logo from '../../assets/image/logo.png'; // Adjust path as needed

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-200 text-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Logo & About */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logo} alt="SewaSawari Logo" className="h-10 mr-3" />
              
            </div>
            <p className="text-gray-600 mb-6">
              Nepal's premier vehicle rental service. Find cars, bikes, trucks and more at affordable rates across the country.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
                <FacebookOutlined className="text-xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
                <TwitterOutlined className="text-xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 transition-colors">
                <InstagramOutlined className="text-xl" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-red-600 transition-colors">
                <YoutubeOutlined className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-5 border-b border-gray-300 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> Browse Vehicles
                </Link>
              </li>
              <li>
                <Link to="/become-host" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> Become a Renter
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-5 border-b border-gray-300 pb-2">Vehicle Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/category/cars" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> Cars
                </Link>
              </li>
              <li>
                <Link to="/category/bikes" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> Motorcycles
                </Link>
              </li>
              <li>
                <Link to="/category/suvs" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> SUVs
                </Link>
              </li>
              <li>
                <Link to="/category/trucks" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> Trucks
                </Link>
              </li>
              <li>
                <Link to="/category/buses" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                  <span className="mr-2">›</span> Buses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-5 border-b border-gray-300 pb-2">Contact & Newsletter</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <EnvironmentOutlined className="text-base mt-1 mr-3" />
                <span className="text-gray-600">
                  Thamel, Kathmandu, Nepal
                </span>
              </li>
              <li className="flex items-center">
                <PhoneOutlined className="text-base mr-3" />
                <span className="text-gray-600">+977 1 4123456</span>
              </li>
              <li className="flex items-center">
                <MailOutlined className="text-base mr-3" />
                <span className="text-gray-600">info@sewasawari.np</span>
              </li>
            </ul>
            <div>
              <p className="text-gray-600 mb-3">Subscribe to our newsletter</p>
              <div className="flex">
                <Input 
                  placeholder="Your email" 
                  className="rounded-r-none focus:border-blue-400" 
                />
                <Button 
                  type="primary" 
                  className="bg-blue-600 hover:bg-blue-500 border-blue-600 rounded-l-none"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <div className="flex justify-center mb-8">
          <Button 
            type="default"
            shape="circle" 
            className="bg-gray-300 text-gray-800 border-gray-300 hover:bg-gray-400 flex items-center justify-center"
            icon={<ArrowUpOutlined />}
            onClick={scrollToTop}
            size="large"
          />
        </div>

        <Divider className="border-gray-300" />

        {/* Footer Bottom */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} SewaSawari. All rights reserved.
          </div>
          <div className="text-gray-600 text-sm md:text-right">
            <Link to="/privacy-policy" className="hover:text-gray-900 mr-4">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-gray-900 mr-4">Terms & Conditions</Link>
            <Link to="/sitemap" className="hover:text-gray-900">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;