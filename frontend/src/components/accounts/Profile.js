import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshIcon } from "@heroicons/react/outline";

import { useAuth } from "../../contexts/AuthContext";
import { generateAvatar } from "../../utils/GenerateAvatar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile, setError } = useAuth();

  const [username, setUsername] = useState(currentUser?.displayName || "");
  const [avatars, setAvatars] = useState([]);
  const [activeAvatar, setActiveAvatar] = useState(
    currentUser?.photoURL || ""
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const loadFreshAvatars = useCallback(() => {
    const res = generateAvatar();
    setAvatars(res);
    if (!activeAvatar) {
      setActiveAvatar(res[0]);
    }
  }, [activeAvatar]);

  useEffect(() => {
    loadFreshAvatars();
  }, [loadFreshAvatars]);

  const handleSelectAvatar = (url) => {
    setActiveAvatar(url);
    setCustomAvatarUrl("");
  };

  const handleCustomUrlChange = (e) => {
    const url = e.target.value;
    setCustomAvatarUrl(url);
    if (url.trim()) {
      setActiveAvatar(url.trim());
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const finalPhotoURL =
      activeAvatar ||
      currentUser?.photoURL ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid}`;

    try {
      setError("");
      setLoading(true);

      const profile = {
        displayName:
          username || currentUser?.email?.split("@")[0] || "User",
        photoURL: finalPhotoURL,
      };

      await updateUserProfile(currentUser, profile);
      navigate("/");
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Profile Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Choose your avatar or enter a custom photo URL
          </p>
        </div>

        {/* Current Active Avatar Preview */}
        <div className="flex flex-col items-center my-4">
          <div className="relative">
            <img
              src={
                activeAvatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid}`
              }
              alt="Selected Avatar Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-600 shadow-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <span className="text-xs text-gray-400 mt-2">
            Active Preview
          </span>
        </div>

        <form className="space-y-6" onSubmit={handleFormSubmit}>
          {/* Avatar Choices Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Preset Avatars
              </label>

              <button
                type="button"
                onClick={loadFreshAvatars}
                className="flex items-center text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                <RefreshIcon className="h-4 w-4 mr-1" />
                Randomize
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {avatars.map((avatarUrl, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAvatar(avatarUrl)}
                  className={classNames(
                    avatarUrl === activeAvatar
                      ? "ring-4 ring-blue-600 dark:ring-blue-500 scale-105"
                      : "hover:opacity-80 hover:scale-102",
                    "cursor-pointer p-1 rounded-full bg-gray-50 dark:bg-gray-700 transition-all flex justify-center items-center"
                  )}
                >
                  <img
                    src={avatarUrl}
                    alt={`Avatar option ${index + 1}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom Avatar URL */}
          <div>
            <label
              htmlFor="customAvatar"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1"
            >
              Or Custom Image URL
            </label>

            <input
              id="customAvatar"
              name="customAvatar"
              type="url"
              value={customAvatarUrl}
              onChange={handleCustomUrlChange}
              placeholder="https://example.com/photo.jpg"
              className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Display Name */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1"
            >
              Display Name
            </label>

            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your display name"
              className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}