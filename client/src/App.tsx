import { createBrowserRouter, RouterProvider } from 'react-router'
import { Toaster } from "sonner";
import './App.css'

import HomePage from './pages/HomePage';
import Events from './pages/Events';
import GalleryPage from './pages/Gallery';
import Login from './pages/auth/LoginPage';
import Register from './pages/auth/RegisterPage';
import VerifyUser from './pages/auth/VerifyUser';
import AdminDashboard from './dashboard/adminDahboard/AdminDashboard';
import CategoryEventsPage from './components/events/CategoryEventsPage';
import EventDetails from './components/events/EventDetails';
import CartPage from './components/events/cart/CartPage';



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
      path: 'admin/dashboard',
      element: <AdminDashboard />,
      children: [
        {
          path: 'events',
          element: <h1>Events</h1>
        },
        {
          path: 'users',
          element: <h1>Users</h1>
        },
        {
          path: 'venues',
          element: <h1>Venues</h1>
        },
        {
          path: 'ticket-orders',
          element: <h1>Ticket Orders</h1>
        },
        {
          path: 'payments',
          element: <h1>Payments</h1>
        },
        {
          path: 'support-tickets',
          element: <h1>Support Tickets</h1>
        },
        {
          path: 'profile',
          element: <h1>Profile</h1>
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


