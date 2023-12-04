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
import Comments from "../pages/Comments";
import MemberShip from "../pages/MemberShip";
import PostItem from "../pages/PostItem";
import AllpostPage from "../pages/AllpostPage";
import AllUsers from "../pages/admin/AllUsers";
import AdminRoute from "./AdminRoute";
import { Outlet } from "react-router-dom";
import Reports from "../pages/admin/Reports";
import AllAnnouncement from "../pages/AllAnnouncement";
import AddAnnouncement from "../pages/admin/Announcement";
import ManageAnnouncement from "../pages/admin/ManageAnnouncement";

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
      {
        path: "/membership",
        element: (
          <PrivateRoute>
            <MemberShip />
          </PrivateRoute>
        ),
      },
      {
        path: "/announcement",
        element: <AllAnnouncement />,
      },
      {
        path: "/post",
        children: [
          {
            index: true,
            element: <AllpostPage />,
          },
          {
            path: ":postID",
            element: <PostItem />,
          },
        ],
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
      {
        path: "comments/:postId",
        element: <Comments />,
      },

      // admin routes
      {
        path: "admin",
        errorElement: <ErrorPage />,
        element: (
          <AdminRoute>
            <Outlet />
          </AdminRoute>
        ),
        children: [
          {
            path: "users",
            element: <AllUsers />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "add_announcement",
            element: <AddAnnouncement />,
          },
          {
            path: "all_announcement",
            element: <ManageAnnouncement />,
          },
        ],
      },
    ],
  },
]);

export default route;
