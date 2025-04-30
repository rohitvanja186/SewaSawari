
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Search, Car, MapPin, Settings as SettingsIcon, User, LogOut, Plus, Image as ImageIcon, DollarSign, WindArrowDown } from 'lucide-react';
import Cookies from "js-cookie";
import axios from 'axios';
import { toast } from 'react-toastify';





// TypeScript interfaces
interface Vehicle {
  id: number;
  vehicle_name: string;
  year: number;
  price: string;
  location: string;
  vehicle_type: string;
  description: string;
  photo_url: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user?: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface VehicleFormData {
  name: string;
  year: number;
  price: string;
  location: string;
  vehicleType: string;
  description: string;
  image: string;
  mileage: string;
  fuelType: string;
  transmission: string;
}

interface FormErrors {
  name?: string;
  year?: string;
  price?: string;
  location?: string;
  vehicleType?: string;
  description?: string;
  mileage?: string;
  image?: string;
}

interface DashboardProps {
  vehicles: Vehicle[];
  searchTerm: string;
}

interface AddVehicleFormProps {
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  vehicles: Vehicle[];
}

type ActiveTabType = 'dashboard' | 'add-vehicle' | 'profile' | 'settings';

// Main Dashboard Component
const OwnerPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from token
  const token = Cookies.get("Token");
  let userId = null;
  
  if(token) {
    try {
      const tokenParts = token.split(".");
      const decodedPayload = JSON.parse(atob(tokenParts[1]));
      userId = decodedPayload.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  // Fetch vehicle data from API
  useEffect(() => {

    console.log(userId)
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/owner/getVehicleById/${userId}`);
        console.log(response);

        if (response.data.success) {
          setVehicles(response.data.data);  
        } else {
          setError("No vehicles Added till Now");
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Error fetching vehicles");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // Render correct component based on active tab
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }
    
    if (error && activeTab === 'dashboard') {
      return (
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard vehicles={vehicles} searchTerm={searchTerm} />;
      case 'add-vehicle':
        return <AddVehicleForm setVehicles={setVehicles} vehicles={vehicles} />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard vehicles={vehicles} searchTerm={searchTerm} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">AutoManage</h1>
          <p className="text-indigo-200 text-sm">Vehicle Owner Dashboard</p>
        </div>
        <nav className="mt-6">
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'dashboard' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            <Car className="h-5 w-5 mr-3" />
            <span>My Vehicles</span>
          </div>
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'add-vehicle' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`} 
            onClick={() => setActiveTab('add-vehicle')}
          >
            <Plus className="h-5 w-5 mr-3" />
            <span>Add Vehicle</span>
          </div>
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'profile' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`} 
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-5 w-5 mr-3" />
            <span>Profile</span>
          </div>
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'settings' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`} 
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </div>
          
          <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700 mt-20">
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'My Vehicles'}
              {activeTab === 'add-vehicle' && 'Add New Vehicle'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search vehicles..."
                className="px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard: React.FC<DashboardProps> = ({ vehicles, searchTerm }) => {
  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicle_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate average price
  const calculateAveragePrice = () => {
    if (vehicles.length === 0) return 0;
    const totalPrice = vehicles.reduce((sum, vehicle) => sum + parseFloat(vehicle.price || '0'), 0);
    return Math.round(totalPrice / vehicles.length);
  };

  // Get latest vehicle
  const getLatestVehicle = () => {
    if (vehicles.length === 0) return "None";
    const sortedVehicles = [...vehicles].sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
    return sortedVehicles[0].vehicle_name;
  };

  return (
    <div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Vehicles</h3>
          <p className="text-3xl font-bold">{vehicles.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Average Value</h3>
          <p className="text-3xl font-bold">${calculateAveragePrice().toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Latest Addition</h3>
          <p className="text-3xl font-bold">{getLatestVehicle()}</p>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img 
              src={vehicle.photo_url} 
              alt={vehicle.vehicle_name} 
              className="w-full h-48 object-cover" 
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = "/api/placeholder/400/250";
              }}
            />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold mb-1">{vehicle.vehicle_name} ({vehicle.year})</h3>
                <div className="flex items-center text-green-600 font-bold">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {parseFloat(vehicle.price).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{vehicle.location}</span>
              </div>
              <p className="text-gray-600 mb-4">{vehicle.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Mileage: {vehicle.mileage.toLocaleString()} mi</span>
                <span>{vehicle.fuel_type}</span>
                <span>{vehicle.transmission}</span>
              </div>
              <div className="mt-6 flex justify-between">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">View Details</button>
                <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors duration-300">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No vehicles found</h3>
          <p className="text-gray-500">Try adjusting your search or add a new vehicle.</p>
        </div>
      )}
    </div>
  );
};

// Add Vehicle Form Component
const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ setVehicles, vehicles }) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    name: '',
    year: new Date().getFullYear(),
    price: '',
    location: '',
    vehicleType: '',
    description: '',
    image: '/api/placeholder/400/250',
    mileage: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<{type: string, text: string} | null>(null);

  // Get user ID from token
  const token = Cookies.get("Token");
  let userId = 1; // Default userId if no token available
  
  if(token) {
    try {
      const tokenParts = token.split(".");
      const decodedToken = JSON.parse(atob(tokenParts[1]));
      userId = decodedToken.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const validateForm = (): boolean => {
    let tempErrors: FormErrors = {};
    if (!formData.name) tempErrors.name = "Vehicle name is required";
    if (!formData.year) tempErrors.year = "Year is required";
    if (!formData.price) tempErrors.price = "Price is required";
    if (!formData.location) tempErrors.location = "Location is required";
    if (!formData.vehicleType) tempErrors.vehicleType = "Vehicle type is required";
    if (!formData.description) tempErrors.description = "Description is required";
    if (!formData.mileage) tempErrors.mileage = "Mileage is required";
    if (!selectedFile && !formData.image) tempErrors.image = "Vehicle image is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitMessage(null);
      
      try {
        // Create FormData object for file upload
        const vehicleFormData = new FormData();
        
        // Append all form fields to FormData
        vehicleFormData.append('name', formData.name);
        vehicleFormData.append('year', formData.year.toString());
        vehicleFormData.append('price', formData.price);
        vehicleFormData.append('location', formData.location);
        vehicleFormData.append('vehicleType', formData.vehicleType);
        vehicleFormData.append('description', formData.description);
        vehicleFormData.append('mileage', formData.mileage);
        vehicleFormData.append('fuelType', formData.fuelType);
        vehicleFormData.append('transmission', formData.transmission);
        vehicleFormData.append('userId', userId.toString());
        
        // Append file if selected
        if (selectedFile) {
          vehicleFormData.append('image', selectedFile);
        }
        
        // Send POST request to backend
        const response = await axios.post('http://localhost:5000/owner/add_Vehicle', vehicleFormData);
        
        // Handle successful response
        if (response.data.vehicle) {
          // Add the new vehicle to the state with format matching API response
          const newVehicle: Vehicle = {
            id: response.data.vehicle.id || Date.now(),
            vehicle_name: formData.name,
            year: formData.year,
            price: formData.price,
            location: formData.location,
            vehicle_type: formData.vehicleType,
            description: formData.description,
            photo_url: formData.image,
            mileage: parseFloat(formData.mileage),
            fuel_type: formData.fuelType,
            transmission: formData.transmission,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: userId
          };
          
          console.log("your userId", userId);
          setVehicles(prev => [...prev, newVehicle]);
          
          // Reset form
          setFormData({
            name: '',
            year: new Date().getFullYear(),
            price: '',
            location: '',
            vehicleType: '',
            description: '',
            image: '/api/placeholder/400/250',
            mileage: '',
            fuelType: 'Gasoline',
            transmission: 'Automatic'
          });
          setSelectedFile(null);
          
          // Show success message
          setSubmitMessage({
            type: 'success',
            text: 'Vehicle added successfully!'
          });

          toast.success("Vehicle Added Sucessfully")

         setTimeout(() => {
            window.location.href = "/ownerPage"
          }, 2000); 
         
          
          // Reset file input
          const fileInput = document.getElementById('vehicle-photo') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }
      } catch (error: any) {
        console.error('Error adding vehicle:', error);
        setSubmitMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to add vehicle. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Vehicle</h2>

      {submitMessage && (
        <div className={`p-4 mb-6 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Vehicle Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. Toyota Camry 2022"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. 2022"
              min="1900"
              max={new Date().getFullYear() + 1}
            />
            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. 25000"
              min="0"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mileage</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.mileage ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. 15000"
              min="0"
            />
            {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. New York, NY"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Plug-in Hybrid">Plug-in Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.vehicleType ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a vehicle type</option>
              <option value="Car">Car</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Wagon">Wagon</option>
              <option value="Minivan">Minivan</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Other">Other</option>
            </select>
            {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
              <option value="CVT">CVT</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="vehicle-photo" className="block text-gray-700 font-medium mb-2">
              Vehicle Photo
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="vehicle-photo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a3 3 0 01-3-3V6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H7zm3-6l2 2 4-4m-6 6h10"></path>
                  </svg>
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or WEBP (Max. 5MB)</p>
                </div>
                <input
                  id="vehicle-photo"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {selectedFile && <p className="text-green-600 text-sm mt-1">File selected: {selectedFile.name}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe your vehicle, condition, features, etc."
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
};



// Profile Component Placeholder
const Profile: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
            <User className="h-16 w-16 text-gray-500" />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full max-w-xs mt-4 hover:bg-indigo-700 transition-colors duration-300">
            Update Photo
          </button>
        </div>
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="(555) 123-4567"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-8">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Component Placeholder - Renamed to avoid conflict
const SettingsPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-gray-500 text-sm">Receive email updates about your account activity</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-gray-500 text-sm">Additional security for your account</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="font-medium">Dark Mode</h4>
            <p className="text-gray-500 text-sm">Switch between light and dark theme</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Security</h3>
        <button className="text-indigo-600 font-semibold mb-4 hover:text-indigo-800">Change Password</button>
        <button className="text-indigo-600 font-semibold mb-4 block hover:text-indigo-800">Manage Login Devices</button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
        <button className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-300">Delete Account</button>
      </div>
    </div>
  );
};

export default OwnerPage;