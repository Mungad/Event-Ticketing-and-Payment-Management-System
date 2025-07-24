import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { MdDeleteForever } from "react-icons/md";
import { venuesAPI } from "../../../features/venue/venueAPI";
import type { TVenue } from "../../../features/venue/types";
import CreateVenue from "./CreateVenue";
import DeleteVenue from "./DeleteVenue";

const VenueViews = () => {
  const { data: venues, isLoading: loading, error } = venuesAPI.useGetVenuesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [venueToDelete, setVenueToDelete] = useState<TVenue | null>(null);


  const handleDelete = (venue: TVenue) => {
    setVenueToDelete(venue);
    (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-12">
      {/* Create Venue Button */}
      <div className="flex justify-center mb-3 mt-3">
        <button
          data-test="create-venue-button"
          className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg"
          onClick={() => (document.getElementById("create_modal") as HTMLDialogElement)?.showModal()}
        >
          Create Venue
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">All Venues</h2>

      {/* Modals */}
      <CreateVenue />
      <DeleteVenue venue={venueToDelete} />

      {/* Display Venues */}
      {loading && <p className="text-center text-lg"><Loader2 className="animate-spin inline mr-2" />Loading venues...</p>}
      {error && <p className="text-red-500 text-center">Error fetching venues</p>}

      {venues && venues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue: TVenue) => (
            <div
              key={venue.venue_id}
              className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-xl transition duration-200 relative"
            >
              {/* Actions */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(venue)}
                  title="Delete"
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{venue.name}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{venue.address}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <MapPin className="inline-block mr-1 h-4 w-4 text-indigo-500" />
                  Venue ID: {venue.venue_id}
                </p>
                <p>Capacity: {venue.capacity}</p>
                <p>Created At: {new Date(venue.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">No venues found.</p>
      )}
    </div>
  );
};

export default VenueViews;
