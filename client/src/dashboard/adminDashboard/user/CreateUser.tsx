// src/dashboard/adminDashboard/users/CreateUser.tsx

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
  role: "user" | "admin";
};

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.mixed<"user" | "admin">().oneOf(["user", "admin"]).required("Role is required"),
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
      (document.getElementById("create_user_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user.");
    }
  };

  return (
    <dialog id="create_user_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-black max-w-lg mx-auto rounded-lg shadow-md border border-orange-300">
        <h3 className="font-bold text-xl mb-4 text-orange-600 border-b pb-2 border-orange-200">
          Create New User
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-black">First Name</label>
            <input
              {...register("firstName")}
              placeholder="First Name"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.firstName && <span className="text-sm text-red-500">{errors.firstName.message}</span>}
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium text-black">Last Name</label>
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.lastName && <span className="text-sm text-red-500">{errors.lastName.message}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-black">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-black">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="input w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-black">Role</label>
            <select
              {...register("role")}
              className="select w-full bg-white text-black border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <span className="text-sm text-red-500">{errors.role.message}</span>}
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
              onClick={() => (document.getElementById("create_user_modal") as HTMLDialogElement)?.close()}
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
