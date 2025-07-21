import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'

import HomePage from './pages/HomePage';
import Events from './pages/Events';
import GalleryPage from './pages/Gallery';

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
    // Add more routes later
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default App;


