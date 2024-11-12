import { useEffect, useState } from 'react';
import axios from 'axios';

const UserAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const userId = localStorage.getItem('userId'); // Get userId from local storage

        const response = await axios.get(`https://gym-attendance-1.onrender.com/api/v1/attendance/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Set Authorization header
          },
        });
        
        setAttendance(response.data.attendance);
      } catch{
        setError('Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-12 mx-auto h-screen text-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Your Attendance Records</h2>
      {attendance.length === 0 ? (
        <p className="text-center text-gray-400">No attendance records found.</p>
      ) : (
        <div className="space-y-4">
          {attendance.map((record, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-lg">
              <p className="text-sm font-medium">Status: {record.status}</p>
              <p className="text-sm text-gray-400">
                Date: {new Date(record.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAttendance;
