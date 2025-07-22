import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreateUsersMutation } from "../../features/users/usersAPI";

const Register = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading, isSuccess, error }] = useCreateUsersMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.name && form.email && form.password) {
      try {
        await createUser({
          firstName: form.name,
          lastName: "User",
          email: form.email,
          password: form.password,
          role: "customer",
        }).unwrap();
      } catch (err) {
        console.error("Registration failed:", err);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/register/verify");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-600">
          Create Your Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 text-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 text-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 text-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-600 font-semibold">
            {"status" in error ? "Registration failed. Please try again." : ""}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-amber-600 font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
