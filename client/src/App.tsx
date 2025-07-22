import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

import HomePage from './pages/HomePage';
import Events from './pages/Events';
import GalleryPage from './pages/Gallery';
import Login from './pages/auth/LoginPage';
import Register from './pages/auth/RegisterPage';
import VerifyUser from './pages/auth/VerifyUser';

function App() {

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
    }
    // Add more routes later
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default App;


