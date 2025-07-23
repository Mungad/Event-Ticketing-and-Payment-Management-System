import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../features/login/loginAPI";
import { loginSuccess } from "../../features/login/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading, isSuccess, data, error }] = useLoginUserMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginUser({ email, password }).unwrap();
      console.log("Login successful:", result);
      dispatch(loginSuccess({ user: result.user, token: result.token }));
    } catch (err) {
      console.error("Login failed:", err);
    }
  };


  useEffect(() => {
    if (isSuccess && data) {
      // Optional: Navigate based on role
      if (data.admin?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user?.role === "user") {
        navigate("/");
      }
    }
  }, [isSuccess, data, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">
          Sign In to MyTicket
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-600 font-semibold">
            Login failed. Please check your credentials.
          </p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-orange-600 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
