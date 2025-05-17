import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'vehicleservice25@gmail.com'; // Define admin email as constant

  const handleSendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/send-otp', { email });
      
      if (response.data.success) {
        setShowOtpField(true);
      } else {
        setError(response.data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });

      if (response.data.success) {
        // Store authentication data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userRole', response.data.user.role || 'user');

        // Redirect based on role (preferred method)
        if (response.data.user.role === 'admin') {
          navigate('/AdminDashboard');
        } 
        // Alternatively, check email if role isn't available
        else if (email.toLowerCase() === ADMIN_EMAIL) {
          navigate('/AdminDashboard');
        } 
        else {
          navigate('/dashboard');
        }
      } else {
        setError(response.data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Vehicle Service</h1>
          <p className="text-gray-600 mt-2">Login with Email OTP</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                disabled={showOtpField || loading}
              />
              {!showOtpField && (
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center min-w-24"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send OTP'}
                </button>
              )}
            </div>
          </div>

          {showOtpField && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Enter OTP (Check your email)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  maxLength="6"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : 'Verify OTP'}
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service
        </div>
      </div>
    </div>
  );
};

export default LoginPage;