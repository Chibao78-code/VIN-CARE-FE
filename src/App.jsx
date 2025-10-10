import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';

import Contact from "./pages/Contact";
import Services from './pages/Services';
import MyBookings from './pages/MyBookings';
import MaintenanceHistory from './pages/MaintenanceHistory';

import Profile from './pages/Profile';
import MyVehicles from './pages/MyVehicles';
import Settings from './pages/Settings';

// Admin 
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminInventory from './pages/admin/AdminInventory';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Staff 
import StaffLayout from './layouts/StaffLayout';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffCustomers from './pages/staff/StaffCustomers';
import StaffAppointments from './pages/staff/StaffAppointments';

// Technician 
import TechnicianLayout from './layouts/TechnicianLayout';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianWorkOrders from './pages/technician/TechnicianWorkOrders';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } 
  return children;
};

//hien thi sau khi login thanh cong
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();  
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }  
  return children;
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } 
        />
        <Route 
          path="/reset-password/:token" 
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } 
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<MyVehicles />} />
          <Route path="services" element={<Services />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="vehicle-history" element={<MaintenanceHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="customers" element={<StaffCustomers />} />
          <Route path="appointments" element={<StaffAppointments />} />
          <Route path="appointments/new" element={<StaffAppointments />} />
        </Route>

        <Route
          path="/technician"
          element={
            <ProtectedRoute>
              <TechnicianLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="dashboard" element={<TechnicianDashboard />} />
          <Route path="work-orders" element={<TechnicianWorkOrders />} />
          <Route path="work-orders/:id" element={<TechnicianWorkOrders />} />
          <Route path="inventory" element={<div>Inventory Page</div>} />
          <Route path="history" element={<div>Service History Page</div>} />
          <Route path="resources" element={<div>Tools & Manuals Page</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;