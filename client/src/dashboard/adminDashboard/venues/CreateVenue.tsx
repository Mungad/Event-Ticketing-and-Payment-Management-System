import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { venuesAPI } from "../../../features/venue/venueAPI";

type CreateVenueInputs = {
  name: string;
  address: string;
  capacity: number;
};

const schema = yup.object({
  name: yup.string().max(100, "Max 100 characters").required("Venue name is required"),
  address: yup.string().max(500, "Max 500 characters").required("Address is required"),
  capacity: yup
    .number()
    .typeError("Capacity must be a number")
    .positive("Capacity must be positive")
    .integer("Capacity must be an integer")
    .required("Capacity is required"),
});

const CreateVenue = () => {
  const [createVenue, { isLoading }] = venuesAPI.useCreateVenueMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVenueInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateVenueInputs> = async (data) => {
    try {
      await createVenue(data).unwrap();
      toast.success("Venue created successfully!");
      reset();
      (document.getElementById("create_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating venue:", error);
      toast.error("Failed to create venue. Please try again.");
    }
  };

  return (
    <dialog id="create_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create New Venue</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("name")}
            placeholder="Venue Name"
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}

          <textarea
            {...register("address")}
            placeholder="Address"
            className="textarea textarea-bordered w-full text-gray-800 bg-white"
          />
          {errors.address && <span className="text-sm text-red-500">{errors.address.message}</span>}

          <input
            type="number"
            {...register("capacity")}
            placeholder="Capacity"
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.capacity && <span className="text-sm text-red-500">{errors.capacity.message}</span>}

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
              ) : (
                "Create"
              )}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                (document.getElementById("create_modal") as HTMLDialogElement)?.close();
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

export default CreateVenue;
