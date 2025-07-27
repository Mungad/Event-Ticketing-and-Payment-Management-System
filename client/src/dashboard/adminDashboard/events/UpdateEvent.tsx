import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { eventsAPI } from "../../../features/events/eventsAPI";
import type { TEvent } from "../../../features/events/types";
import { toast } from "sonner";

type UpdateEventProps = {
  event: TEvent | null;
};

type UpdateEventInputs = {
  title: string;
  description: string;
  venue_id: string;
  date: string;
  time: string;
  category: string;
  ticket_price: number;
  tickets_total: number;
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

const UpdateEvent = ({ event }: UpdateEventProps) => {
  const [updateEvent, { isLoading }] = eventsAPI.useUpdateEventMutation({ fixedCacheKey: "updateEvent" });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateEventInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (event) {
      setValue("title", event.title);
      setValue("description", event.description);
      setValue("venue_id", String(event.venue_id));
      setValue("date", event.date.slice(0, 10));
      setValue("time", event.time);
      setValue("category", event.category);
      setValue("ticket_price", event.ticket_price);
      setValue("tickets_total", event.tickets_total);
    } else {
      reset();
    }
  }, [event, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateEventInputs> = async (data) => {
    if (!event) return;
    try {
      await updateEvent({
        id: event.event_id,
        ...data,
        venue_id: Number(data.venue_id),
      }).unwrap();
      toast.success("Event updated!");
      reset();
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update event.");
    }
  };

  return (
    <dialog id="update_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-700 text-white max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Event</h3>
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
              <label className="label text-sm">Tickets Total</label>
              <input
                type="number"
                {...register("tickets_total")}
                placeholder="Tickets Total"
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
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                (document.getElementById("update_modal") as HTMLDialogElement)?.close();
                reset();
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateEvent;
