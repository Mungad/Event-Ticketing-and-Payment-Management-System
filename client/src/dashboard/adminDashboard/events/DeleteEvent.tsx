import { toast } from "sonner";
import { eventsAPI } from "../../../features/events/eventsAPI";
import { type TEvent } from "../../../features/events/types";

type DeleteEventProps = {
  event: TEvent | null;
};

const DeleteEvent = ({ event }: DeleteEventProps) => {
  const [deleteEvent, { isLoading }] = eventsAPI.useDeleteEventMutation({
    fixedCacheKey: "deleteEvent",
  });

  const handleDelete = async () => {
    if (!event) return;
    try {
      await deleteEvent(event.event_id).unwrap();
      toast.success("Event deleted!");
      (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete event.");
    }
  };

  return (
    <dialog id="delete_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-black rounded-xl shadow-xl max-w-sm">
        <h3 className="font-bold text-lg mb-4 text-orange-600">Delete Event</h3>
        <p className="mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-orange-700">{event?.title}</span>?
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

export default DeleteEvent;
