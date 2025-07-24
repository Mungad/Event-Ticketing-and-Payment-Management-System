import { toast } from "sonner";
import { venuesAPI } from "../../../features/venue/venueAPI";
import type { TVenue } from "../../../features/venue/types";

type DeleteVenueProps = {
  venue: TVenue | null;
};

const DeleteVenue = ({ venue }: DeleteVenueProps) => {
  const [deleteVenue, { isLoading }] = venuesAPI.useDeleteVenueMutation({
    fixedCacheKey: "deleteVenue",
  });

  const handleDelete = async () => {
    try {
      if (!venue) {
        toast.error("No venue selected for deletion.");
        return;
      }

      await deleteVenue(venue.venue_id);
      toast.success("Venue deleted successfully!");
      (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast.error("Failed to delete venue. Please try again.");
    }
  };

  return (
    <dialog id="delete_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-800 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Delete Venue</h3>
        <p className="mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{venue?.name}</span>?
        </p>
        <div className="modal-action flex gap-4">
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner text-primary" /> Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() =>
              (document.getElementById("delete_modal") as HTMLDialogElement)?.close()
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
