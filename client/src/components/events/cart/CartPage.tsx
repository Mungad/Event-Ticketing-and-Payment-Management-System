import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../../Navbar";
import TopBar from "../../TopBar";
import Footer from "../../Footer";
import { removeFromCart } from "../cart/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    if (!userState?.user) {
      navigate("/login");
    }
  }, [userState, navigate]);

  if (!userState?.user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-gray-100 py-10 px-4 md:px-10">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.event_id}
                className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-500 text-sm">
                    Venue: {item.venue?.name || "Unknown Venue"}
                  </p>
                  <p className="text-orange-600 font-medium mt-2">
                    Ksh {item.ticket_price}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.event_id))}
                  className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="pt-6 flex justify-end">
              <Link
                to="/checkout"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-center block w-fit"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
