import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { usersAPI } from "../../../features/users/usersAPI";
import type { TUser } from "../../../features/users/types";

type UpdateUserProps = {
  user: TUser | null;
};

type UpdateUserInputs = {
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
};

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.mixed<"user" | "admin">().oneOf(["user", "admin"]).required("Role is required"),
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
    setValue("firstName", user.firstname ?? ""); 
    setValue("lastName", user.lastname ?? "");
    setValue("email", user.email);
    setValue("role", user.role);
  } else {
    reset();
  }
}, [user, setValue, reset]);


  const onSubmit: SubmitHandler<UpdateUserInputs> = async (data) => {
    if (!user) return;
    try {
      await updateUser({ id: user.user_id, ...data }).unwrap();
      toast.success("User updated!");
      reset();
      (document.getElementById("update_user_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update user.");
    }
  };

  return (
    <dialog id="update_user_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-black max-w-lg mx-auto rounded-lg shadow-md border border-orange-300">
        <h3 className="font-bold text-xl mb-4 text-orange-600 border-b pb-2 border-orange-200">
          Update User
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
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="btn border border-black text-black hover:bg-black hover:text-white"
              onClick={() => {
                (document.getElementById("update_user_modal") as HTMLDialogElement)?.close();
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
