import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/Hooks';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.user.user);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative w-full z-50">
      <nav
        className="sticky top-0 bg-black px-6 py-4 flex items-center justify-between text-white shadow-md"
        style={{ minHeight: '4rem' }}
      >
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">myticket</Link>

        {/* Center Links */}
        <ul className="hidden md:flex gap-6 uppercase font-medium mx-auto">
          <li><Link to="/upcoming" className="hover:text-orange-400">Upcoming</Link></li>
          <li><Link to="/events" className="hover:text-orange-400">Events</Link></li>
          <li><Link to="/search" className="hover:text-orange-400">Search</Link></li>
          <li><Link to="/gallery" className="hover:text-orange-400">Gallery</Link></li>
          <li><Link to="/contact" className="hover:text-orange-400">Contact</Link></li>
        </ul>

        {/* Cart or Placeholder */}
        {user ? (
          <Link
            to="/cart"
            className="hidden md:block border border-white rounded-full px-3 py-1 cursor-pointer"
          >
            {cartCount} 🛒
          </Link>
        ) : (
          <div className="hidden md:block px-3 py-1 w-[50px]"></div> // invisible placeholder
        )}

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

          {!user && (
            <div className="pt-4 text-sm">
              <Link to="/login" className="text-orange-400 font-bold">SIGN IN</Link>
              <span className="mx-1">|</span>
              <Link to="/register">SIGN UP</Link>
            </div>
          )}

          {user && (
            <div className="pt-4">
              <Link
                to="/cart"
                className="border border-white rounded-full px-3 py-1 w-max block"
              >
                {cartCount} 🛒
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
