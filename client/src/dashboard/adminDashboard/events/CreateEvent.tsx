import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { eventsAPI } from "../../../features/events/eventsAPI";

type CreateEventInputs = {
  title: string;
  description: string;
  venue_id: string;
  date: string;
  time: string;
  category: string;
  tickets_total: number;
  ticket_price: number;
};

const schema = yup.object({
  title: yup.string().max(100).required("Title is required"),
  description: yup.string().max(500).required("Description is required"),
  venue_id: yup.string().required("Venue ID is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  category: yup.string().required("Category is required"),
  tickets_total: yup.number().required("Total tickets required"),
  ticket_price: yup.number().required("Ticket price is required"),
});

const CreateEvent = () => {
  const [createEvent, { isLoading }] = eventsAPI.useCreateEventMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateEventInputs> = async (data) => {
    try {
      await createEvent({
        ...data,
        venue_id: Number(data.venue_id),
      }).unwrap();

      toast.success("Event created successfully!");
      reset();
      (document.getElementById("create_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event.");
    }
  };

  return (
    <dialog id="create_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-black max-w-lg mx-auto rounded-lg shadow-md border border-orange-300">
        <h3 className="font-bold text-xl mb-4 text-orange-600 border-b pb-2 border-orange-200">
          Create New Event
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-black">Event Title</label>
            <input
              {...register("title")}
              placeholder="Event Title"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
          </div>

          {/* Venue ID */}
          <div>
            <label className="text-sm font-medium text-black">Venue ID</label>
            <input
              {...register("venue_id")}
              placeholder="Venue ID"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.venue_id && <span className="text-sm text-red-500">{errors.venue_id.message}</span>}
          </div>

          {/* Date & Time */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-black">Date</label>
              <input
                type="date"
                {...register("date")}
                className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.date && <span className="text-sm text-red-500">{errors.date.message}</span>}
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium text-black">Time</label>
              <input
                type="time"
                {...register("time")}
                className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.time && <span className="text-sm text-red-500">{errors.time.message}</span>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-black">Category</label>
            <input
              {...register("category")}
              placeholder="Category"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.category && <span className="text-sm text-red-500">{errors.category.message}</span>}
          </div>

          {/* Tickets & Price */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-black">Total Tickets</label>
              <input
                type="number"
                {...register("tickets_total")}
                placeholder="Total Tickets"
                className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.tickets_total && (
                <span className="text-sm text-red-500">{errors.tickets_total.message}</span>
              )}
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium text-black">Ticket Price (KES)</label>
              <input
                type="number"
                {...register("ticket_price")}
                placeholder="Ticket Price"
                className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.ticket_price && (
                <span className="text-sm text-red-500">{errors.ticket_price.message}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-black">Description</label>
            <textarea
              {...register("description")}
              placeholder="Event Description"
              className="textarea w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.description && (
              <span className="text-sm text-red-500">{errors.description.message}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="modal-action flex justify-end gap-2 mt-2">
            <button
              type="submit"
              className="btn bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-spinner" /> : "Create"}
            </button>
            <button
              type="button"
              className="btn border border-black text-black hover:bg-black hover:text-white"
              onClick={() =>
                (document.getElementById("create_modal") as HTMLDialogElement)?.close()
              }
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateEvent;
