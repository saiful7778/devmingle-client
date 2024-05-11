import React from "react";
import ReactDOM from "react-dom/client";
import "@/assets/styles/style.css";
import { RouterProvider } from "react-router-dom";
import route from "@/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthContextProvider from "@/context/AuthContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={route} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
