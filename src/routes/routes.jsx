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
        element: <MemberShip />,
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
    ],
  },
]);

export default route;
