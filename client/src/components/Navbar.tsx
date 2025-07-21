import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (scrolled) {
      setMenuOpen(false);
    }
  }, [scrolled]);

  return (
    <div className="relative">
      {/* Top Contact Bar */}
      <div className="bg-black text-white text-sm px-4 py-1 flex justify-between items-center">
        <div>
          <span>📞 +254 743 890 337</span>
          <span className="ml-4">✉️ info@myticket.com</span>
        </div>
        {/* Sign In/Up disappears on scroll */}
        <div className={`${scrolled ? 'hidden' : 'block'} md:block`}>
          <span className="text-orange-400 font-bold cursor-pointer">SIGN IN</span>
          <span className="mx-1">|</span>
          <span className="cursor-pointer">SIGN UP</span>
        </div>
      </div>

      {/* Sticky Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 px-6 py-4 flex items-center justify-between text-white ${
          scrolled ? 'bg-black shadow-md' : 'bg-transparent'
        }`}
        style={{
          minHeight: '4rem',
          backgroundColor: scrolled ? 'black' : 'rgba(0, 0, 0, 0.01)',
        }}
      >
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white">myticket</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 uppercase font-medium">
          <li className="hover:text-orange-400 cursor-pointer">Upcoming</li>
          <li className="hover:text-orange-400 cursor-pointer">Events</li>
          <li className="hover:text-orange-400 cursor-pointer">Search</li>
          <li className="hover:text-orange-400 cursor-pointer">Gallery</li>
          <li className="hover:text-orange-400 cursor-pointer">Contact</li>
        </ul>

        {/* Cart (always shown) */}
        <div className="hidden md:block border border-white rounded-full px-3 py-1 cursor-pointer">
          0 🛒
        </div>

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
            <li className="hover:text-orange-400 cursor-pointer">Upcoming</li>
            <li className="hover:text-orange-400 cursor-pointer">Events</li>
            <li className="hover:text-orange-400 cursor-pointer">Search</li>
            <li className="hover:text-orange-400 cursor-pointer">Gallery</li>
            <li className="hover:text-orange-400 cursor-pointer">Contact</li>
          </ul>

          {/* Sign In / Sign Up (mobile only, visible only when not scrolled) */}
          {!scrolled && (
            <div className="pt-4 text-sm">
              <span className="text-orange-400 font-bold cursor-pointer">SIGN IN</span>
              <span className="mx-1">|</span>
              <span className="cursor-pointer">SIGN UP</span>
            </div>
          )}

          {/* Cart (mobile only) */}
          <div className="pt-4">
            <div className="border border-white rounded-full px-3 py-1 w-max">
              0 🛒
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
