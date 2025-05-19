import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaLock, FaEnvelope, FaUser } from "react-icons/fa";
import DocTitle from "../components/DocTitle";
import { FaGoogle } from "react-icons/fa";

export default function Signup() {
  DocTitle("Shopee Sales Dashboard - Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleSignIn() {
    try {
      setError("");
      setLoading(true);
      await googleLogin();
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password, name);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError(
          "Email already in use. Please use a different email or login."
        );
      } else {
        setError("Failed to create an account. Please try again.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full opacity-5 blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl z-0"></div>

      <div className="w-full max-w-md relative z-10 my-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Join Shopee Sales Dashboard</p>
        </div>

        <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg border border-[#333333]">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  placeholder="Create a password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-lg hover:shadow-orange-500/20 hover:translate-y-[-2px] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-[#333333]"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-[#333333]"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full cursor-pointer p-3 bg-[#252525] hover:bg-[#333333] border border-[#444444] text-white font-medium rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FaGoogle className="text-white-500" />
            <span>Continue with Google</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-400 hover:text-orange-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
