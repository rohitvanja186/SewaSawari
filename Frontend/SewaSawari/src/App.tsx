import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RenterRegister from './pages/register/RenterRegistration';
import LandingPage from './pages/landing/Landing';
import LoginPage from './pages/login/Login';
import VehicleOwnerRegister from './pages/register/VehicleOwnerRegistration';
import Home from './pages/home/Home';
import OwnerPage from './pages/ownerPage/OwnerPage';
import Dashboard from './pages/dashboard/Dashboard';
import OtpVerification from './pages/optVerification/OptVerification';
import Rental from './pages/rental/rental';
import Vehicledetails from './pages/VehicleDetails/Vehicledetails';
import Success from './components/Success';


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

      </Routes>
    </BrowserRouter>
  )
}

export default App