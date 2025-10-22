import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Home from '../Pages/Homepage';
import Menu from '../Pages/Menupage';
import Login from '../Pages/Login';
import About from '../Pages/Aboutpage';
import Blog from '../Pages/Blogpage';
import Gallery from '../Pages/Gallerypage';
import Pricing from '../Pages/Pricingpage';
import ReservationPage from '../Pages/Reservationpage';
import ContactPage from '../Pages/Ccontactpage';
import Profile from '../Pages/Profile';
import Admin from '../Pages/Admin';
import OrdersPage from '../Pages/OrdersPage';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import RiderLoginPage from '../Pages/RiderLogin';
import RiderDashboardPage from '../Pages/RiderDashboard';
import RiderDeliveryPage from '../components/RiderDeliveryPage';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import RiderProtectedRoute from '../components/RiderProtectedRoute';
import FeedbackPageWrapper from '../Pages/FeedbackPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/Home' element={<><Navbar /><Home /></>} />
        <Route path="/About" element={<><Navbar /><About /></>} />
        <Route path="/" element={<><Navbar /><Menu /></>} />
        <Route path="/user/login" element={<><Navbar /><Login /></>} />
        <Route path="/Blog" element={<><Navbar /><Blog /></>} />
        <Route path="/Gallery" element={<><Navbar /><Gallery /></>} />
        <Route path="/Pricing" element={<><Navbar /><Pricing /></>} />
        <Route path="/reservation" element={<><Navbar /><ReservationPage /></>} />
        <Route path="/Reservation" element={<><Navbar /><ReservationPage /></>} />
        <Route path="/contact" element={<><Navbar /><ContactPage /></>} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} />
        <Route path="/orders" element={<><Navbar /><OrdersPage /></>} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/rider/login" element={<RiderProtectedRoute><RiderLoginPage /></RiderProtectedRoute>} />
        <Route path="/rider/dashboard" element={<RiderProtectedRoute><RiderDashboardPage /></RiderProtectedRoute>} />
        <Route path="/rider/delivery/:orderId" element={<RiderProtectedRoute><RiderDeliveryPage /></RiderProtectedRoute>} />
        <Route path="/feedback" element={<><Navbar /><FeedbackPageWrapper /></>} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App;
