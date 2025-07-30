import { toast } from "sonner";
import { usersAPI } from "../../../features/users/usersAPI";
import type { TUser } from "../../../features/users/types";

type DeleteUserProps = {
  user: TUser | null;
};

const DeleteUser = ({ user }: DeleteUserProps) => {
  const [deleteUser, { isLoading }] = usersAPI.useDeleteUserMutation({
    fixedCacheKey: "deleteUser",
  });

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user.user_id).unwrap();
      toast.success("User deleted!");
      (document.getElementById("delete_user_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <dialog id="delete_user_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-black rounded-xl shadow-xl max-w-sm">
        <h3 className="font-bold text-lg mb-4 text-orange-600">Delete User</h3>
        <p className="mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-orange-700">{user?.firstname} {user?.lastname}</span>?
        </p>
        <div className="modal-action">
          <button
            className="btn bg-orange-600 text-white hover:bg-orange-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            className="btn border border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={() =>
              (document.getElementById("delete_user_modal") as HTMLDialogElement)?.close()
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteUser;
