import {
  createBrowserRouter,
} from "react-router";
import Home from "../pages/Home/Home";
import RootLayout from "../layouts/RootLayout";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
    ]
  },
]);

export default router;