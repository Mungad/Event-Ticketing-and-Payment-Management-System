import { toast } from "sonner";
import { eventsAPI} from "../../../features/events/eventsAPI";
import {  type TEvent } from "../../../features/events/types";
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
      <div className="modal-box bg-gray-800 text-white rounded-lg max-w-sm">
        <h3 className="font-bold text-lg mb-4">Delete Event</h3>
        <p className="mb-4">
          Are you sure you want to delete <span className="font-semibold">{event?.title}</span>?
        </p>
        <div className="modal-action">
          <button className="btn btn-error" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            className="btn"
            onClick={() => (document.getElementById("delete_modal") as HTMLDialogElement)?.close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteEvent;
