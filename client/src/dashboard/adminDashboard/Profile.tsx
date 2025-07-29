// import { useAppSelector } from "@/redux/hooks";
// import { selectCurrentUser } from "@/redux/features/user/userSlice";
// import { Link } from "react-router-dom";

// const Profile = () => {
//   const user = useAppSelector(selectCurrentUser);

//   if (!user) {
//     return (
//       <div className="text-center p-8">
//         <p className="text-gray-500">No user data available.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6">
//       <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
//       <div className="space-y-4">
//         <div>
//           <span className="font-medium">Name:</span>{" "}
//           <span className="capitalize">{user.firstname} {user.lastname}</span>
//         </div>
//         <div>
//           <span className="font-medium">Email:</span> {user.email}
//         </div>
//         <div>
//           <span className="font-medium">Role:</span>{" "}
//           <span className="capitalize">{user.role}</span>
//         </div>
//         <div>
//           <span className="font-medium">Status:</span>{" "}
//           <span className="capitalize">{user.status}</span>
//         </div>
//       </div>

//       <div className="mt-6">
//         <Link
//           to="/admin/profile/update"
//           className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Update Profile
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Profile;
