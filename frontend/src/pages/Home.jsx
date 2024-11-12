import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate hook for navigation
  
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchTotalAttendance = async () => {
      try {
        const response = await axios.get('https://gym-attendance-sdys.onrender.com/api/v1/attendance_bulk');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('Error fetching attendance data');
        setLoading(false);
      }
    };

    fetchTotalAttendance();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen mx-auto p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-2xl font-bold text-center text-white mb-6">User Attendance Summary</h1>
      <button
        onClick={() => navigate('/mark-attendance')} // Navigate to MarkAttendance page
        className="bg-indigo-800 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded mb-6"
      >
        Mark Your Attendance
      </button>
      <button
         onClick={() => navigate(`/attendance/${userId}`)}// Navigate to Attendance details page
        className="mx-5 bg-indigo-800 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded mb-6"
      >
        Get Details
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.userId} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-2">{user.username}</h2>
            <p className=" text-gray-400 ">
              Total Attendance: <span className="text-white">{user.totalAttendance}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
