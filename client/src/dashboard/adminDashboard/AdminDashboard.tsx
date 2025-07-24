import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminDrawer from "./aside/AdminDrawer";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "sonner";

const AdminDashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setDrawerOpen((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-4 bg-black border-b-2 border-gray-700 h-[60px] flex-shrink-0">
                <div className="flex items-center">
                    <button
                        className="mr-4 text-white text-2xl lg:hidden"
                        onClick={handleDrawerToggle}
                    >
                        {drawerOpen ? <IoCloseSharp /> : <FaBars />}
                    </button>
                    <span className="text-white text-lg font-semibold">
                        Welcome to your Admin dashboard
                    </span>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
                >
                    Logout
                </button>
            </div>

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Drawer */}
                <aside
                    className={`
                        z-40 w-64 bg-orange-600 flex-shrink-0
                        ${drawerOpen ? "" : "hidden"}
                        lg:static lg:block
                    `}
                >
                    <div className="h-full overflow-y-auto">
                        <AdminDrawer />
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 bg-white h-full overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
