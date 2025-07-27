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
      <div className="modal-box bg-gray-600 text-white max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create New Event</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="label text-sm">Event Title</label>
            <input
              {...register("title")}
              placeholder="Event Title"
              className="input input-bordered w-full bg-white text-black"
            />
            {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
          </div>

          {/* Venue ID */}
          <div>
            <label className="label text-sm">Venue ID</label>
            <input
              {...register("venue_id")}
              placeholder="Venue ID"
              className="input input-bordered w-full bg-white text-black"
            />
            {errors.venue_id && <span className="text-sm text-red-500">{errors.venue_id.message}</span>}
          </div>

          {/* Date & Time */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="label text-sm">Date</label>
              <input
                type="date"
                {...register("date")}
                className="input input-bordered w-full bg-white text-black"
              />
              {errors.date && <span className="text-sm text-red-500">{errors.date.message}</span>}
            </div>
            <div className="w-1/2">
              <label className="label text-sm">Time</label>
              <input
                type="time"
                {...register("time")}
                className="input input-bordered w-full bg-white text-black"
              />
              {errors.time && <span className="text-sm text-red-500">{errors.time.message}</span>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label text-sm">Category</label>
            <input
              {...register("category")}
              placeholder="Category"
              className="input input-bordered w-full bg-white text-black"
            />
            {errors.category && <span className="text-sm text-red-500">{errors.category.message}</span>}
          </div>

          {/* Tickets & Price */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="label text-sm">Total Tickets</label>
              <input
                type="number"
                {...register("tickets_total")}
                placeholder="Total Tickets"
                className="input input-bordered w-full bg-white text-black"
              />
              {errors.tickets_total && <span className="text-sm text-red-500">{errors.tickets_total.message}</span>}
            </div>
            <div className="w-1/2">
              <label className="label text-sm">Ticket Price (KES)</label>
              <input
                type="number"
                {...register("ticket_price")}
                placeholder="Ticket Price"
                className="input input-bordered w-full bg-white text-black"
              />
              {errors.ticket_price && <span className="text-sm text-red-500">{errors.ticket_price.message}</span>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label text-sm">Description</label>
            <textarea
              {...register("description")}
              placeholder="Event Description"
              className="textarea textarea-bordered w-full bg-white text-black"
            />
            {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
          </div>

          {/* Buttons */}
          <div className="modal-action flex justify-end gap-2">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner" /> : "Create"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => (document.getElementById("create_modal") as HTMLDialogElement)?.close()}
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
