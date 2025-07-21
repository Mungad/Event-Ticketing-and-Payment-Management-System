import { Link } from "react-router";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-100 text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-pink-500 mb-2">MyTicket</h2>
          <p className="text-gray-300 text-sm">
            Seamless event discovery and ticketing for concerts, sports, and more.
          </p>

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a href="#" className="text-pink-400 hover:text-white text-xl">
              <FaFacebookF />
            </a>
            <a href="#" className="text-pink-400 hover:text-white text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-pink-400 hover:text-white text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-pink-400 hover:text-white text-xl">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-pink-400">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><Link to="/" className="hover:text-pink-500">Home</Link></li>
            <li><Link to="/events" className="hover:text-pink-500">Events</Link></li>
            <li><Link to="/about" className="hover:text-pink-500">About</Link></li>
            <li><Link to="/login" className="hover:text-pink-500">Login</Link></li>
            <li><Link to="/register" className="hover:text-pink-500">Sign Up</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-pink-400">Contact Us</h3>
          <p className="text-sm text-gray-300">Nairobi, Kenya</p>
          <p className="text-sm text-gray-300">info@myticket.com</p>
          <p className="text-sm text-gray-300">+254 700 123 456</p>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EventBooker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
