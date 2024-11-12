import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handler(event) {
    event.preventDefault();  // Prevent form submission refresh
    axios.post("https://gym-attendance-sdys.onrender.com/api/v1/signin", {
      email: email,
      password: password
    })
    .then((response) => {
      const token = response.data.token
      const userId = response.data.userId
      if(token){
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
        axios.defaults.headers['Authorization'] = `Bearer ${token}`;
      }
      console.log("Signin Success");
      navigate('/home');
    })
    .catch(error => {
      console.error("Signin failed:", error.message || error);
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-100">Sign In</h2>
        <form className="space-y-4" onSubmit={handler}>
          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              placeholder="johndoe@example.com"
              className="w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={(e) => setEmail(e.target.value)}
              value={email}  // Bind input value to state
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={(e) => setPassword(e.target.value)}
              value={password}  // Bind input value to state
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <a onClick={() => {navigate('/signup');}} className="font-medium text-purple-500 hover:underline">
            Sign up
          </a>
        </p>
        <p className="text-sm text-center text-gray-400">
          <a href="/forgot-password" className="hover:underline">
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
