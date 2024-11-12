import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const MarkAttendance = () => {
  const [status, setStatus] = useState('present');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const userId = ""; // Replace with the actual user ID from authentication
      const token = localStorage.getItem('token')
      const response = await axios.post('https://gym-attendance-1.onrender.com/api/v1/mark', 
        { userId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header of the request
          }
        }
      );

      setMessage(response.data.message); // Display success message
      setTimeout(() => {
        navigate('/home'); // Redirect to Home page after success
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error marking attendance');
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-12 mx-auto h-screen text-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Mark Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
        >
          Submit
        </button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default MarkAttendance;
