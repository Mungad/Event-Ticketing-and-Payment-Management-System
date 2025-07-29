import { createBrowserRouter, RouterProvider } from 'react-router'
import { Toaster } from "sonner";
import './App.css'

import HomePage from './pages/HomePage';
import Events from './pages/Events';
import GalleryPage from './pages/Gallery';
import Login from './pages/auth/LoginPage';
import Register from './pages/auth/RegisterPage';
import VerifyUser from './pages/auth/VerifyUser';
import AdminDashboard from './dashboard/adminDashboard/AdminDashboard';
import CategoryEventsPage from './components/events/CategoryEventsPage';
import EventDetails from './components/events/EventDetails';
import CartPage from './components/events/cart/CartPage';
import Contact from './pages/Contact';
import ViewEvents from './dashboard/adminDashboard/events/EventsView';
import VenueViews from './dashboard/adminDashboard/venues/VenueView';
import MyProfile from './pages/MyProfile';
import UserView from './dashboard/adminDashboard/user/UserView';
import SupportTicketsView from './dashboard/adminDashboard/supportTickets/SupportTicketsView';

function App() {
  <Toaster position="top-right" />
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/events',
      element: <Events />,
    },
    {
      path: '/category/:categoryName',
      element: <CategoryEventsPage />,
    },
    {
      path: '/events/:id',
      element: <EventDetails />,
    },
    {
      path: '/cart',
      element: <CartPage />,
    },
    

    {
      path: '/gallery',
      element: <GalleryPage />,
    },
    {
      path: '/contact',
      element: <Contact />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/register/verify',
      element: <VerifyUser />,
    },
    {
      path: '/profile',
      element: <MyProfile />,
    },
    {
      path: 'admin/dashboard',
      element: <AdminDashboard />,
      children: [
        {
          path: 'events',
          element: <ViewEvents/>
        },
        {
          path: 'users',
          element: <UserView />
        },
        {
          path: 'venues',
          element: <VenueViews />
        },
        {
          path: 'ticket-orders',
          element: <h1>Ticket Orders</h1>
        },
        {
          path: 'support-tickets',
          element: <SupportTicketsView/>
        },
      ]
    },
    // Add more routes later
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default App;


