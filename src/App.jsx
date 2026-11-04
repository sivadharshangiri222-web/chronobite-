import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Common Components
import Navbar from './components/common/Navbar';
import RoleDemoBar from './components/common/RoleDemoBar';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRouter from './components/common/RoleRouter';
import CartDrawer from './components/customer/CartDrawer';
import ConflictModal from './components/customer/ConflictModal';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import ForgotPassword from './pages/auth/ForgotPassword';

// Customer Pages
import Home from './pages/customer/Home';
import RestaurantPage from './pages/customer/RestaurantPage';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';
import Profile from './pages/customer/Profile';

// Restaurant Pages
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import MenuManagement from './pages/restaurant/MenuManagement';
import RestaurantProfile from './pages/restaurant/RestaurantProfile';
import DeliveryPartners from './pages/restaurant/DeliveryPartners';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function AppLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Hide common navbar on dedicated auth screens
  const isAuthScreen = ['/login', '/register', '/verify-otp', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Role Demo Switcher Bar */}
      <RoleDemoBar />

      {/* Global Navbar */}
      {!isAuthScreen && (
        <Navbar onOpenCart={() => setIsCartOpen(true)} />
      )}

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Cart Conflict Modal (multi-restaurant scoping) */}
      <ConflictModal />

      {/* Main Routed Content */}
      <div className="flex-1">
        <Routes>
          {/* Index & Role Dispatcher */}
          <Route path="/" element={<RoleRouter />} />

          {/* Auth Flow */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer Journey */}
          <Route path="/app" element={<Home />} />
          <Route path="/app/restaurant/:id" element={<RestaurantPage />} />
          <Route
            path="/app/checkout"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'user', 'restaurant', 'delivery_partner']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Restaurant Management */}
          <Route
            path="/restaurant"
            element={
              <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/menu"
            element={
              <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                <MenuManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/profile"
            element={
              <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                <RestaurantProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/partners"
            element={
              <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                <DeliveryPartners />
              </ProtectedRoute>
            }
          />

          {/* Delivery Partner */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute allowedRoles={['delivery_partner', 'admin']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Oversight */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Wildcard Fallback */}
          <Route path="*" element={<RoleRouter />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
