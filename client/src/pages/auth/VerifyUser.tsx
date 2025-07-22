import { useState } from "react";
import { useVerifyUserMutation } from "../../features/users/usersAPI";
import { useNavigate } from "react-router";

const VerifyUser = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verifyUser, { isLoading, isSuccess, error }] = useVerifyUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyUser({ email, code }).unwrap();
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  if (isSuccess) {
    navigate("/login");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-600">
          Verify Your Email
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-black font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-black font-medium">Verification Code</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-600 font-semibold">
            Verification failed. Check your email and code.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyUser;
