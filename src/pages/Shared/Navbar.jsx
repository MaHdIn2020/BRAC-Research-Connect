import React from "react";
import ThemeToggle from "../../components/ThemeToggle";
import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          BRACU Research  <span className="text-[#7b1e3c]">Connect</span>
        </h1>

        <ul className="hidden md:flex space-x-8 text-slate-700 dark:text-gray-300 font-medium">
          <NavLink to='/'>
            <li className="hover:text-[#7b1e3c] transition">Home</li>
          </NavLink>
          <NavLink to='announcements'><li className="hover:text-[#7b1e3c] transition">Announcement</li></NavLink>
          <NavLink to='thesis-proposal'><li className="hover:text-[#7b1e3c] transition">Proposal Submission</li></NavLink>
          <li className="hover:text-[#7b1e3c] transition">Guidelines</li>
          <li className="hover:text-[#7b1e3c] transition">Contact</li>
          <li className="hover:text-[#7b1e3c] transition">About</li>
        </ul>


        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <NavLink to='/login'>
            <button className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition">
                Login
            </button>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
