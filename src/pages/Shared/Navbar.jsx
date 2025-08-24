import React, { useContext, useState } from "react";
import { NavLink, useLoaderData } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Bell } from "lucide-react";

const API_BASE = "http://localhost:3000";

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const data = useLoaderData();
  const User = data.find((u) => u.email === user?.email);

  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = async () => {
    setShowNotifications(!showNotifications);

    if (!User?.isSeen) {
      await fetch(`${API_BASE}/users/${User._id}/notifications/seen`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          BRACU Research <span className="text-[#7b1e3c]">Connect</span>
        </h1>

        {/* Middle - Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-slate-700 dark:text-gray-300 font-medium">
          <NavLink to="/">
            <li className="hover:text-[#7b1e3c] transition">Home</li>
          </NavLink>

          {User?.role === "student" && (
            <>
              <NavLink to="thesis-proposal">
                <li className="hover:text-[#7b1e3c] transition">
                  Proposal Submission
                </li>
              </NavLink>
            </>
          )}

          {(User?.role === "supervisor" || User?.role === "student") && (
            <NavLink to="/view-announcement">
              <li className="hover:text-[#7b1e3c] transition">
                View Announcement
              </li>
            </NavLink>
          )}

          {User?.role === "admin" && (
            <NavLink to="admin-dashboard">
              <li className="hover:text-[#7b1e3c] transition">Dashboard</li>
            </NavLink>
          )}
          {User?.role === "supervisor" && (
            <NavLink to="supervisor-dashboard">
              <li className="hover:text-[#7b1e3c] transition">Dashboard</li>
            </NavLink>
          )}
          {User?.role === "student" && (
            <NavLink to="student-dashboard">
              <li className="hover:text-[#7b1e3c] transition">Dashboard</li>
            </NavLink>
          )}
        </ul>

        {/* Right - Notifications, Auth */}
        <div className="flex items-center space-x-4 relative">
          {/* Notifications Bell */}
          {(User?.role === "student" || User?.role === "supervisor") && (
            <div className="relative">
              <button onClick={toggleNotifications} className="relative">
                <Bell className="text-slate-900 dark:text-white" size={22} />
                {!User?.isSeen && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                  {User?.notifications?.length > 0 ? (
                    [...User.notifications] // make a copy
                      .reverse() // reverse order so newest is first
                      .map((n, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                          onClick={() => {
                            if (n.link) window.location.href = n.link;
                          }}
                        >
                          <p className="font-medium">{n.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(n.date).toLocaleString()}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500">
                      No notifications
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Auth Buttons */}
          {user ? (
            <NavLink to="/login">
              <button
                onClick={logOut}
                disabled={loading}
                className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition disabled:opacity-60"
              >
                Logout
              </button>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <button className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition">
                Login
              </button>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;