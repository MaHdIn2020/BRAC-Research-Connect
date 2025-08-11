import React from "react";
import { Link } from "react-router";
import {
  Users,
  FileText,
  UserCheck,
  Bell,
  Calendar,
  Search,
  ClipboardList,
  Clock,
  Settings,
} from "lucide-react";

const adminModules = [
  {
    title: "User Management",
    description: "Create, update, and delete student/supervisor accounts.",
    icon: <Users className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/manage-users",
  },
  {
    title: "Thesis Proposal Submissions",
    description: "View, approve, or reject thesis proposals.",
    icon: <FileText className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/proposals",
  },
  {
    title: "Assign Supervisors",
    description: "Manually or automatically assign supervisors to students.",
    icon: <UserCheck className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/assign-supervisor",
  },
  {
    title: "Announcements",
    description: "Broadcast notifications to all users.",
    icon: <Bell className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/announcements",
  },
  {
    title: "Deadline Management",
    description: "Set and manage deadlines for thesis stages.",
    icon: <Calendar className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/deadlines",
  },
  {
    title: "Search & Filtering",
    description: "Search/filter across thesis topics and research papers.",
    icon: <Search className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/search",
  },
  {
    title: "Thesis Listings",
    description: "View all theses with assigned supervisors.",
    icon: <ClipboardList className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/thesis-list",
  },
  {
    title: "Final Grades",
    description: "Assign final grades after thesis review.",
    icon: <Clock className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/final-grades",
  },
  {
    title: "System Settings",
    description: "Manage FAQs, notifications, and email alerts.",
    icon: <Settings className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/settings",
  },
];

const AdminDashboard = () => {
  return (
    <section className="bg-white dark:bg-slate-900 min-h-screen transition-colors px-6 py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-gray-400 mb-12 max-w-3xl">
          Manage all aspects of the BRACU Research Connect platform — from user accounts to thesis tracking, announcements, and system settings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminModules.map((mod, idx) => (
            <Link
              key={idx}
              to={mod.link}
              className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl shadow hover:shadow-lg hover:scale-105 transition transform"
            >
              <div className="mb-4">{mod.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {mod.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm">
                {mod.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
