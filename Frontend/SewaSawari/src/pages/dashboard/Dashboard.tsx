import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  Home,
  Users,
  Settings,
  HelpCircle,
  Menu,
  ChevronRight,
  ChevronDown,
  Bell,
  Search,
  User,
  Check,
  X as XIcon,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  ExternalLink,
  Plus,
  RefreshCw,
  Filter,
  MoreHorizontal,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation

// Types
interface SubMenuItem {
  id: number;
  title: string;
  path: string;
}

interface MenuItem {
  id: number;
  title: string;
  icon: JSX.Element;
  path?: string;
  subMenuItems?: SubMenuItem[];
}

interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface OwnerData {
  id: number;
  business_name: string;
  address: string;
  city: string;
  operating_hours: string;
  email_confirm: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: UserData;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    subMenuItems: [
      { id: 11, title: 'Analytics', path: '/dashboard/analytics' },
      { id: 12, title: 'Reports', path: '/dashboard/reports' },
      { id: 13, title: 'Overview', path: '/dashboard/overview' }
    ]
  },
  {
    id: 2,
    title: 'Users',
    icon: <Users className="w-5 h-5" />,
    subMenuItems: [
      { id: 21, title: 'All Users', path: '/users/all' },
      { id: 22, title: 'Add User', path: '/users/add' },
      { id: 23, title: 'Roles', path: '/users/roles' }
    ]
  },
  {
    id: 3,
    title: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    path: '/settings'
  },
  {
    id: 4,
    title: 'Help',
    icon: <HelpCircle className="w-5 h-5" />,
    path: '/help'
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);
  const [owners, setOwners] = useState<OwnerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      setExpandedMenuId(null);
    }
  };

  const toggleMenuItem = (menuId: number): void => {
    setExpandedMenuId(expandedMenuId === menuId ? null : menuId);
  };

  const handleMenuClick = (path: string): void => {
    console.log(`Navigating to: ${path}`);
    // Add your navigation logic here
  };

  // Logout function
  const handleLogout = (): void => {
     Cookies.remove("Token");
    
 
    
    // Redirect to login page
    navigate('/');
    
    console.log('User logged out successfully');
  };

  const handleAccept = async (id :number) => {
    try {
      // Show loading for this specific card (in a real app)
      await axios.post(`http://localhost:5000/admin/acceptOwner/${id}`);
      // Success notification would be shown here
      fetchOwners();
    } catch (err) {
      console.error('Error accepting owner:', err);
      setError('Failed to accept owner. Please try again.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/admin/rejectOwner/${id}`);
      // Success notification would be shown here
      fetchOwners();
    } catch (err) {
      console.error('Error rejecting owner:', err);
      setError('Failed to reject owner. Please try again.');
    }
  };

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/admin/getOwners");
      setOwners(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching owners:', err);
      setError('Failed to load vehicle owners. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOwners();
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get the first letter of the owner's name for the avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Get a random color for the avatar based on the owner's id
  const getAvatarColor = (id: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    return colors[id % colors.length];
  };

  // Get time since registration
  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          bg-gray-900 
          text-white 
          transition-all 
          duration-300 
          relative
          min-h-screen
          fixed
          left-0
          top-0
          z-30
          shadow-xl
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          {isSidebarOpen ? (
            <span className="text-xl font-bold">SewaSawari</span>
          ) : (
            <span className="text-xl font-bold">SS</span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-2">
          {menuItems.map((item) => (
            <div key={item.id} className="mb-1">
              <div
                onClick={() => 
                  item.subMenuItems 
                    ? toggleMenuItem(item.id)
                    : handleMenuClick(item.path || '/')
                }
                className={`
                  flex items-center px-4 py-3 cursor-pointer
                  hover:bg-gray-800 rounded-lg transition-colors
                  ${expandedMenuId === item.id ? 'bg-gray-800' : ''}
                `}
              >
                <div className="flex items-center flex-1">
                  <span className="mr-3 text-gray-400">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </div>
                {isSidebarOpen && item.subMenuItems && (
                  <span className="ml-auto text-gray-400">
                    {expandedMenuId === item.id ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {isSidebarOpen && item.subMenuItems && expandedMenuId === item.id && (
                <div className="mt-1 ml-4 pl-4 border-l border-gray-700">
                  {item.subMenuItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      onClick={() => handleMenuClick(subItem.path)}
                      className="
                        flex items-center 
                        py-2 px-3
                        text-sm 
                        cursor-pointer
                        hover:bg-gray-800
                        text-gray-300
                        rounded-lg
                        transition-colors
                      "
                    >
                      {subItem.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Logout Button */}
          <div className="mb-1 mt-4">
            <div
              onClick={handleLogout}
              className="
                flex items-center px-4 py-3 cursor-pointer
                hover:bg-red-700 rounded-lg transition-colors
                bg-red-600
              "
            >
              <div className="flex items-center flex-1">
                <span className="mr-3 text-white">
                  <LogOut className="w-5 h-5" />
                </span>
                {isSidebarOpen && (
                  <span className="text-sm font-medium">Logout</span>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Navbar */}
        <nav className="bg-white h-16 shadow-sm fixed right-0 left-0 z-20" style={{ left: isSidebarOpen ? '16rem' : '5rem' }}>
          <div className="flex items-center justify-between h-full px-6">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <Menu size={22} />
              </button>
              <div className="ml-6 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-5">
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative">
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 border-l pl-5 border-gray-200">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  RM
                </div>
                <div>
                  <span className="font-medium text-sm">Rohit Magar</span>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                {/* Logout button in the top navbar */}
                <button
                  onClick={handleLogout}
                  className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="pt-24 px-8 pb-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Vehicle Owner Approvals</h1>
              <p className="text-gray-500 mt-1">Review and approve new vehicle owner registrations</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleRefresh}
                className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center text-gray-700 hover:bg-gray-50 ${isRefreshing ? 'opacity-75' : ''}`}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="relative">
                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center text-gray-700 hover:bg-gray-50">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* API Data Display */}
          {loading && !isRefreshing ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Loading vehicle owner data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl flex items-start">
              <XIcon size={20} className="mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Error Loading Data</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-3 text-sm text-red-700 font-medium hover:text-red-800 inline-flex items-center"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Try Again
                </button>
              </div>
            </div>
          ) : owners.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Vehicle Owners Found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                There are currently no pending vehicle owner requests to review.
              </p>
              <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center mx-auto hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Plus size={16} className="mr-2" />
                Add Vehicle Owner
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
              {owners.map((owner) => (
                <div key={owner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white relative">
                    <div className="flex items-start">
                      <div className={`w-12 h-12 rounded-lg ${getAvatarColor(owner.id)} flex items-center justify-center text-white text-xl font-medium mr-4 shadow-md`}>
                        {getInitial(owner.user.full_name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{owner.business_name}</h3>
                        <div className="flex items-center mt-1">
                          <Award size={14} className="mr-1 opacity-80" />
                          <p className="text-sm opacity-90">{owner.user.role}</p>
                        </div>
                      </div>
                      <button className="text-white opacity-80 hover:opacity-100">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                    <div className="absolute -bottom-3 right-6 text-xs bg-blue-800 text-white px-2 py-0.5 rounded-md">
                      {getTimeSince(owner.createdAt)}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6">
                    {/* Owner Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start">
                        <User size={16} className="mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{owner.user.full_name}</p>
                          <p className="text-xs text-gray-500">Owner Name</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail size={16} className="mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800 break-all">{owner.user.email}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            {owner.email_confirm ? 
                              <><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>Verified</> : 
                              <><span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>Not Verified</>
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone size={16} className="mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{owner.user.phone_number}</p>
                          <p className="text-xs text-gray-500">Contact Number</p>
                        </div>
                      </div>
                  
                      
                      <div className="flex items-start">
                        <Calendar size={16} className="mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{formatDate(owner.createdAt)}</p>
                          <p className="text-xs text-gray-500">Registration Date</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock size={16} className="mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {owner.operating_hours === "{}" ? "Not specified" : owner.operating_hours}
                          </p>
                          <p className="text-xs text-gray-500">Operating Hours</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between space-x-3 pt-4 border-t border-gray-100">
                      <a href={`/owner-details/${owner.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        <ExternalLink size={14} className="mr-1" />
                        View Details
                      </a>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleReject(owner.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center"
                         
                        >
                          <XIcon size={15} className="mr-1.5" />
                          Reject
                        </button>
                        <button 
                          onClick={() => handleAccept(owner.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Check size={15} className="mr-1.5" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;