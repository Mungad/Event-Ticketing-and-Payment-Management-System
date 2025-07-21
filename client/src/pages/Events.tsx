import Navbar from '../components/Navbar';
import CategoryPage from '../components/events/CategoryPage';
import Footer from '../components/Footer';

const Events = () => {
  return (
    <main className="min-h-screen bg-gray-300">
      <Navbar />
      <CategoryPage />
      <Footer />
    </main>
  );
};

export default Events;
