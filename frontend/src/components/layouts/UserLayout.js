export default function UserLayout({ user, onlineUsersId }) {
  const avatarUrl =
    user?.photoURL ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || "default"}`;
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <div className="relative flex items-center">
      <img className="w-10 h-10 rounded-full object-cover" src={avatarUrl} alt={displayName} />
      <span className="block ml-2 text-gray-800 dark:text-gray-200 font-medium">
        {displayName}
      </span>
      {onlineUsersId?.includes(user?.uid) ? (
        <span className="bottom-0 left-7 absolute w-3.5 h-3.5 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
      ) : (
        <span className="bottom-0 left-7 absolute w-3.5 h-3.5 bg-gray-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
      )}
    </div>
  );
}

