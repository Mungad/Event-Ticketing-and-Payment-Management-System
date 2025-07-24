import { useState } from "react";
import { Loader2, CalendarDays } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { eventsAPI } from "../../../features/events/eventsAPI";
import type { TEvent } from "../../../features/events/types";
import CreateEvent from "./CreateEvent";
import UpdateEvent from "./UpdateEvent";
import DeleteEvent from "./DeleteEvent";

const ViewEvents = () => {
  const { data: events, isLoading: loading, error } = eventsAPI.useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedEvent, setSelectedEvent] = useState<TEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<TEvent | null>(null);

  const handleEdit = (event: TEvent) => {
    setSelectedEvent(event);
    (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (event: TEvent) => {
    setEventToDelete(event);
    (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-12">
      {/* Create Event Button */}
      <div className="flex justify-center mb-3 mt-3">
        <button
          data-test="create-event-button"
          className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg"
          onClick={() => (document.getElementById("my_modal_5") as HTMLDialogElement)?.showModal()}
        >
          Create Event
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">All Events</h2>

      {/* Modals */}
      <CreateEvent />
      <UpdateEvent event={selectedEvent} />
      <DeleteEvent event={eventToDelete} />

      {/* Display Events */}
      {loading && <p className="text-center text-lg"><Loader2 className="animate-spin inline mr-2" />Loading events...</p>}
      {error && <p className="text-red-500 text-center">Error fetching events</p>}

      {events?.data && events.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.data.map((event: TEvent) => (
            <div
              key={event.event_id}
              className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-xl transition duration-200 relative"
            >
              {/* Actions */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEdit(event)}
                  title="Edit"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(event)}
                  title="Delete"
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{event.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <CalendarDays className="inline-block mr-1 h-4 w-4 text-indigo-500" />
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p>Venue ID: {event.venueId}</p>
                <p>Category: <span className="capitalize">{event.category}</span></p>
                <p>Tickets: {event.tickets_sold} / {event.tickets_total}</p>
                <p>Price: KES {event.ticket_price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">No events found.</p>
      )}
    </div>
  );
};

export default ViewEvents;
