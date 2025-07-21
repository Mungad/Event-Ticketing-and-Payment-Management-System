import type { FC } from 'react';
import { Link } from 'react-router';

const TopBar: FC = () => {
  return (
    <div className="bg-black text-white text-sm px-4 py-1 flex justify-between items-center">
      <div>
        <span>📞 +254 743 890 337</span>
        <span className="ml-4">✉️ info@myticket.com</span>
      </div>
      <div className="hidden md:block">
        <Link to="/login" className="text-orange-400 font-bold cursor-pointer">SIGN IN</Link>
        <span className="mx-1">|</span>
        <Link to="/register" className="cursor-pointer">SIGN UP</Link>
      </div>
    </div>
  );
};

export default TopBar;
