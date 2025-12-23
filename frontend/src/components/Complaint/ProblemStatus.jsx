import React, { useState, useEffect } from 'react';
import Navbar from '../homepage/Navbar';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ProblemStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your complaints.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/complaints/my-complaints`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComplaints(response.data.complaints);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Failed to load complaints. Please try again later.');
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'; // Handle if manually set to rejected
      case 'on_hold': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reopened': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
      if (status === 'in_progress') return 'Accepted / In Progress';
      if (status === 'resolved') return 'Completed';
      if (status === 'cancelled') return 'Rejected'; 
      return status.replace('_', ' ');
  };

  return (
    <div className='min-h-screen w-full bg-gray-50'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>My Reported Problems</h1>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600'></div>
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative' role='alert'>
            <span className='block sm:inline'>{error}</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className='text-center py-10 bg-white rounded-lg shadow'>
            <p className='text-xl text-gray-500'>You haven't reported any problems yet.</p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {complaints.map((complaint) => (
              <div key={complaint._id} className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100'>
                 {complaint.photoUrl && (
                  <div className='h-48 w-full overflow-hidden'>
                    <img 
                      src={`${API_BASE_URL}${complaint.photoUrl}`} 
                      alt={complaint.title} 
                      className='w-full h-full object-cover transform hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                )}
                <div className='p-6'>
                  <div className='flex justify-between items-start mb-4'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusColor(complaint.status)}`}>
                      {getStatusLabel(complaint.status)}
                    </span>
                    <span className='text-sm text-gray-500'>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2 truncate' title={complaint.title}>{complaint.title}</h3>
                  <p className='text-gray-600 mb-4 line-clamp-2' title={complaint.description}>{complaint.description}</p>
                  
                  <div className='border-t border-gray-100 pt-4'>
                     <div className='flex items-center text-sm text-gray-500 mb-2'>
                        <span className='font-medium mr-2'>Topic:</span> {complaint.category}
                     </div>
                     <div className='flex items-center text-sm text-gray-500'>
                        <span className='font-medium mr-2'>Location:</span> {complaint.city}, {complaint.state}
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default ProblemStatus;
