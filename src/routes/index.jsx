import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";

// layouts
import MainLayout from "@/layouts/MainLayout";
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));

// public pages
import Home from "@/pages/public/Home";
import AllAnnouncement from "@/pages/public/AllAnnouncement";
const SinglePost = lazy(() => import("@/pages/public/SinglePost"));

// authentication pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AllpostPage from "@/pages/public/AllpostPage";

// admin pages
const AllUsers = lazy(() => import("@/pages/admin/AllUsers"));
const Reports = lazy(() => import("@/pages/admin/Reports"));
const AddAnnouncement = lazy(() => import("@/pages/admin/Announcement"));
const ManageAnnouncement = lazy(() =>
  import("@/pages/admin/ManageAnnouncement")
);

// user pages
const Profile = lazy(() => import("@/pages/users/Profile"));
const AddPost = lazy(() => import("@/pages/users/AddPost"));
const MyPost = lazy(() => import("@/pages/users/MyPost"));
const PostComments = lazy(() => import("@/pages/users/PostComments"));
const MemberShip = lazy(() => import("@/pages/users/MemberShip"));

// routes
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import AuthRoute from "./AuthRoute";
import ErrorPage from "@/pages/ErrorPage";
import SuspenseProvider from "@/context/SuspenseContext";
import UserProfile from "@/pages/public/UserProfile";

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
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "user/:userId",
        element: <UserProfile />,
      },
      {
        path: "/register",
        element: (
          <AuthRoute>
            <Register />
          </AuthRoute>
        ),
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
            element: (
              <SuspenseProvider>
                <SinglePost />
              </SuspenseProvider>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <SuspenseProvider>
          <DashboardLayout />
        </SuspenseProvider>
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "profile",
        element: <Profile />,
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
        element: <PostComments />,
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
