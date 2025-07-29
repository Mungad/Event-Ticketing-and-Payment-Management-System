import { Loader2, MessageSquare } from "lucide-react";
import { supportAPI } from "../../../features/support/supportAPI";
import type { TSupportTicket } from "../../../features/support/types";

const SupportTicketsView = () => {
  const { data: tickets, isLoading: loading, error } = supportAPI.useGetAllTicketsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-700">Support Tickets</h2>

      {loading && (
        <p className="text-center text-lg">
          <Loader2 className="animate-spin inline mr-2" />
          Loading support tickets...
        </p>
      )}
      {/* {error && <p className="text-red-500 text-center">Error fetching support tickets</p>} */}

      {tickets && tickets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket: TSupportTicket) => (
            <div
              key={ticket.ticket_id}
              className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-xl transition duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ticket #{ticket.ticket_id}</h3>
              <p className="text-gray-700 mb-3 line-clamp-3">{ticket.description}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <MessageSquare className="inline-block mr-1 h-4 w-4 text-orange-600" />
                  Subject: {ticket.subject}
                </p>
                <p className="text-gray-800">User ID: {ticket.user_id}</p>
                <p className="text-black font-medium capitalize">Status: {ticket.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-600 mt-6">No support tickets found.</p>
      )}
    </div>
  );
};

export default SupportTicketsView;
