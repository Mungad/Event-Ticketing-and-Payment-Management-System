import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { usersAPI } from "../../../features/users/usersAPI";
import type { TUser } from "../../../features/users/types";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";

const UserView = () => {
  const { data: users, isLoading: loading, error } = usersAPI.useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });
  console.log("users",users)

  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<TUser | null>(null);

  const handleEdit = (user: TUser) => {
    setSelectedUser(user);
    (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (user: TUser) => {
    setUserToDelete(user);
    (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-12">
      <div className="flex justify-end mb-6">
        <button
          className="btn bg-orange-600 text-white hover:bg-orange-700 border border-orange-500 rounded-lg px-4 py-2 text-lg"
          onClick={() => (document.getElementById("create_modal") as HTMLDialogElement)?.showModal()}
        >
          Create User
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-orange-700">All Users</h2>

      {/* Modals */}
      <CreateUser />
      <UpdateUser user={selectedUser} />
      <DeleteUser user={userToDelete} />

      {loading && (
        <p className="text-center text-lg">
          <Loader2 className="animate-spin inline mr-2" />
          Loading users...
        </p>
      )}
      {error && <p className="text-red-500 text-center">Error fetching users</p>}

      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(users as TUser[]).map((user) => (
            <div
              key={user.user_id}
              className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-xl transition duration-200 relative"
            >
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  className="text-orange-600 hover:text-orange-800"
                  onClick={() => handleEdit(user)}
                  title="Edit"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(user)}
                  title="Delete"
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {user.firstname} {user.lastname}
              </h3>
              <p className="text-gray-700 mb-2">Email: {user.email}</p>
              <p className="text-gray-800 mb-1">Phone: {user.contact_phone || "N/A"}</p>
              <p className="text-gray-800 mb-1">Address: {user.address || "N/A"}</p>
              <p className="text-orange-700 font-medium capitalize">Role: {user.role}</p>
              <p className="text-sm text-gray-600 mt-2">
                Created: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-600 mt-6">No users found.</p>
      )}
    </div>
  );
};

export default UserView;
