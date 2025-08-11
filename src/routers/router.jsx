import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import RootLayout from "../layouts/RootLayout";
import Register from "../pages/Authentication/Register";
import Login from "../pages/Authentication/Login";
import ThesisProposalForm from "../pages/Thesis/ThesisProposalForm";
import AssignSupervisor from "../pages/Admin/AssignSupervisor";
import AdminRoute from "../Private/AdminRoute";
import Announcement from "../pages/Announcement/Announcement";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
import SupervisorDashboard from "../pages/Dashboard/SupervisorDashboard";
import ViewAnnouncement from "../pages/Announcement/ViewAnnouncements";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: () => fetch("http://localhost:5000/users/"),
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/thesis-proposal",
        Component: ThesisProposalForm,
        loader: () => fetch("http://localhost:5000/users/"),
      },
      {
        path: "view-announcement",
        Component: ViewAnnouncement
      },
      {
        path: "/assign-supervisor",
        element: (
          <AdminRoute>
            <AssignSupervisor></AssignSupervisor>
          </AdminRoute>
        ),
      },
      {
        path: "/announcements",
        Component: Announcement,
        loader: () => fetch("http://localhost:5000/users/"),
      },
      {
        path: "/admin-dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard></AdminDashboard>
          </AdminRoute>
        ),
      },
      {
        path: "/supervisor-dashboard",
        element: (  
            <SupervisorDashboard></SupervisorDashboard>
          
        ),
      },
      {
        path: "/student-dashboard",
        element: (
            <StudentDashboard></StudentDashboard>
  
        ),  
      }
    ]
  },
]);

export default router;
