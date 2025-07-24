import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { usersAPI } from "../../../features/users/usersAPI";

type CreateUserInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "support";
};

const schema = yup.object({
  firstName: yup.string().required("First name is required").max(50, "Max 50 characters"),
  lastName: yup.string().required("Last name is required").max(50, "Max 50 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  role: yup.string().oneOf(["user", "admin", "support"]).required("Role is required"),
});

const CreateUser = () => {
  const [createUser, { isLoading }] = usersAPI.useCreateUsersMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateUserInputs> = async (data) => {
    try {
      await createUser(data).unwrap();
      toast.success("User created successfully!");
      reset();
      (document.getElementById("create_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    }
  };

  return (
    <dialog id="create_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create New User</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("firstName")}
            placeholder="First Name"
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.firstName && <span className="text-sm text-red-500">{errors.firstName.message}</span>}

          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.lastName && <span className="text-sm text-red-500">{errors.lastName.message}</span>}

          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="input input-bordered w-full text-gray-800 bg-white"
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}

          <select
            {...register("role")}
            className="select select-bordered w-full text-gray-800 bg-white"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="support">Support</option>
          </select>
          {errors.role && <span className="text-sm text-red-500">{errors.role.message}</span>}

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

export default CreateUser;
