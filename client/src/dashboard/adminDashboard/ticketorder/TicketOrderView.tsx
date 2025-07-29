import { Loader2, Ticket } from "lucide-react";
import { ticketOrderAPI } from "../../../features/ticketorders/ticketordersAPI";
import type { TTicketOrderResponse } from "../../../features/ticketorders/ticketordersAPI";

const TicketOrdersView = () => {
  const { data: orders, isLoading: loading
    // , error
  } = ticketOrderAPI.useGetAllTicketOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-700">Ticket Orders</h2>

      {loading && (
        <p className="text-center text-lg">
          <Loader2 className="animate-spin inline mr-2" />
          Loading ticket orders...
        </p>
      )}
      {/* {error && <p className="text-red-500 text-center">Error fetching ticket orders</p>} */}

      {orders && orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order: TTicketOrderResponse) => (
            <div
              key={order.order_id}
              className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-xl transition duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Order #{order.order_id}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <Ticket className="inline-block mr-1 h-4 w-4 text-orange-600" />
                  Event ID: {order.event_id}
                </p>
                <p>User ID: {order.user_id}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total Price: KES {order.total_price}</p>
                <p className="text-black font-medium capitalize">
                  Payment Status: {order.payment_status}
                </p>
                <p className="text-gray-500">Ordered On: {new Date(order.order_date).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-600 mt-6">No ticket orders found.</p>
      )}
    </div>
  );
};

export default TicketOrdersView;
