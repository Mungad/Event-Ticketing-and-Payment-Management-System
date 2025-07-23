import { Link } from "react-router";
import { adminDrawerData } from "./drawerData";

const AdminDrawer = () => {
    return (
        <div>
            <h2 className="text-xl font-bold text-white p-4 border-b-2 border-gray-700">
                Dashboard Menu
            </h2>
            <ul>
                {adminDrawerData.map((item) => (
                    <li key={item.id}>
                        <Link
                            to={item.link}
                            className="flex items-center space-x-3 p-4 text-white hover:bg-orange-700 transition-colors duration-200"
                        >
                            <item.icon size={24} />
                            <span className="text-base">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDrawer;
