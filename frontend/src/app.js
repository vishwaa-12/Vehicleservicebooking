import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/loginpage/login';
import Dashboard from './components/dashboard/dashboard';
import ServiceBooking from './components/vehicleServiceBooking/servicebooking';
import ServiceHistory from './components/servicehistory/servicehistory';

// Create a wrapper component for protected routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

// Component to handle redirect to dashboard if logged in
const AuthCheck = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthCheck />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route path="booking" element={<ServiceBooking />} />
          <Route path="history" element={<ServiceHistory />} />
          <Route index element={<ServiceBooking />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;