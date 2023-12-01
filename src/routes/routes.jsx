import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import DashboardLayout from "../layouts/DashboardLayout";
import UserProfile from "../pages/users/UserProfile";
import AddPost from "../pages/users/AddPost";
import MyPost from "../pages/users/MyPost";
import PrivateRoute from "./PrivateRoute";

const route = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "add_post",
        element: <AddPost />,
      },
      {
        path: "my_post",
        element: <MyPost />,
      },
    ],
  },
]);

export default route;
