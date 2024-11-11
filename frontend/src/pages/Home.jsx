import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/attendance_bulk');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError('Error fetching attendance data');
        setLoading(false);
      }
    };

    fetchTotalAttendance();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-white mb-6">User Attendance Summary</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.userId} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-2">{user.name}</h2>
            <p className="text-gray-400 mb-4">{user.email}</p>
            <p className="text-lg text-gray-200 font-medium">
              Total Attendance: <span className="text-white">{user.totalAttendance}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;