import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { toast } from "sonner";
import { supportAPI } from "../features/support/supportAPI";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type TSupportTicket = {
  subject: string;
  description: string;
  user_id?: number;
};

export default function MyProfile() {
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TSupportTicket>();

  const [submitTicket] = supportAPI.useSubmitSupportTicketMutation();

  const onSubmit = async (data: TSupportTicket) => {
    try {
      if (!user) return;
      await submitTicket({
        user_id: user.user_id,
        ...data,
      }).unwrap();
      toast.success("Support ticket submitted successfully!");
      reset();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-xl font-semibold">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow px-4 py-8 md:px-12 lg:px-24">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">My Profile</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-300">
            <h2 className="text-xl font-semibold text-black mb-4">User Details</h2>
            <div className="space-y-3 text-sm text-black">
              <p>
                <span className="font-medium">First Name:</span> {user.firstname}
              </p>
              <p>
                <span className="font-medium">Last Name:</span> {user.lastname}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user.role}
              </p>
            </div>
          </div>

          {/* Support Ticket Form */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-300">
            <h2 className="text-xl font-semibold text-black mb-4">Send a Support Ticket</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label text-black">Subject</label>
                <input
                  type="text"
                  {...register("subject", { required: "Subject is required" })}
                  className="input input-bordered w-full bg-white text-black border border-black"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label text-black">Description</label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="textarea textarea-bordered w-full bg-white text-black min-h-[100px] border border-black"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Submit Ticket"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
