import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RenterRegister from './pages/register/RenterRegistration';
import LandingPage from './pages/landing/Landing';
import LoginPage from './pages/login/Login';
import VehicleOwnerRegister from './pages/register/VehicleOwnerRegistration';
import Home from './pages/home/Home';
import OwnerPage from './pages/ownerPage/OwnerPage';
import Dashboard from './pages/dashboard/Dashboard';
import Rental from './pages/rental/rental';
import Vehicledetails from './pages/VehicleDetails/Vehicledetails';
import Success from './components/Success';
import AboutUs from './pages/aboutUs/AboutUs';
import ContactUs from './pages/contactUs/ContactUs';
import OwnerDetails from './pages/ownerDetails/OwnerDetails';
import MapNavigation from './pages/mapNavigation/MapNavigation';
import StoreDetails from './pages/StoreDetails/StoreDetails';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RenterRegister />} />
        <Route path="/owner-register" element={<VehicleOwnerRegister />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ownerPage" element={<OwnerPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rental" element={<Rental />} />
        <Route path="/rental/:id" element={<Vehicledetails />} />
        <Route path="/success" element={<Success />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/owner-details/:id" element={<OwnerDetails />} />
        <Route path="/owners/:id" element={<StoreDetails />} />

        <Route path="/mapNavigation" element={<MapNavigation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App