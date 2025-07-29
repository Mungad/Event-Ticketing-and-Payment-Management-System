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
  img_url: string;
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
  img_url: yup.string().url("Must be a valid URL").required("Image URL is required"),
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
      <div className="modal-box bg-white text-black max-w-lg mx-auto rounded-lg shadow-md border border-orange-300">
        <h3 className="font-bold text-xl mb-4 text-orange-600 border-b pb-2 border-orange-200">
          Update Event
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

          <div>
            <label className="text-sm font-medium text-black">Event Poster</label>
            <input
              {...register("img_url")}
              placeholder="Event Poster URL"
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
              <label className="text-sm font-medium text-black">Tickets Total</label>
              <input
                type="number"
                {...register("tickets_total")}
                placeholder="Tickets Total"
                className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.tickets_total && <span className="text-sm text-red-500">{errors.tickets_total.message}</span>}
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium text-black">Ticket Price (KES)</label>
              <input
                type="number"
                {...register("ticket_price")}
                placeholder="Ticket Price"
                className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.ticket_price && <span className="text-sm text-red-500">{errors.ticket_price.message}</span>}
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
            {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
          </div>

          {/* Buttons */}
          <div className="modal-action flex justify-end gap-2 mt-2">
            <button
              type="submit"
              className="btn bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="btn border border-black text-black hover:bg-black hover:text-white"
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
