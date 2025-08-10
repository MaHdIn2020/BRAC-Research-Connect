import {
  createBrowserRouter,
} from "react-router";
import Home from "../pages/Home/Home";
import RootLayout from "../layouts/RootLayout";
import Register from "../pages/Authentication/Register";
import Login from "../pages/Authentication/Login";
import ThesisProposalForm from "../pages/Thesis/ThesisProposalForm";
import Announcement from "../pages/Announcement/Announcement";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/register",
        Component: Register
      },
      {
        path: "/login",
        Component: Login
      },
      {
        path: "/thesis-proposal",
        Component: ThesisProposalForm,
      },
      {
        path: "/announcements",
        Component: Announcement,
      }
    ]
  },
]);

export default router;