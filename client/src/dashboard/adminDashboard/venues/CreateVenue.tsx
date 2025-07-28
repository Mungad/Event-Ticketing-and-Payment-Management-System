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
  name: yup.string().max(100).required("Venue name is required"),
  address: yup.string().max(200).required("Address is required"),
  capacity: yup.number().min(1, "Capacity must be at least 1").required("Capacity is required"),
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
      (document.getElementById("create_venue_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating venue:", error);
      toast.error("Failed to create venue.");
    }
  };

  return (
    <dialog id="create_venue_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-black max-w-lg mx-auto rounded-lg shadow-md border border-orange-300">
        <h3 className="font-bold text-xl mb-4 text-orange-600 border-b pb-2 border-orange-200">
          Create New Venue
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Venue Name */}
          <div>
            <label className="text-sm font-medium text-black">Venue Name</label>
            <input
              {...register("name")}
              placeholder="Venue Name"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-black">Address</label>
            <input
              {...register("address")}
              placeholder="Address"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.address && <span className="text-sm text-red-500">{errors.address.message}</span>}
          </div>

          {/* Capacity */}
          <div>
            <label className="text-sm font-medium text-black">Capacity</label>
            <input
              type="number"
              {...register("capacity")}
              placeholder="Capacity"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.capacity && <span className="text-sm text-red-500">{errors.capacity.message}</span>}
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
                (document.getElementById("create_venue_modal") as HTMLDialogElement)?.close()
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

export default CreateVenue;
