// import { useEffect, useState } from "react";
// import { useGetAllUsersQuery, useDeleteUserMutation } from "../features/user/userApi";

// import { toast } from "sonner";
// import { Trash2 } from "lucide-react";
// import type { TUser } from "../../../features/users/usersAPI";

// const Users = () => {
//   const { data: users, isLoading, isError, refetch } = useGetAllUsersQuery();
//   const [deleteUser] = useDeleteUserMutation();
//   const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

//   useEffect(() => {
//     if (isError) {
//       toast.error("Failed to fetch users");
//     }
//   }, [isError]);

//   const handleDelete = async (userId: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       setDeletingUserId(userId);
//       await deleteUser(userId).unwrap();
//       toast.success("User deleted successfully");
//       refetch();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to delete user");
//     } finally {
//       setDeletingUserId(null);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-semibold mb-4">All Users</h2>

//       {isLoading ? (
//         <p className="text-gray-500">Loading users...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left px-4 py-2">#</th>
//                 <th className="text-left px-4 py-2">Name</th>
//                 <th className="text-left px-4 py-2">Email</th>
//                 <th className="text-left px-4 py-2">Role</th>
//                 <th className="text-left px-4 py-2">Status</th>
//                 <th className="text-left px-4 py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {users?.map((user: TUser, index: number) => (
//                 <tr key={user.user_id}>
//                   <td className="px-4 py-2">{index + 1}</td>
//                   <td className="px-4 py-2 capitalize">{user.firstname} {user.lastname}</td>
//                   <td className="px-4 py-2">{user.email}</td>
//                   <td className="px-4 py-2 capitalize">{user.role}</td>
//                   <td className="px-4 py-2 capitalize">{user.status}</td>
//                   <td className="px-4 py-2">
//                     <button
//                       className="text-red-600 hover:text-red-800 disabled:opacity-50"
//                       onClick={() => handleDelete(user.user_id)}
//                       disabled={deletingUserId === user.user_id}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {users?.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="text-center text-gray-500 py-4">
//                     No users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;
