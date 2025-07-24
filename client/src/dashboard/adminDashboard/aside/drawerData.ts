import { FaCalendarAlt, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaCreditCard, FaLifeRing, FaUserCheck } from "react-icons/fa6";


export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const adminDrawerData: DrawerData[] = [

    {
        id: "events",
        name: "Events",
        icon: FaCalendarAlt,
        link: "events"
    },
    {
        id: "users",
        name: "Users",
        icon: FiUsers,
        link: "users"
    },
    {
        id: "venues",
        name: "Venues",
        icon: FaMapMarkerAlt,
        link: "venues"
    },
    {
        id: "ticket-orders",
        name: "Ticket Orders",
        icon: FaShoppingCart,
        link: "ticket-orders"
    },
    {
        id: "payments",
        name: "Payments",
        icon: FaCreditCard,
        link: "payments"
    },
    {
        id: "support-tickets",
        name: "Support Tickets",
        icon: FaLifeRing,
        link: "support-tickets"
    },
    {
        id: "profile",
        name: "Profile",
        icon: FaUserCheck,
        link: "profile"
    },

]