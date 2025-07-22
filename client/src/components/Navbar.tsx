import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full z-50">

      {/* Sticky Navbar */}
      <nav
        className="sticky top-0 bg-black px-6 py-4 flex items-center justify-between text-white shadow-md"
        style={{ minHeight: '4rem' }}
      >
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">myticket</Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 uppercase font-medium">
          <li><Link to="/upcoming" className="hover:text-orange-400">Upcoming</Link></li>
          <li><Link to="/events" className="hover:text-orange-400">Events</Link></li>
          <li><Link to="/search" className="hover:text-orange-400">Search</Link></li>
          <li><Link to="/gallery" className="hover:text-orange-400">Gallery</Link></li>
          <li><Link to="/contact" className="hover:text-orange-400">Contact</Link></li>
        </ul>

        {/* Cart */}
        <Link
          to="/cart"
          className="hidden md:block border border-white rounded-full px-3 py-1 cursor-pointer"
        >
          0 🛒
        </Link>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white px-6 py-4 space-y-3">
          <ul className="flex flex-col gap-2 text-sm uppercase font-medium">
            <li><Link to="/upcoming" className="hover:text-orange-400">Upcoming</Link></li>
            <li><Link to="/events" className="hover:text-orange-400">Events</Link></li>
            <li><Link to="/search" className="hover:text-orange-400">Search</Link></li>
            <li><Link to="/gallery" className="hover:text-orange-400">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-orange-400">Contact</Link></li>
          </ul>

          <div className="pt-4 text-sm">
            <Link to="/login" className="text-orange-400 font-bold">SIGN IN</Link>
            <span className="mx-1">|</span>
            <Link to="/register">SIGN UP</Link>
          </div>

          <div className="pt-4">
            <Link
              to="/cart"
              className="border border-white rounded-full px-3 py-1 w-max block"
            >
              0 🛒
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
