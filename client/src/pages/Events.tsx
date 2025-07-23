import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import CategoryPage from '../components/events/CategoryPage';
import Footer from '../components/Footer';
//import EventList from "../dashboard/adminDashboard/events/EventList";

const Events = () => {
  return (
    <main className="min-h-screen bg-gray-300">
      <TopBar />
      <Navbar />
      <CategoryPage />
      <Footer />
      {/* <EventList /> */}
    </main>
  );
};

export default Events;
