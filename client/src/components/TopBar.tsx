import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/Hooks";
import { logout } from "../features/login/userSlice";
import { toast } from "sonner";

const TopBar: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successfully");
    navigate("/"); // Redirect to homepage
  };

  return (
    <div className="bg-black text-white text-sm px-4 py-1 flex justify-between items-center">
      <div>
        <span>📞 +254 743 890 337</span>
        <span className="ml-4">✉️ info@myticket.com</span>
      </div>

      <div className="hidden md:block">
        {user ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-orange-400 font-bold">
              My Profile
            </Link>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-orange-400 font-bold">SIGN IN</Link>
            <span className="mx-1">|</span>
            <Link to="/register">SIGN UP</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
