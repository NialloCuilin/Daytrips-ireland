import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo1 from '../assets/Images/logo1.png';
import { FaRegNewspaper } from "react-icons/fa";


function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logo1}
              alt="DayTrips Ireland Logo"
              className="h-16 w-auto object-contain"
            />
            <span className="text-xl font-bold text-green-700 whitespace-nowrap">
              DayTrips: Ireland
            </span>
          </Link>

       

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink
              to="/daytrips"
              className={({ isActive }) =>
                isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
              }
            >
              Daytrips
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
              }
            >
              Contact
            </NavLink>

            {user && (
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
                }
              >
                <FaRegNewspaper className="text-4xl "/>
              </NavLink>
            )}

            {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={user.avatar || 'https://via.placeholder.com/40'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border cursor-pointer"
                onClick={() => setShowDropdown(prev => !prev)}
              />

              {showDropdown && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white shadow-lg rounded-md z-50 text-center">
                  <Link to={`/profile/${user._id}`}>Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="text-gray-700 hover:text-green-600 font-semibold"
            >
              Login
            </NavLink>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
