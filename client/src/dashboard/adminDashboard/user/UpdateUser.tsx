import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usersAPI } from "../../../features/users/usersAPI";
import type { TUser } from "../../../features/users/usersAPI";
import { toast } from "sonner";

type UpdateUserProps = {
  user: TUser | null;
};

type UpdateUserInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

const schema = yup.object({
  firstName: yup.string().max(50, "Max 50 characters").required("First name is required"),
  lastName: yup.string().max(50, "Max 50 characters").required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  role: yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

const UpdateUser = ({ user }: UpdateUserProps) => {
  const [updateUser, { isLoading }] = usersAPI.useUpdateUserMutation({
    fixedCacheKey: "updateUser",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      setValue("password", user.password);
      setValue("role", user.role as "user" | "admin");
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateUserInputs> = async (data) => {
    try {
      if (!user) {
        toast.error("No user selected for update.");
        return;
      }

      await updateUser({ ...data, id: user.user_id }).unwrap();
      toast.success("User updated successfully!");
      reset();
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  return (
    <dialog id="update_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-700 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update User</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("firstName")}
            placeholder="First Name"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.firstName && <span className="text-sm text-red-500">{errors.firstName.message}</span>}

          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.lastName && <span className="text-sm text-red-500">{errors.lastName.message}</span>}

          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}

          <select
            {...register("role")}
            className="select select-bordered w-full text-gray-800 bg-white"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <span className="text-sm text-red-500">{errors.role.message}</span>}

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

export default UpdateUser;
