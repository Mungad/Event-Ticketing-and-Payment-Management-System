import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Navbar from "../../../Navbar";
import Topbar from "../../../TopBar";
import Footer from "../../../Footer";

const Checkout = () => {
  const navigate = useNavigate();

  const cartItems = useSelector((state: any) => state.cart.items);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F1] text-black">
      <Topbar />
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-start py-10 px-4">
        <div className="w-full max-w-3xl rounded-2xl shadow-lg bg-white p-8 border-4 border-orange-500">
          <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
            Checkout
          </h1>

          {cartItems.length === 0 ? (
            <p className="text-center text-lg text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item: any) => (
                  <div
                    key={item.event_id}
                    className="p-4 bg-[#FFF9F1] border border-orange-200 rounded-xl"
                  >
                    <p className="font-bold text-lg text-orange-600">{item.title}</p>
                    {item.venue?.name && (
                      <p className="text-black">Venue: {item.venue.name}</p>
                    )}
                    <p className="text-black">Tickets: {item.quantity}</p>
                    <p className="text-black">Price per ticket: KSh {item.ticket_price}</p>
                    <p className="text-black font-medium">
                      Subtotal: KSh {item.ticket_price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>


              <div className="mt-10 flex justify-between items-center">
                <button
                  className="border border-black text-black hover:bg-black hover:text-white px-6 py-2 rounded-xl transition"
                  onClick={() => navigate("/events")}
                >
                  Back to Events
                </button>

                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-xl transition"
                  onClick={() => navigate("/payment")}
                >
                  Proceed to Pay
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
