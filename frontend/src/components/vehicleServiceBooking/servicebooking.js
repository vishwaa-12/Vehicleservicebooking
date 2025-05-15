import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServiceBooking = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleNumber: '',
    vehicleName: '',
    vehicleId: '',
    serviceTypes: [],
    otherServiceType: '',
    date: '',
    time: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch user's vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`/api/vehicles?userId=${userId}`);
        setVehicles(response.data);
      } catch (err) {
        console.error('Failed to fetch vehicles', err);
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceTypeChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        serviceTypes: [...prev.serviceTypes, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        serviceTypes: prev.serviceTypes.filter(type => type !== value)
      }));
    }
    
    // Clear error when user selects a service type
    if (errors.serviceTypes) {
      setErrors(prev => ({ ...prev, serviceTypes: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleType) newErrors.vehicleType = 'Please select a vehicle type';
    if (!formData.vehicleNumber) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.vehicleName) newErrors.vehicleName = 'Vehicle name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (formData.serviceTypes.length === 0) newErrors.serviceTypes = 'Select at least one service type';
    if (formData.serviceTypes.includes('other') && !formData.otherServiceType) {
      newErrors.otherServiceType = 'Please specify the other service type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      
      // Build service types array
      let finalServiceTypes = formData.serviceTypes.filter(type => type !== 'other');
      if (formData.serviceTypes.includes('other')) {
        finalServiceTypes.push(formData.otherServiceType);
      }
      
      const bookingData = {
        userId,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        vehicleName: formData.vehicleName,
        vehicleId: formData.vehicleId || null,
        serviceTypes: finalServiceTypes,
        scheduledDate: new Date(`${formData.date}T${formData.time}`),
        notes: formData.notes,
        status: 'pending'
      };

      const response = await axios.post('/api/services', bookingData);
      
      setSuccess('Service booked successfully!');
      setTimeout(() => navigate('/dashboard/history'), 2000);
    } catch (err) {
      console.error('Booking failed:', err);
      setErrors({ submit: err.response?.data?.message || 'Failed to book service' });
    } finally {
      setLoading(false);
    }
  };

  // Available service types
  const serviceTypes = [
    { value: 'regular', label: 'Regular Maintenance' },
    { value: 'oil', label: 'Oil Change' },
    { value: 'tire', label: 'Tire Rotation' },
    { value: 'brake', label: 'Brake Inspection' },
    { value: 'battery', label: 'Battery Check' },
    { value: 'other', label: 'Other Service' }
  ];

  // Vehicle types
  const vehicleTypes = [
    { value: 'two-wheeler', label: 'Two Wheeler' },
    { value: 'four-wheeler', label: 'Four Wheeler' },
    { value: 'others', label: 'Others' }
  ];

  // Time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Book a Service</h2>
          <p className="text-indigo-100">Schedule your vehicle maintenance</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-6 mt-6">
            <p>{success}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6">
            <p>{errors.submit}</p>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vehicle Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.vehicleType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select Vehicle Type --</option>
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.vehicleType && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>
            )}
          </div>

          {/* Vehicle Details - Number & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="E.g., KA01AB1234"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.vehicleNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Vehicle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleChange}
                placeholder="E.g., Honda Civic"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.vehicleName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.vehicleName && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleName}</p>
              )}
            </div>
          </div>

          {/* Registered Vehicles (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select from Registered Vehicles (Optional)
            </label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Your Vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              If you select a registered vehicle, it will override the details entered above.
            </p>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceTypes.map((type) => (
                <div key={type.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={type.value}
                    name="serviceTypes"
                    value={type.value}
                    checked={formData.serviceTypes.includes(type.value)}
                    onChange={handleServiceTypeChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={type.value} className="ml-2 text-gray-700">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.serviceTypes && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceTypes}</p>
            )}
            
            {/* Other Service Type Field */}
            {formData.serviceTypes.includes('other') && (
              <div className="mt-3">
                <input
                  type="text"
                  name="otherServiceType"
                  value={formData.otherServiceType}
                  onChange={handleChange}
                  placeholder="Please specify the service type"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.otherServiceType ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.otherServiceType && (
                  <p className="mt-1 text-sm text-red-600">{errors.otherServiceType}</p>
                )}
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Select Time --</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Any specific issues or requests..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200 flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Book Service Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceBooking;