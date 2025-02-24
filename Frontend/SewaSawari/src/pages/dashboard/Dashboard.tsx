// types.ts
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

// Layout.tsx
import React, { useState } from 'react';
import {
  Home,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Bell,
  Search,
  User
} from 'lucide-react';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          bg-gray-800 
          text-white 
          transition-all 
          duration-300 
          relative
          min-h-screen
          fixed
          left-0
          top-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          {isSidebarOpen ? (
            <span className="text-xl font-bold">Logo</span>
          ) : (
            <span className="text-xl font-bold">L</span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              <div
                onClick={() => 
                  item.subMenuItems 
                    ? toggleMenuItem(item.id)
                    : handleMenuClick(item.path || '/')
                }
                className={`
                  flex items-center px-4 py-3 cursor-pointer
                  hover:bg-gray-700 transition-colors
                  ${expandedMenuId === item.id ? 'bg-gray-700' : ''}
                `}
              >
                <div className="flex items-center flex-1">
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="text-sm">{item.title}</span>
                  )}
                </div>
                {isSidebarOpen && item.subMenuItems && (
                  <span className="ml-auto">
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
                <div className="bg-gray-700">
                  {item.subMenuItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      onClick={() => handleMenuClick(subItem.path)}
                      className="
                        flex items-center 
                        pl-12 pr-4 py-2 
                        text-sm 
                        cursor-pointer
                        hover:bg-gray-600
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
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Navbar */}
        <nav className="bg-white h-16 shadow-sm fixed right-0 left-0 z-10" style={{ left: isSidebarOpen ? '16rem' : '5rem' }}>
          <div className="flex items-center justify-between h-full px-4">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
              <div className="ml-4 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} />
                </div>
                <span className="font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="pt-20 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          {/* Your page content goes here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;