import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { eventsAPI } from "../../../features/events/eventsAPI"; 

type CreateEventInputs = {
  title: string;
  description: string;
  venue: string;
  date: string;
};

const schema = yup.object({
  title: yup.string().max(100, "Max 100 characters").required("Event title is required"),
  description: yup.string().max(500, "Max 500 characters").required("Description is required"),
  venue: yup.string().required("Venue is required"),
  date: yup.string().required("Date is required"),
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
      await createEvent(data).unwrap();
      toast.success("Event created successfully!");
      reset();
      (document.getElementById('event_modal') as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <dialog id="create_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create New Event</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("title")}
            placeholder="Event Title"
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}

          <input
            type="text"
            {...register("venue")}
            placeholder="Venue"
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.venue && <span className="text-sm text-red-500">{errors.venue.message}</span>}

          <input
            type="date"
            {...register("date")}
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.date && <span className="text-sm text-red-500">{errors.date.message}</span>}

          <textarea
            {...register("description")}
            placeholder="Description"
            className="textarea textarea-bordered w-full text-gray-800 bg-white"
          />
          {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner text-white" />
                  Creating...
                </>
              ) : "Create"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                (document.getElementById('create_modal') as HTMLDialogElement)?.close();
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

export default CreateEvent;
