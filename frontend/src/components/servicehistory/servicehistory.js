// HistoryPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceHistory = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/services', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServices(response.data.data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Service History</h1>
      
      {services.length === 0 ? (
        <p>No service history found</p>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {service.vehicleName} ({service.vehicleNumber})
                  </h3>
                  <p className="text-gray-600">
                    {service.serviceTypes.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(service.scheduledDate).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  service.status === 'completed' ? 'bg-green-100 text-green-800' :
                  service.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  service.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {service.status}
                </span>
              </div>
              {service.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">{service.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;