import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo1 from '../assets/Images/logo1.png';
import logo2 from '../assets/Images/logo2.png';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/'); // Redirect to homepage
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo or Brand */}
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

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
                  }
                >
                 Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
                }
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
