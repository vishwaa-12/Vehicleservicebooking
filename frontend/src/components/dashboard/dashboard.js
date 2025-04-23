import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const [activeTab, setActiveTab] = useState('booking');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-70 bg-indigo-700 text-white p-4 flex flex-col">
        <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold">Vehicle Service Booking</h1>
          <p className="text-indigo-200 text-sm">Management Portal</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard/booking"
                className={`flex items-center p-3 rounded-lg transition ${activeTab === 'booking' ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
                onClick={() => setActiveTab('booking')}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Service Booking
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/history"
                className={`flex items-center p-3 rounded-lg transition ${activeTab === 'history' ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
                onClick={() => setActiveTab('history')}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Service History
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Email at Bottom */}
        <div className="mt-auto p-4 bg-indigo-800 rounded-lg">
          <div className="flex items-center">
            <div className="bg-indigo-600 p-2 rounded-full mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-indigo-200">Logged in as</p>
              <p className="font-medium">{userEmail}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 w-full text-left text-sm text-indigo-300 hover:text-white flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;