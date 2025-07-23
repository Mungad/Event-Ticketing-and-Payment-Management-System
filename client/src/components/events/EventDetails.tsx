import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../components/events/cart/cartSlice";
import { toast } from "sonner";

import TopBar from "../TopBar"; // ✅ ADD THIS
import Navbar from "../Navbar";
import Footer from "../Footer";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [event, setEvent] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8088/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  const remainingTickets = event.tickets_total - event.tickets_sold;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        event_id: event.event_id,
        title: event.title,
        ticket_price: event.ticket_price,
        venue: event.venue,
        quantity,
      })
    );
    toast.success("Event added to cart!");
    navigate("/cart");
  };

  const isInvalidQuantity = quantity <= 0 || quantity > remainingTickets;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <TopBar /> {/* ✅ TOPBAR */}
      <Navbar />

      <main className="flex-grow py-10">
        <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto rounded-xl shadow">
          <img
            src={`/images/events/${event.event_id}.jpg`}
            alt={event.title}
            className="w-full h-auto rounded-xl shadow-md"
          />
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-black">{event.title}</h2>
              <p className="text-gray-500">
                Venue:{" "}
                <span className="font-medium text-black">
                  {event.venue?.name || `Unknown Venue`}
                </span>
              </p>
              <p className="text-orange-600 text-xl font-semibold">
                Ksh {event.ticket_price}
              </p>
              <p className="mt-4 text-gray-700">{event.description}</p>
              <p className="mt-2 text-sm text-green-600">
                🟢 {remainingTickets} tickets available
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min={1}
                  max={remainingTickets}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-md border border-gray-400 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/events")}
                  className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 text-black"
                >
                  ← Back to Categories
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={isInvalidQuantity}
                  className={`px-6 py-2 rounded text-black ${
                    isInvalidQuantity
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetails;
