import React, { use, useContext } from "react";
import ThemeToggle from "../../components/ThemeToggle";
import { NavLink, useLoaderData } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const data = useLoaderData();
  const User = data.find((User) => User.email === user?.email);
  console.log("User in Navbar:", User);

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          BRACU Research <span className="text-[#7b1e3c]">Connect</span>
        </h1>

        <ul className="hidden md:flex space-x-8 text-slate-700 dark:text-gray-300 font-medium">
          <NavLink to="/">
            <li className="hover:text-[#7b1e3c] transition">Home</li>
          </NavLink>
          {User?.role === "student" && (
                      <NavLink to="thesis-proposal">
                        <li className="hover:text-[#7b1e3c] transition">
                          Proposal Submission
                        </li>
                      </NavLink>
          )

          }

          {
            User?.role === "student" && (
              <NavLink to='/group'>
                <li className="hover:text-[#7b1e3c] transition">
                        Group
                </li>
              </NavLink>
            )
          }
          { User?.role === "supervisor" ||  User?.role === "student" && (
            <NavLink to='/view-announcement'>
              <li className="hover:text-[#7b1e3c] transition">
                View Announcement
              </li>
            </NavLink>
          )
          }
          <li className="hover:text-[#7b1e3c] transition">Guidelines</li>
          <li className="hover:text-[#7b1e3c] transition">Contact</li>
          {User?.role === "admin" && (
            <NavLink to='admin-dashboard'>Dashboard</NavLink>
          )
          }
          {User?.role === "supervisor" && (
            <NavLink to='supervisor-dashboard'>Dashboard</NavLink>
          )
          }
          {User?.role === "student" && (
            <NavLink to='student-dashboard'>Dashboard</NavLink>
          )
          }
        </ul>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <NavLink to='/login'><button
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
