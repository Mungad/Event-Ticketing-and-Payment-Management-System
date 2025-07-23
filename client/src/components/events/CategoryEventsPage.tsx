import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import Footer from '../Footer';

type Event = {
  event_id: number;
  title: string;
  ticket_price: number;
  category: string;
};

const CategoryEventsPage = () => {
  const { categoryName } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventsByCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:8088/events`);
        const filtered = response.data.filter(
          (event: Event) =>
            event.category.toLowerCase() === categoryName?.toLowerCase()
        );
        setEvents(filtered);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsByCategory();
  }, [categoryName]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1">
        <h2 className="text-3xl font-bold mb-8 text-orange-600 capitalize">
          {categoryName} Events
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading events...</p>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {events.map((event) => (
              <div
                key={event.event_id}
                className="shadow-md border rounded-md overflow-hidden flex flex-col"
              >
                <img
                  src={`/images/events/${event.event_id}.jpg`}
                  alt={event.title}
                  className="h-40 object-cover w-full"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <p className="text-orange-600 font-bold mb-4">
                    Ksh {event.ticket_price.toLocaleString()}
                  </p>
                  <Link
                    to={`/events/${event.event_id}`}
                    className="text-center border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white py-2 rounded transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600">
            <p className="text-lg mb-6">No events found in this category.</p>
            <Link
              to="/events"
              className="inline-block px-5 py-2 border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white rounded transition duration-300"
            >
              Back to Categories
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryEventsPage;
