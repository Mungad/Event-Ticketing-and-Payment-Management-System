import { useState } from "react";
import { Loader2, CalendarDays } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { usersAPI } from "../../../features/users/usersAPI";
import type { TUser } from "../../../../features/users/usersAPI";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";

const UserView = () => {
  const { data: users, isLoading: loading, error } = usersAPI.useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<TUser | null>(null);

  const handleEdit = (user: TUser) => {
    setSelectedUser(user);
    (document.getElementById("update_user_modal") as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (user: TUser) => {
    setUserToDelete(user);
    (document.getElementById("delete_user_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-12">
      {/* Create User Button */}
      <div className="flex justify-center mb-3 mt-3">
        <button
          className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg"
          onClick={() => (document.getElementById("create_user_modal") as HTMLDialogElement)?.showModal()}
        >
          Create User
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">All Users</h2>

      {/* Modals */}
      <CreateUser />
      <UpdateUser user={selectedUser} />
      <DeleteUser user={userToDelete} />

      {/* Display Users */}
      {loading && <p className="text-center text-lg"><Loader2 className="animate-spin inline mr-2" />Loading users...</p>}
      {error && <p className="text-red-500 text-center">Error fetching users</p>}

      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: TUser) => (
            <div
              key={user.id}
              className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-xl transition duration-200 relative"
            >
              {/* Actions */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
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

              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{user.username}</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <p>
                  <CalendarDays className="inline-block mr-1 h-4 w-4 text-indigo-500" />
                  Registered: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">No users found.</p>
      )}
    </div>
  );
};

export default UserView;
