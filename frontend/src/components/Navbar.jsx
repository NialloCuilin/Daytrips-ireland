import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo or Brand */}
          <Link to="/" className="text-xl font-bold text-green-700">
            DayTrips: Ireland
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/About"
              className={({ isActive }) =>
                isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/daytrips"
              className={({ isActive }) =>
                isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
              }
            >
              Daytrips
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
              }
            >
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;