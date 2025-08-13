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
import ManageUsers from "../pages/Admin/ManageUsers";
import CreateGroup from "../pages/StudentGroup/CreateGroup";
import FindGroup from "../pages/StudentGroup/FindGroup";
import CreateFaqs from "../pages/Admin/CreateFaqs";
import AllFaqs from "../pages/FAQs/AllFaqs";
import ViewProposals from "../pages/Thesis/ViewProposals";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: () => fetch("http://localhost:3000/users/"),
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
        loader: () => fetch("http://localhost:3000/users/"),
      },
      {
        path: "view-announcement",
        Component: ViewAnnouncement
      },
      {
        path: '/manage-users',
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
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
        loader: () => fetch("http://localhost:3000/users/"),
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
        loader: () => fetch("http://localhost:3000/users/"),
      },
      {
        path: "/student-dashboard",
        Component: StudentDashboard,
        loader: () => fetch("http://localhost:3000/users/") 
      },
      {
        path: "/find-group/:id",
        Component: FindGroup
      },
      {
        path: "/create-group/:id",
        Component: CreateGroup
      },
      {
        path: "/manage-faqs",  // ✅ New FAQ management route
        element: (
          <AdminRoute>
            <CreateFaqs></CreateFaqs>
          </AdminRoute>
        ),
      },
      {
        path:'/all-faqs',
        element:<AllFaqs></AllFaqs>
      },
      {
        path: "/view-proposals",
        Component: ViewProposals,
        loader: () => fetch("http://localhost:3000/users/")
      }
    ]
  },
]);

export default router;
