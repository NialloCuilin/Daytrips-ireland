import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import logo from '../assets/Images/logo1.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-700 py-10">
      <div className="w-full px-6 sm:px-8 lg:px-10">

        {/* Social + Copyright */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4 text-green-700 text-xl">
            <FaFacebookF className="hover:text-green-900 cursor-pointer" />
            <FaInstagram className="hover:text-green-900 cursor-pointer" />
            <FaTwitter className="hover:text-green-900 cursor-pointer" />
          </div>
          <p className="text-sm text-gray-400 mt-4">
            © {new Date().getFullYear()} DayTrips: Ireland. All rights reserved.
          </p>
        </div>
      </div>    
    </footer>
  );
};

export default Footer;
