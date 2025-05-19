import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaEdit,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import DocTitle from "../components/DocTitle";

export default function Profile() {
  DocTitle("Shopee Sales Dashboard - My Profile");
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  async function handleUpdateProfile(e) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);

      await updateUserProfile(currentUser, { displayName });
      setMessage("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setError("");
      await logout();
      navigate("/login");
    } catch (error) {
      setError("Failed to log out");
      console.error(error);
    }
  }

  function getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] py-12 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full opacity-5 blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl z-0"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
            My Profile
          </h1>
          <p className="text-gray-400 mt-2">Manage your account information</p>
        </div>

        <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg border border-[#333333]">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded-md text-sm">
              {message}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-orange-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(currentUser?.displayName)}
                </div>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-2.5 bg-[#252525] border border-[#333333] rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(currentUser?.displayName || "");
                      }}
                      className="cursor-pointer px-4 py-2 bg-[#252525] hover:bg-[#333333] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    {currentUser?.displayName || "User"}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer ml-2 text-orange-400 hover:text-orange-300 text-sm"
                      title="Edit profile"
                    >
                      <FaEdit />
                    </button>
                  </h2>
                  <p className="text-gray-400 flex items-center mt-1">
                    <FaEnvelope className="mr-2 text-orange-500" />
                    {currentUser?.email}
                  </p>
                  <p className="text-gray-500 mt-1 text-sm">
                    Account created:{" "}
                    {currentUser?.metadata?.creationTime
                      ? new Date(
                          currentUser.metadata.creationTime
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-[#333333] pt-6 mt-6">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <FaUser className="mr-2 text-orange-500" />
              Account Settings
            </h3>

            <div className="space-y-4">
              <div>
                <button
                  onClick={() => navigate("/reset-password")}
                  className="cursor-pointer w-full p-3 flex items-center justify-between bg-[#252525] hover:bg-[#333333] border border-[#333333] rounded-lg transition-colors text-white"
                >
                  <span className="flex items-center">
                    <FaLock className="mr-2 text-orange-500" />
                    Change Password
                  </span>
                  <FaArrowRight className="text-gray-500" />
                </button>
              </div>

              <div>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer w-full p-3 flex items-center justify-between bg-[#252525] hover:bg-[#333333] border border-[#333333] rounded-lg transition-colors text-white"
                >
                  <span className="flex items-center">
                    <FaSignOutAlt className="mr-2 text-orange-500" />
                    Logout
                  </span>
                  <FaArrowRight className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
