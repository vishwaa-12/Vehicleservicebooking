import React from 'react';

const ServiceHistory = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Service History</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500">No service history found</p>
      </div>
    </div>
  );
};

export default ServiceHistory;