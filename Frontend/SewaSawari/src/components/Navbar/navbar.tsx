import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../assets/image/logo.png';
import { Button, Dropdown, Menu } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in cookies when component mounts
    const token = Cookies.get("Token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("Token");
    setIsLoggedIn(false);
    // Redirect to home page after logout
    navigate('/');
  };

  const menu = (
    <Menu className="w-48 mt-2">
      <Menu.Item key="1" className="py-2">
        <Link to="/login">Log in</Link>
      </Menu.Item>
      <Menu.Item key="2" className="py-2">
        <Link to="/register">Sign up</Link>
      </Menu.Item>
      <Menu.Item key="3" className="py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 3H1v18h15m4-9H8m7 0l-3-3m3 3l-3 3" />
          </svg>
          Become a host
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo and Search */}
        <div className="flex items-center space-x-6">
          <img
            src={logo}
            alt="SewaSawari"
            className="h-8"
          />
          
          <div className='flex items-center gap-8 relative'>
            <IoSearch className='absolute text-gray-400' />
            <input
              placeholder="City, vehicle name or store name"
              className="w-[280px] px-6 border-b outline-0"
            />
          </div>
        </div>
        
        {/* Center: Navigation */}
        <div className="flex items-center space-x-12">
          <Link to="/" className="text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/rental" className="text-gray-600 hover:text-gray-900">
            Rental
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900">
            Contact Us
          </Link>
        </div>

        {/* Right: Actions */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Button onClick={handleLogout} type="default" className="border-gray-300">
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button type="default" className="border-gray-300">
              Become a host
            </Button>
            <div className="flex items-center space-x-2">
              <Dropdown
                overlay={menu}
                trigger={['click']}
                placement="bottomRight"
              >
                <div className="flex items-center space-x-1 cursor-pointer">
                  <MenuOutlined className="text-lg" />
                  <UserOutlined className="text-lg" />
                </div>
              </Dropdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;