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
  eventName: string;
  description: string;
  location: string;
  date: string;
  isActive: boolean;
};

const schema = yup.object({
  eventName: yup.string().max(75, "Max 75 characters").required("Event name is required"),
  description: yup.string().max(255, "Max 255 characters").required("Description is required"),
  location: yup.string().required("Location is required"),
  date: yup.string().required("Date is required"),
  isActive: yup.boolean().default(true),
});

const UpdateEvent = ({ event }: UpdateEventProps) => {
  const [updateEvent, { isLoading }] = eventsAPI.useUpdateEventMutation({
    fixedCacheKey: "updateEvent",
  });

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
      setValue("eventName", event.title);
      setValue("description", event.description);
      setValue("location", event.venue_id.toString());
      setValue("date", event.date.slice(0, 10));
      //setValue("isActive", event.isActive);
    } else {
      reset();
    }
  }, [event, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateEventInputs> = async (data) => {
    try {
      if (!event) {
        toast.error("No event selected for update.");
        return;
      }

      await updateEvent({ ...data, id: event.event_id }).unwrap();
      toast.success("Event updated successfully!");
      reset();
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event. Please try again.");
    }
  };

  return (
    <dialog id="update_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-700 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Event</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("eventName")}
            placeholder="Event Name"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.eventName && <span className="text-sm text-red-500">{errors.eventName.message}</span>}

          <textarea
            {...register("description")}
            placeholder="Description"
            className="textarea textarea-bordered w-full p-2 bg-white text-gray-800"
          />
          {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}

          <input
            type="text"
            {...register("location")}
            placeholder="Location"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.location && <span className="text-sm text-red-500">{errors.location.message}</span>}

          <input
            type="date"
            {...register("date")}
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.date && <span className="text-sm text-red-500">{errors.date.message}</span>}

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-white">Status</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="true"
                    {...register("isActive")}
                    className="radio radio-primary"
                  />
                  Active
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="false"
                    {...register("isActive")}
                    className="radio radio-warning"
                  />
                  Inactive
                </label>
              </div>
            </label>
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-spinner text-primary" /> Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                (document.getElementById("update_event_modal") as HTMLDialogElement)?.close();
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
