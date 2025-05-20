import { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import scenicImage from '../assets/Images/parkanaur.jpg';
import {countyTags} from '../utils/counties';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    county: '',
  });

  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  {/*Form Validation */}
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must include a number, uppercase letter, and special character.';
    }
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.county) newErrors.county = 'Please select a county.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (Object.keys(errors).length > 0) validate();
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/users/register`, formData);
      toast.success('Registration successful!');
      navigate('/login'); 
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Half - Form */}
      <div className="w-full md:w-1/3  flex flex-col justify-start px-8 md:px-16 pt-16 bg-white overflow-y-auto">
        <div className="max-w-lg mx-auto w-full">
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Register</h2>
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Input Fields */}
            {[
              { name: 'firstName', icon: <FaUser />, placeholder: 'First Name' },
              { name: 'lastName', icon: <FaUser />, placeholder: 'Last Name' },
              { name: 'email', icon: <FaEnvelope />, placeholder: 'Email Address', type: 'email' },
              { name: 'password', icon: <FaLock />, placeholder: 'Password', type: 'password' },
              { name: 'confirmPassword', icon: <FaLock />, placeholder: 'Confirm Password', type: 'password' }
            ].map(({ name, icon, placeholder, type = 'text' }) => (
              <div key={name} className="flex flex-col space-y-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors[name] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                    }`}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                </div>
                {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
              </div>
            ))}
            {/* County Dropdown */}
            <div className="flex flex-col space-y-1">
              <select
                name="county"
                value={formData.county}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.county ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                }`}
              >
                <option value="">Select your home county</option>
                {countyTags.map((county) => (
                  <option key={county.value} value={county.value}>
                    {county.label}
                  </option>
                ))}
              </select>
              {errors.county && <p className="text-red-500 text-sm">{errors.county}</p>}
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      {/* Right Half - Image */}
      <div className="hidden md:block w-2/3 h-full">
        <img
          src={scenicImage}
          alt="Scenic View"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Signup;