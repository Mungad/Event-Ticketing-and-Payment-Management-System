import { toast } from "sonner";
import { venuesAPI } from "../../../features/venue/venueAPI";
import { type TVenue } from "../../../features/venue/types";

type DeleteVenueProps = {
  venue: TVenue | null;
};

const DeleteVenue = ({ venue }: DeleteVenueProps) => {
  const [deleteVenue, { isLoading }] = venuesAPI.useDeleteVenueMutation({
    fixedCacheKey: "deleteVenue",
  });

  const handleDelete = async () => {
    if (!venue) return;
    try {
      await deleteVenue(venue.venue_id).unwrap();
      toast.success("Venue deleted!");
      (document.getElementById("delete_venue_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete venue.");
    }
  };

  return (
    <dialog id="delete_venue_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-black rounded-xl shadow-xl max-w-sm">
        <h3 className="font-bold text-lg mb-4 text-orange-600">Delete Venue</h3>
        <p className="mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-orange-700">{venue?.name}</span>?
        </p>
        <div className="modal-action">
          <button
            className="btn bg-orange-600 text-white hover:bg-orange-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            className="btn border border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={() =>
              (document.getElementById("delete_venue_modal") as HTMLDialogElement)?.close()
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteVenue;
