import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handler(event) {
    event.preventDefault();
    axios.post("http://localhost:3000/api/v1/signup", {
      username: username,
      email: email,
      password: password,
    })
      .then((response) => {
        const token = response.data.token
      if(token){
        localStorage.setItem('token', token)
        axios.defaults.headers['Authorization'] = `Bearer ${token}`;
      }
        console.log("Signup Success");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Signup failed:", error.message || error);
      });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-100">Create an Account</h2>
        <form className="space-y-4" onSubmit={handler}>
          <div>
            <label className="block text-sm font-medium text-gray-400">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              placeholder="johndoe@example.com"
              className="w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a href="/" className="font-medium text-purple-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
