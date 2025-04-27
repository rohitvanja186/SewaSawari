import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../assets/image/logo.png';
import { Button, Dropdown, Menu, Drawer } from 'antd';
import { MenuOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import LocationDropdown from '../locationDropdown/LocationDropdown';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("Token");
    setIsLoggedIn(false);
    navigate('/');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLocationSelect = (locationName) => {
    setSearchQuery(locationName);
  };

  const cities = [
    { name: "Kathmandu" },
    { name: "Pokhara" },
    { name: "Biratnagar" },
    { name: "Itahari" },
    { name: "Dharan" },
    { name: "Chitwan" }
  ];

  const history = [
    { name: "Kathmandu, Bagmati Province" },
    { name: "Pokhara, Gandaki Province" }
  ];

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
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M16 3H1v18h15m4-9H8m7 0l-3-3m3 3l-3 3" />
          </svg>
          Become a host
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-screen-2xl mx-auto">
        {/* Left: Logo and Search */}
        <div className="flex items-center space-x-2 md:space-x-6">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="w-24 h-auto object-contain" />
          </Link>

          <div className="hidden md:block w-64">
            <LocationDropdown
              placeholder="Current Location, Cites or address"
              onChange={handleLocationSelect}
              value={searchQuery}
              className="w-full"
              cities={cities}
              history={history}
              showHistory={true}
              showQuickOptions={true}
              variant="navbar"
              dropdownStyle={{ maxHeight: '350px', overflowY: 'auto' }}
              inputStyle={{ width: '300px' }}
            />
          </div>
        </div>

        {/* Center: Navigation - Desktop */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-12">
          <Link to="/" className={`font-medium transition-colors ${isActiveRoute('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>Home</Link>
          <Link to="/rental" className={`font-medium transition-colors ${isActiveRoute('/rental') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>Rental</Link>
          <Link to="/aboutUs" className={`font-medium transition-colors ${isActiveRoute('/aboutUs') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>About Us</Link>
          <Link to="/contactUs" className={`font-medium transition-colors ${isActiveRoute('/contactUs') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>Contact Us</Link>
        </div>

        {/* Right: Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <Button onClick={handleLogout} type="default" className="border-gray-300">Logout</Button>
          ) : (
            <>
              <Button type="default" className="border-gray-300 hidden md:block" onClick={() => navigate('/become-host')}>
                Become a host
              </Button>
              <div className="flex items-center space-x-2">
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                  <div className="flex items-center space-x-1 cursor-pointer p-2 rounded-full border border-gray-200">
                    <MenuOutlined className="text-lg" />
                    <UserOutlined className="text-lg" />
                  </div>
                </Dropdown>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden flex items-center" onClick={() => setMobileMenuOpen(true)}>
          <MenuOutlined className="text-xl" />
        </button>

        {/* Mobile menu drawer */}
        <Drawer
          placement="right"
          closable={false}
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={280}
          bodyStyle={{ padding: 0 }}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              <img src={logo} alt="Logo" className="w-24 h-auto object-contain" />
              <button onClick={() => setMobileMenuOpen(false)}>
                <CloseOutlined className="text-xl" />
              </button>
            </div>

            <div className="mb-6">
              <LocationDropdown
                placeholder="Current Location, Cites or address"
                onChange={handleLocationSelect}
                value={searchQuery}
                className="w-full"
                cities={cities}
                history={history}
                size="small"
                variant="navbar"
                dropdownStyle={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                  zIndex: 1050
                }}
              />
            </div>

            <div className="flex flex-col space-y-4">
              <Link to="/" className={`font-medium py-2 ${isActiveRoute('/') ? 'text-blue-600' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/rental" className={`font-medium py-2 ${isActiveRoute('/rental') ? 'text-blue-600' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>Rental</Link>
              <Link to="/aboutUs" className={`font-medium py-2 ${isActiveRoute('/aboutUs') ? 'text-blue-600' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link to="/contactUs" className={`font-medium py-2 ${isActiveRoute('/contactUs') ? 'text-blue-600' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>

              <div className="border-t border-gray-200 pt-4 mt-2">
                {isLoggedIn ? (
                  <Button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} type="default" className="w-full">
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                    <Link to="/register" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                    <Link to="/owner-register" className="flex items-center gap-2 py-2 mt-2 bg-gray-50 px-3 rounded" onClick={() => setMobileMenuOpen(false)}>
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                        <path d="M16 3H1v18h15m4-9H8m7 0l-3-3m3 3l-3 3" />
                      </svg>
                      Become a host
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Navbar;
