import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import scenicImage from '../assets/Images/giants_causeway.JPG';
import logo from '../assets/Images/logo.png';

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // Validate email format
    if (!email || !password) {
      toast.warn('Please fill in all fields.');
      return;
    }
    if (emailError) {
      toast.error('Please fix the errors before logging in.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(res.data));
      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(`${message}`);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left half */}
      <div className="w-2/3 h-full">
        <img
          src={scenicImage}
          alt="Scenic"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Right half*/}
      <div className="w-1/3 h-full flex flex-col justify-start mt-24 px-16 bg-white">
        <h2 className="text-4xl font-bold text-green-700 mb-8">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
         {/* Email Field */}
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className={`w-full pl-10 pr-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                emailError ? 'border-red-400' : 'border-green-500'
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value) ? '' : 'Invalid email format');
              }}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={emailError || !email || !password}
            className={`w-full py-3 rounded-md font-semibold transition ${
              emailError || !email || !password
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-700'
            }`}
          >
            Log In
          </button>
          {/* Register Link */}
          <div className="text-sm">
            Don’t have an account?{' '}
            <a href="/Signup" className="text-green-600 font-medium hover:underline">
              Register
            </a>
          </div>
          {/* Logo */}
          <div className="mb-4">
            <img
              src={logo}
              alt="Logo"
              className="w-36 h-auto mx-auto mt-8"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;