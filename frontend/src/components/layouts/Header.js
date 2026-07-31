import { LogoutIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Logout from "../accounts/Logout";
import ThemeToggler from "./ThemeToggler";

export default function Header() {
  const [modal, setModal] = useState(false);

  const { currentUser } = useAuth();

  return (
    <>
      <nav className="px-2 sm:px-4 py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 text-sm rounded border dark:text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link to="/" className="flex">
            <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-900 dark:text-white">
              LET'S CHAT 
            </span>
          </Link>
          <div className="flex md:order-2 items-center">
            <ThemeToggler />

            {currentUser && (
              <>
                <button
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                  onClick={() => setModal(true)}
                  title="Logout"
                >
                  <LogoutIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <Link
                  to="/profile"
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-1"
                  title="Profile"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={
                      currentUser.photoURL ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`
                    }
                    alt="Profile"
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}
