import { FaCalendarAlt, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaLifeRing } from "react-icons/fa6";


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
        id: "support-tickets",
        name: "Support Tickets",
        icon: FaLifeRing,
        link: "support-tickets"
    },


]